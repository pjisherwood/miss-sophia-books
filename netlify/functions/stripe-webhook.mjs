// Stripe tells us here that a payment has gone through. We then email the buyer their private library link,
// so they can get back to their stories even if they closed the thank-you page or change phone.
// Stripe stays the record of the purchase; nothing is stored here. (Stripe only calls this once the signature check passes.)
import { json, loadContent, findProduct, signToken, verifyStripeSignature, accessEmail, sendEmail, SITE_URL, hasPaidStory } from './_shared.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Not allowed.' }, 405);
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) { console.error('stripe-webhook: STRIPE_WEBHOOK_SECRET is not set'); return json({ error: 'Not set up yet.' }, 503); }
  const raw = await req.text();
  if (!verifyStripeSignature(raw, req.headers.get('stripe-signature'), secret)) return json({ error: 'Bad signature.' }, 400);

  let event; try { event = JSON.parse(raw); } catch { return json({ error: 'Bad body.' }, 400); }
  const type = event && event.type;
  if (type !== 'checkout.session.completed' && type !== 'checkout.session.async_payment_succeeded') return json({ received: true, ignored: type });

  const s = event.data && event.data.object;
  if (!hasPaidStory(s)) return json({ received: true, ignored: 'not a paid story' });
  const email = (s.customer_details && s.customer_details.email) || s.customer_email;
  if (!email) { console.error('stripe-webhook: no email on', s.id); return json({ received: true, ignored: 'no email' }); }

  try {
    let title = '';
    try { const p = findProduct(loadContent(), s.metadata.product_id); if (p) title = p.title; } catch (e) { console.error('stripe-webhook content:', e.message); }
    const base = SITE_URL();
    const msg = accessEmail({ link: base + '/mystories.html?t=' + signToken([s.id]), titles: title ? [title] : [], findUrl: base + '/find-stories.html' });
    await sendEmail({ to: email, ...msg, idempotencyKey: 'access-' + s.id });
    return json({ received: true, emailed: true });
  } catch (e) {
    console.error('stripe-webhook:', e.message);
    // a non-200 answer makes Stripe try again later, so a temporary email problem does not lose the email
    return json({ error: 'Could not send the email yet.' }, e.code === 'nomail' ? 503 : 502);
  }
};

export const config = { path: '/api/stripe-webhook' };
