// Starts a Stripe Checkout for one paid item and returns the address to send the buyer to.
// The price comes from content.js on the server, never from the page. The secret key is an environment variable (STRIPE_SECRET_KEY).
//
// Two routes (decided 20 Nov 2026, see paid-audio-progress.md):
//   UK buyers      -> ordinary Stripe. Paul is the seller; no VAT is added while he is below the VAT registration threshold.
//   everyone else  -> Stripe Managed Payments. Stripe is the seller and deals with the buyer's local tax.
// The route comes from the country Netlify sees for the visitor. If the country is unknown, the Managed Payments route is used.
import { json, safeOrigin, loadContent, findProduct, stripe } from './_shared.mjs';

// Managed Payments is switched on per checkout with managed_payments[enabled]; it needs a recent Stripe API version.
const STRIPE_VERSION = process.env.STRIPE_API_VERSION || '2026-04-22.dahlia';

export default async (req, context) => {
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

  // which route? UK visitors pay without Managed Payments; everyone else (and anyone we cannot place) with it
  const country = String((context && context.geo && context.geo.country && context.geo.country.code) || '').toUpperCase();
  let route = country === 'GB' ? 'uk' : 'overseas';
  // while testing (a test key), the page can ask for either route, so both can be tried from a UK phone
  const testMode = String(process.env.STRIPE_SECRET_KEY || '').startsWith('sk_test_');
  if (testMode && (body.route === 'uk' || body.route === 'overseas')) route = body.route;
  const managed = route === 'overseas';

  const f = new URLSearchParams();
  f.set('mode', 'payment');
  f.set('locale', 'en-GB');
  f.set('line_items[0][quantity]', '1');
  f.set('line_items[0][price_data][currency]', 'gbp');
  f.set('line_items[0][price_data][unit_amount]', String(item.price));
  f.set('line_items[0][price_data][product_data][name]', item.title + (item.kind === 'Audiobook' ? ' (audiobook)' : ''));
  f.set('managed_payments[enabled]', managed ? 'true' : 'false');
  if (managed) {
    // Managed Payments: the price on the site is the price paid (tax is included in it), and every item needs a product tax category (set per item in content.js)
    f.set('line_items[0][price_data][tax_behavior]', 'inclusive');
    if (item.taxCode) f.set('line_items[0][price_data][product_data][tax_code]', item.taxCode);
  }
  f.set('success_url', base + '/thanks.html?session_id={CHECKOUT_SESSION_ID}');
  f.set('cancel_url', base + '/audiobook/' + item.slug);
  // the purchase record: what was bought, and exactly what the buyer agreed to and when
  f.set('metadata[product_id]', item.productId);
  f.set('metadata[product_slug]', item.slug);
  f.set('metadata[route]', route);
  f.set('metadata[country_seen]', country || 'unknown');
  f.set('metadata[digital_agreed_at]', now);
  f.set('metadata[digital_wording]', W.digital.slice(0, 500));
  f.set('metadata[marketing_optin]', marketing ? 'yes' : 'no');
  f.set('metadata[marketing_choice_at]', now);
  f.set('metadata[marketing_wording]', W.marketing.slice(0, 500));

  try {
    const s = await stripe('POST', '/v1/checkout/sessions', f, { version: STRIPE_VERSION });
    return json({ url: s.url });
  } catch (e) {
    console.error('create-checkout (' + route + '):', e.message);
    if (e.code === 'nokey') return json({ error: 'Payments are not switched on yet.' }, 503);
    return json({ error: 'Sorry, we could not start the payment. Please try again.' }, 502);
  }
};

export const config = { path: '/api/create-checkout' };
