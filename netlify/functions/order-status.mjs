// The thank-you page asks this whether a payment went through. Stripe is asked directly, so it cannot be faked.
// (Stage 4 adds the buyer's private library link to this answer.)
import { json, stripe } from './_shared.mjs';

const mask = (e) => { if (!e || !e.includes('@')) return ''; const [u, d] = e.split('@'); return u.slice(0, 1) + '***@' + d; };

export default async (req) => {
  const id = new URL(req.url).searchParams.get('session_id') || '';
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) return json({ error: 'No payment found.' }, 400);
  try {
    const s = await stripe('GET', '/v1/checkout/sessions/' + id);
    return json({
      paid: s.payment_status === 'paid',
      email: mask(s.customer_details && s.customer_details.email),
      slug: s.metadata && s.metadata.product_slug,
    });
  } catch (e) {
    console.error('order-status:', e.message);
    if (e.code === 'nokey') return json({ error: 'Payments are not switched on yet.' }, 503);
    return json({ error: 'We could not check that payment.' }, 502);
  }
};

export const config = { path: '/api/order-status' };
