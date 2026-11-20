// Shared helpers for the Netlify Functions. (A file starting with "_" is not turned into a function.)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

export const STRIPE_API = process.env.STRIPE_API_BASE || 'https://api.stripe.com';

// Only these websites may start a checkout (so the return address cannot be faked).
const ALLOWED_ORIGINS = [/^https:\/\/(www\.)?misssophiabooks\.com$/, /^https:\/\/[a-z0-9-]+\.netlify\.app$/, /^http:\/\/localhost:\d+$/];
export const safeOrigin = (req) => {
  const o = req.headers.get('origin') || '';
  return ALLOWED_ORIGINS.some(r => r.test(o)) ? o : 'https://misssophiabooks.com';
};

export const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

// The prices, product ids and checkout wording come from content.js, the one place Paul edits (netlify.toml bundles it with the functions).
export function loadContent() {
  const dirs = [process.cwd(), process.env.LAMBDA_TASK_ROOT, '/var/task'].filter(Boolean);
  const file = dirs.map(d => path.join(d, 'content.js')).find(p => fs.existsSync(p));
  if (!file) throw new Error('content.js was not bundled with the function');
  const code = fs.readFileSync(file, 'utf8').replace(/\bconst /g, 'var ') + ';({AUDIOBOOKS, WISDOM, CHECKOUT_WORDING})';
  return vm.runInNewContext(code);
}

export function findProduct(content, productId) {
  const paid = content.AUDIOBOOKS.concat(content.WISDOM.filter(w => w.access === 'paid'));
  return paid.find(x => x.access === 'paid' && x.productId === productId) || null;
}

export async function stripe(method, pathname, form, opts = {}) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { const e = new Error('STRIPE_SECRET_KEY is not set'); e.code = 'nokey'; throw e; }
  const res = await fetch(STRIPE_API + pathname, {
    method,
    headers: {
      authorization: 'Bearer ' + key,
      ...(opts.version ? { 'stripe-version': opts.version } : {}),
      ...(form ? { 'content-type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: form ? form.toString() : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error((data.error && data.error.message) || ('Stripe error ' + res.status)); e.status = res.status; throw e; }
  return data;
}

// ---------- Private library: signed "phone tokens" and private audio links ----------
import crypto from 'node:crypto';

// The token is just a signed list of paid Stripe session ids. Stripe is the record of who bought what;
// every check asks Stripe again, so nothing here can be forged. The signing secret is LIBRARY_SECRET
// (an environment variable). If it is not set yet, a key derived from the Stripe key is used so things still work.
const b64u = (buf) => Buffer.from(buf).toString('base64url');
const sigKey = () => {
  if (process.env.LIBRARY_SECRET) return process.env.LIBRARY_SECRET;
  const base = process.env.STRIPE_SECRET_KEY;
  if (!base) { const e = new Error('no signing secret'); e.code = 'nokey'; throw e; }
  return crypto.createHmac('sha256', base).update('msb-library-token-v1').digest('hex');
};
export function signToken(sessionIds) {
  const body = b64u(JSON.stringify({ s: sessionIds, i: Math.floor(Date.now() / 1000) }));
  const sig = b64u(crypto.createHmac('sha256', sigKey()).update(body).digest());
  return body + '.' + sig;
}
export function verifyToken(token) {
  if (typeof token !== 'string' || token.length > 2000 || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const good = b64u(crypto.createHmac('sha256', sigKey()).update(body).digest());
  const a = Buffer.from(sig || ''), b = Buffer.from(good);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    return Array.isArray(p.s) && p.s.every(x => /^cs_(test|live)_[A-Za-z0-9]+$/.test(x)) ? p.s : null;
  } catch { return null; }
}

// A fully refunded payment no longer opens the story. Needs the session fetched with expand[]=payment_intent.latest_charge.
// If Stripe did not give us the charge (for example it is not expanded), we do NOT lock the buyer out.
export const isRefunded = (s) => {
  const pi = s && s.payment_intent;
  const ch = pi && typeof pi === 'object' ? pi.latest_charge : null;
  return !!(ch && typeof ch === 'object' && ch.refunded === true);
};
export const hasPaidStory = (s) => !!(s && s.payment_status === 'paid' && s.metadata && s.metadata.product_slug && !isRefunded(s));

// Which items does this phone own? Asks Stripe about every paid (and not fully refunded) session in the tokens.
export async function ownedFromTokens(tokens) {
  const ids = new Set();
  (Array.isArray(tokens) ? tokens.slice(0, 10) : []).forEach(t => { const s = verifyToken(t); if (s) s.slice(0, 20).forEach(x => ids.add(x)); });
  const owned = new Set();
  await Promise.all([...ids].map(async id => {
    try {
      let s;
      try { s = await stripe('GET', '/v1/checkout/sessions/' + id + '?expand[]=payment_intent.latest_charge'); }
      catch (e) { if (e.code === 'nokey') throw e; s = await stripe('GET', '/v1/checkout/sessions/' + id); }
      if (hasPaidStory(s)) owned.add(s.metadata.product_slug);
    } catch (e) { if (e.code === 'nokey') throw e; }
  }));
  return [...owned];
}

// A short-lived private link to one file in the R2 bucket (S3-style signed address). No packages needed.
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
export function presignGet({ host, bucket, key, accessKeyId, secret, region = 'auto', expires = 21600, now = new Date(), pathStyle = true }) {
  const amz = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const day = amz.slice(0, 8);
  const scope = `${day}/${region}/s3/aws4_request`;
  const path = (pathStyle ? '/' + enc(bucket) : '') + '/' + key.split('/').map(enc).join('/');
  const q = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${accessKeyId}/${scope}`,
    'X-Amz-Date': amz,
    'X-Amz-Expires': String(expires),
    'X-Amz-SignedHeaders': 'host',
  };
  const qs = Object.keys(q).sort().map(k => `${enc(k)}=${enc(q[k])}`).join('&');
  const canon = ['GET', path, qs, `host:${host}\n`, 'host', 'UNSIGNED-PAYLOAD'].join('\n');
  const sts = ['AWS4-HMAC-SHA256', amz, scope, crypto.createHash('sha256').update(canon).digest('hex')].join('\n');
  const h = (k, d) => crypto.createHmac('sha256', k).update(d).digest();
  const kSign = h(h(h(h('AWS4' + secret, day), region), 's3'), 'aws4_request');
  const sig = crypto.createHmac('sha256', kSign).update(sts).digest('hex');
  return `https://${host}${path}?${qs}&X-Amz-Signature=${sig}`;
}
export function r2Config() {
  const { R2_ACCOUNT_ID: acct, R2_ACCESS_KEY_ID: akid, R2_SECRET_ACCESS_KEY: secret, R2_BUCKET: bucket } = process.env;
  if (!acct || !akid || !secret || !bucket) { const e = new Error('R2 is not configured'); e.code = 'nor2'; throw e; }
  return { host: `${acct}.r2.cloudflarestorage.com`, bucket, accessKeyId: akid, secret };
}

// ---------- Stage 5: webhook check, access email ----------
export const SITE_URL = () => (process.env.SITE_URL || 'https://misssophiabooks.com').replace(/\/$/, '');

// Stripe signs every webhook call: header "t=<time>,v1=<signature>". We recompute it from the raw body and the endpoint's signing secret.
export function verifyStripeSignature(raw, header, secret, toleranceSeconds = 300, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (!raw || !header || !secret) return false;
  const parts = String(header).split(',').map(p => p.trim().split('='));
  const t = (parts.find(p => p[0] === 't') || [])[1];
  const sigs = parts.filter(p => p[0] === 'v1').map(p => p[1]);
  if (!t || !sigs.length || !/^\d+$/.test(t) || Math.abs(nowSeconds - Number(t)) > toleranceSeconds) return false;
  const good = Buffer.from(crypto.createHmac('sha256', secret).update(t + '.' + raw).digest('hex'));
  return sigs.some(s => { const b = Buffer.from(s || ''); return b.length === good.length && crypto.timingSafeEqual(b, good); });
}

const h = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The access email: one personal link that opens the buyer's library on any phone. No password.
// It also confirms what the buyer agreed at checkout (instant access, and that the 14-day cancellation right ends once they start listening): UK law asks for that confirmation.
export function accessEmail({ link, titles, findUrl, siteUrl = 'https://misssophiabooks.com' }) {
  const what = titles.length ? titles.join(' and ') : 'your stories';
  const subject = 'Your stories are ready';
  const agreed = 'You asked for your audiobook to start straight away, and understood that the 14-day cancellation right ends once you begin listening. If anything is not quite right, just reply to this email and Paul will be glad to help.';
  const text = [
    'Hello,', '',
    'Thank you for choosing ' + what + '. I am so glad it has found its way to you.', '',
    'This is your own personal link. Open it wherever you like to listen, and your stories are waiting, with no password:', '',
    link, '',
    'Keep this email, and you can open your stories on any phone, tablet or computer, any time. If you ever lose it, "Restore purchases" on the website will send you a fresh link: ' + findUrl, '',
    agreed, '',
    'With warm wishes,', 'Miss Sophia Books',
  ].join('\n');
  const html = `<div style="font-family:Georgia,serif;font-size:17px;line-height:1.55;color:#223;max-width:34em">
<p>Hello,</p>
<p>Thank you for choosing <b>${h(what)}</b>. I am so glad it has found its way to you.</p>
<p>This is your own personal link. Open it wherever you like to listen, and your stories are waiting, with no password:</p>
<p><a href="${h(link)}" style="display:inline-block;background:#6b5ca5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:24px">Open my stories</a></p>
<p>Keep this email, and you can open your stories on any phone, tablet or computer, any time. If you ever lose it, <a href="${h(findUrl)}">“Restore purchases”</a> on the website will send you a fresh link.</p>
<p style="font-size:15px;color:#556">${h(agreed)}</p>
<p>With warm wishes,<br>Miss Sophia Books</p></div>`;
  return { subject, text, html };
}

// Sends one email through Resend (resend.com). RESEND_API_KEY, and optionally MAIL_FROM / MAIL_REPLY_TO, are environment variables.
// idempotencyKey makes sure that if Stripe calls us twice for the same purchase, the buyer is not emailed twice.
export async function sendEmail({ to, subject, text, html, idempotencyKey }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { const e = new Error('RESEND_API_KEY is not set'); e.code = 'nomail'; throw e; }
  const res = await fetch((process.env.RESEND_API_BASE || 'https://api.resend.com') + '/emails', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json', ...(idempotencyKey ? { 'idempotency-key': idempotencyKey } : {}) },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || 'Miss Sophia Books <sophia@misssophiabooks.com>',
      to: [to],
      reply_to: process.env.MAIL_REPLY_TO || 'misssophiabooks@gmail.com',
      subject, text, html,
    }),
  });
  if (!res.ok) { const d = await res.json().catch(() => ({})); const e = new Error('Resend error ' + res.status + ' ' + (d.message || '')); e.status = res.status; throw e; }
  return true;
}
