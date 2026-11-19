// Starts a Stripe Checkout for one paid item and returns the address to send the buyer to.
// The price comes from content.js on the server, never from the page. The secret key is an environment variable (STRIPE_SECRET_KEY).
import { json, safeOrigin, loadContent, findProduct, stripe } from './_shared.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Please use the Buy button.' }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: 'That did not work. Please try again.' }, 400); }

  let content;
  try { content = loadContent(); } catch (e) { console.error(e); return json({ error: 'Checkout is not ready yet.' }, 500); }
  const item = findProduct(content, body.productId);
  if (!item) return json({ error: 'We could not find that item.' }, 404);
  if (body.agreed !== true) return json({ error: 'Please tick the box to say you agree, then try again.' }, 400);

  const W = content.CHECKOUT_WORDING;
  const now = new Date().toISOString();
  const marketing = body.marketing === true;
  const base = safeOrigin(req);

  const f = new URLSearchParams();
  f.set('mode', 'payment');
  f.set('locale', 'en-GB');
  f.set('line_items[0][quantity]', '1');
  f.set('line_items[0][price_data][currency]', 'gbp');
  f.set('line_items[0][price_data][unit_amount]', String(item.price));
  f.set('line_items[0][price_data][product_data][name]', item.title + (item.kind === 'Audiobook' ? ' (audiobook)' : ''));
  // Stripe's Managed Payments needs a product tax category on every item (set per item in content.js)
  if (item.taxCode) f.set('line_items[0][price_data][product_data][tax_code]', item.taxCode);
  f.set('success_url', base + '/thanks.html?session_id={CHECKOUT_SESSION_ID}');
  f.set('cancel_url', base + '/audiobook/' + item.slug);
  // the purchase record: what was bought, and exactly what the buyer agreed to and when
  f.set('metadata[product_id]', item.productId);
  f.set('metadata[product_slug]', item.slug);
  f.set('metadata[digital_agreed_at]', now);
  f.set('metadata[digital_wording]', W.digital.slice(0, 500));
  f.set('metadata[marketing_optin]', marketing ? 'yes' : 'no');
  f.set('metadata[marketing_choice_at]', now);
  f.set('metadata[marketing_wording]', W.marketing.slice(0, 500));

  try {
    const s = await stripe('POST', '/v1/checkout/sessions', f);
    return json({ url: s.url });
  } catch (e) {
    console.error('create-checkout:', e.message);
    if (e.code === 'nokey') return json({ error: 'Payments are not switched on yet.' }, 503);
    // Temporary while we test: pass Stripe's own message back (any key-like text blanked out) so it can be read without the logs.
    const detail = String(e.message || '').replace(/[spr]k_(test|live)_[A-Za-z0-9*._-]*/g, '[key]').slice(0, 300);
    return json({ error: 'Sorry, we could not start the payment. Please try again.', detail }, 502);
  }
};

export const config = { path: '/api/create-checkout' };
