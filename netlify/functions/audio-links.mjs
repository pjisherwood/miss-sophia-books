// Gives a phone that owns a story short-lived private links to its chapter files (6 hours, so a long listen or a pause is fine).
// The files live in a private Cloudflare R2 bucket: miss-sophia-audio/<slug>/<file>. They are never in the public site.
import { json, loadContent, ownedFromTokens, presignGet, r2Config } from './_shared.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Not allowed.' }, 405);
  let body; try { body = await req.json(); } catch { return json({ error: 'That did not work.' }, 400); }
  const slug = String(body.slug || '');
  let content; try { content = loadContent(); } catch (e) { console.error(e); return json({ error: 'Not ready yet.' }, 500); }
  const book = content.AUDIOBOOKS.find(a => a.slug === slug && a.access === 'paid');
  if (!book) return json({ error: 'We could not find that story.' }, 404);
  try {
    const owned = await ownedFromTokens(body.tokens);
    if (!owned.includes(slug)) return json({ error: 'This story is not in your library on this phone.' }, 403);
    const cfg = r2Config(), now = new Date();
    const urls = book.chapters.map(c => presignGet({ ...cfg, key: `${slug}/${c.file}`, now, expires: 21600 }));
    return json({ urls });
  } catch (e) {
    console.error('audio-links:', e.message);
    if (e.code === 'nor2' || e.code === 'nokey') return json({ error: 'Audio is not switched on yet.' }, 503);
    return json({ error: 'We could not open your story just now.' }, 502);
  }
};
export const config = { path: '/api/audio-links' };
