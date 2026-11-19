// "Which of the paid stories does this phone own?" The phone sends its private tokens; Stripe confirms them.
import { json, ownedFromTokens } from './_shared.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Not allowed.' }, 405);
  let body; try { body = await req.json(); } catch { return json({ error: 'That did not work.' }, 400); }
  try { return json({ owned: await ownedFromTokens(body.tokens) }); }
  catch (e) { console.error('library:', e.message); return json({ error: 'We could not check your stories just now.' }, e.code === 'nokey' ? 503 : 502); }
};
export const config = { path: '/api/library' };
