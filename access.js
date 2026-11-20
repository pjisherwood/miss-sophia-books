/* Who owns what, on THIS phone.
   After a purchase (or by opening the private link in the access email) the phone keeps one or more private tokens.
   A Netlify Function asks Stripe whether they are real, and tells us which stories they open.
   No passwords. The list of owned stories is remembered so pages can show "Listen now" straight away, and is re-checked in the background. */
(function(){
  const TK = 'msb-tokens', OW = 'msb-owned';
  const get = (k, d) => { try{ const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; }catch(e){ return d; } };
  const set = (k, v) => { try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} };
  window.msbTokens = () => get(TK, []);
  window.msbAddToken = (token, slug) => {
    if(token){ const t = get(TK, []); if(t.indexOf(token) < 0){ t.push(token); set(TK, t.slice(-10)); } }
    if(slug){ const o = get(OW, []); if(o.indexOf(slug) < 0){ o.push(slug); set(OW, o); } }
  };
  window.isOwned = slug => get(OW, []).indexOf(slug) >= 0;
  /* ask the server which stories this phone owns; keeps the last answer if the phone is offline */
  window.msbRefresh = async () => {
    const tokens = get(TK, []);
    if(!tokens.length){ set(OW, []); return []; }
    try{
      const r = await fetch('/api/library', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ tokens }) });
      if(!r.ok) return get(OW, []);
      const d = await r.json(); if(Array.isArray(d.owned)){ set(OW, d.owned); return d.owned; }
    }catch(e){}
    return get(OW, []);
  };
  /* short-lived private links to a story's chapter files (null if not allowed) */
  window.msbAudioLinks = async slug => {
    const r = await fetch('/api/audio-links', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ tokens: get(TK, []), slug }) });
    if(!r.ok) return null;
    const d = await r.json(); return Array.isArray(d.urls) ? d.urls : null;
  };
})();
