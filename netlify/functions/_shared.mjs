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
