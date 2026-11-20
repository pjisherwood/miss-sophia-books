MISS SOPHIA BOOKS — site folder

PUT IT ON NETLIFY
1. Go to app.netlify.com > Add new site > Deploy manually.
2. Drag this whole folder in. Done. Later, add your domain under Domain settings.

THE ONE FILE YOU EDIT: content.js
- Thought for today ........ THOUGHTS list (changes daily by itself; each links to its piece)
- Home: Free to listen ..... FREE_HOME (three slugs from WISDOM that have audio)
- Home: Audiobooks ......... follows AUDIOBOOKS automatically (on sale = full card with price and free sample; other books = "coming soon"). NEW_ON_SHELF is no longer shown.
- Gift ..................... GIFT
- Stories and wisdom ....... WISDOM (copy a block, change the words; kind is Stories or Wisdom;
                              put its picture in the pieces folder; related = what to suggest at the end)
- Listen links ............. LISTEN_ITEMS and PLATFORMS (both empty for now)
- Books and Amazon links ... BOOKS (url:"#" -> your Amazon link)
- Bookshop pictures ........ THEMES (put images in a folder called shops, then image:"shops/name.jpg")
- Miss Sophia chat ......... CHAT_AGENT_ID (already set to your Miss Sophia agent)

Share links: once live, each piece has a clean link such as
yourdomain.com/wisdom/the-magic-in-everything (the "Share this" button copies it).

VOICE TEST PAGE (not in the menu)
voice-test.html uses a separate agent, "Miss Sophia voice" (a copy of Miss Sophia with chat mode switched off), so it offers Talk as well as typing.
It only works from the live addresses on that agent's ElevenLabs allowlist (misssophiabooks.com and www).
Every other page keeps the standard text-only chat (CHAT_AGENT_ID in content.js).
