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

export async function stripe(method, pathname, form) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) { const e = new Error('STRIPE_SECRET_KEY is not set'); e.code = 'nokey'; throw e; }
  const res = await fetch(STRIPE_API + pathname, {
    method,
    headers: { authorization: 'Bearer ' + key, ...(form ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
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

// Which items does this phone own? Asks Stripe about every paid session in the tokens.
export async function ownedFromTokens(tokens) {
  const ids = new Set();
  (Array.isArray(tokens) ? tokens.slice(0, 10) : []).forEach(t => { const s = verifyToken(t); if (s) s.slice(0, 20).forEach(x => ids.add(x)); });
  const owned = new Set();
  await Promise.all([...ids].map(async id => {
    try {
      const s = await stripe('GET', '/v1/checkout/sessions/' + id);
      if (s.payment_status === 'paid' && s.metadata && s.metadata.product_slug) owned.add(s.metadata.product_slug);
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
