// "Restore purchases": the buyer types the email they paid with; if Stripe has paid purchases for it, we email a fresh private link.
// The answer is always the same, so nobody can use this to find out who has bought something.
import { json, stripe, signToken, hasPaidStory, loadContent, accessEmail, sendEmail, SITE_URL } from './_shared.mjs';

// Best-effort limit (per running function copy): a few asks per email and per visitor each hour.
const seen = new Map();
const tooMany = (k, max = 5, ms = 3600000) => {
  const now = Date.now(), a = (seen.get(k) || []).filter(t => now - t < ms);
  if (a.length >= max) { seen.set(k, a); return true; }
  a.push(now); seen.set(k, a);
  if (seen.size > 5000) seen.clear();
  return false;
};
const SAME = { ok: true, message: 'If that email has bought something from us, we have just sent it a link. Please check your spam folder too.' };

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Not allowed.' }, 405);
  let body; try { body = await req.json(); } catch { return json({ error: 'That did not work.' }, 400); }
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(email) || email.length > 254) return json({ error: 'Please check the email address.' }, 400);
  const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || '';
  if (tooMany('e:' + email) || (ip && tooMany('i:' + ip, 20))) return json(SAME);

  try {
    const q = new URLSearchParams({ limit: '30', 'customer_details[email]': email });
    q.append('expand[]', 'data.payment_intent.latest_charge');
    const list = await stripe('GET', '/v1/checkout/sessions?' + q.toString());
    const good = (list.data || []).filter(hasPaidStory);
    if (good.length) {
      const content = loadContent();
      const titles = [...new Set(good.map(s => { const p = content.AUDIOBOOKS.find(a => a.slug === s.metadata.product_slug); return p ? p.title : ''; }).filter(Boolean))];
      const base = SITE_URL();
      const msg = accessEmail({ link: base + '/mystories.html?t=' + signToken(good.slice(0, 20).map(s => s.id)), titles, findUrl: base + '/find-stories.html' });
      await sendEmail({ to: email, ...msg });
    }
  } catch (e) {
    console.error('find-stories:', e.message);
    if (e.code === 'nokey' || e.code === 'nomail') return json({ error: 'Sorry, this is not switched on yet.' }, 503);
    return json({ error: 'Sorry, we could not do that just now. Please try again in a little while.' }, 502);
  }
  return json(SAME);
};

export const config = { path: '/api/find-stories' };
