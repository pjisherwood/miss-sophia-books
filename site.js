/* Shared behaviour: header, footer, chat, bookshop picker, helpers. */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lamp = `<img src="logo.svg" alt="" width="56" height="56">`;
(function(){ const l=document.createElement("link"); l.rel="icon"; l.href="logo.svg"; document.head.appendChild(l); })();
const themeBg = t => t.image ? `url('${t.image}')` : t.look;
const thumbBg = t => t.thumb ? `url('${t.thumb}')` : themeBg(t);
const themeById = id => THEMES.find(t => t.id === id) || THEMES[0];
const CHOOSABLE = () => THEMES.filter(t => !t.hidden);

/* header + footer (edit the menu here once; every page follows) */
const NAV = [["Home","index.html"],["Stories & Wisdom","wisdom.html"],["Books","books.html"],["Library","library.html"],["Ask Miss Sophia","ask.html"]];
(function(){
  const file = location.pathname.split('/').pop() || 'index.html';
  const here = location.pathname.startsWith('/wisdom/') ? 'wisdom.html' : file;
  const h = $('#site-header');
  if(h) h.innerHTML = `<div class="site-header"><div class="in">
    <a class="brand" href="index.html" aria-label="Miss Sophia Books home"><span class="logo">${lamp}</span><span class="site-title">Miss Sophia’s Books, Stories &amp; Wisdom</span></a>
    <nav class="site-nav">${NAV.map(([n,u])=>`<a href="${u}" ${u===here?'aria-current="page"':''}>${n}</a>`).join('')}</nav>
  </div></div>`;
  const f = $('#site-footer');
  if(f) f.innerHTML = `<div class="site-footer"><div class="logo">${lamp}</div>
    Miss Sophia Books · a quiet place for stories and wisdom<br>
    By my friend Paul Isherwood — <a href="https://paulisherwood.com" style="color:inherit">visit his own site</a><br>${/^\/(audiobook\/|library|storytime|listen)/.test(location.pathname) ? '<a href="find-stories.html" style="color:inherit">Restore purchases</a><br>' : ''}<a href="/privacy" style="color:inherit">Privacy</a> · <a href="/terms-of-service" style="color:inherit">Terms</a><br>© Paul Isherwood</div>`;
})();

/* chat: real ElevenLabs widget when an agent id is set, otherwise a placeholder */
(function(){
  /* A page can set window.CHAT_CUSTOM = true before site.js loads to add its own chat widget (see voice-test.html). */
  if (window.CHAT_CUSTOM) return;
  /* The chat button appears only on the home page and on the Ask Miss Sophia page (reached from the menu). */
  const chatName = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
  if (!['index','ask'].includes(chatName)) return;
  if (typeof CHAT_AGENT_ID !== 'undefined' && CHAT_AGENT_ID) {
    const el = document.createElement('elevenlabs-convai');
    el.setAttribute('agent-id', CHAT_AGENT_ID);
    document.body.appendChild(el);
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'; s.async = true;
    document.body.appendChild(s);
  } else {
    document.body.insertAdjacentHTML('beforeend',
      `<div id="chatNote">Miss Sophia’s chat will live here. Add your agent id in content.js.</div>
       <button id="chatStub" aria-label="Chat with Miss Sophia">💬</button>`);
    $('#chatStub').onclick = () => { const n=$('#chatNote'); n.style.display = n.style.display==='block'?'none':'block'; };
  }
})();

/* bookshop picker (only on pages that have a #shop)
   First visit: a random bookshop (not saved). When the visitor chooses one, their browser remembers it.
   Phones get the smaller picture; the picker's little previews load only when the picker is first opened. */
(function(){
  const shop = $('#shop'); if(!shop) return;
  const small = () => window.matchMedia && window.matchMedia('(max-width:800px)').matches;
  function apply(id, save=true){
    const t = themeById(id);
    const pic = (small() && t.small) ? t.small : t.image;
    shop.style.backgroundImage = pic ? `url('${pic}')` : t.look;
    document.documentElement.style.setProperty('--overlay', t.overlay);
    document.querySelectorAll('.thumb').forEach(b=>b.setAttribute('aria-pressed', b.dataset.id===t.id));
    if(save){ try{ localStorage.setItem('shopTheme', t.id) }catch(e){} }
  }
  /* the button lives inside the picture (bottom left); the panel slides up from the bottom of the screen */
  shop.insertAdjacentHTML('beforeend', `<button id="pickBtn">📚 Change your bookshop</button>`);
  document.body.insertAdjacentHTML('beforeend',
    `<div id="panel" role="dialog" aria-label="Choose your bookshop">
       <button class="close" aria-label="Close">×</button>
       <h2>Choose your bookshop</h2><small>Pick the place you’d like to visit. We’ll remember it for next time.</small>
       <div class="thumbs">${CHOOSABLE().map(t=>`<button class="thumb" data-id="${t.id}" aria-pressed="false"><span class="t" data-bg="${thumbBg(t).replace(/"/g,'&quot;')}"></span><span class="n">${esc(t.name)}</span></button>`).join('')}</div>
     </div>`);
  const panel = $('#panel');
  let thumbsLoaded = false;
  function loadThumbs(){ if(thumbsLoaded) return; thumbsLoaded = true; panel.querySelectorAll('.t[data-bg]').forEach(el => el.style.backgroundImage = el.dataset.bg); }
  const setOpen = on => { panel.classList.toggle('open', on); document.body.classList.toggle('picking', on); };
  $('#pickBtn').onclick = () => { loadThumbs(); setOpen(!panel.classList.contains('open')); };
  panel.querySelector('.close').onclick = () => setOpen(false);
  panel.addEventListener('click', e => { const b=e.target.closest('.thumb'); if(b) apply(b.dataset.id); });
  let saved=null; try{ saved=localStorage.getItem('shopTheme') }catch(e){}
  const pool = CHOOSABLE();
  if(!pool.some(t => t.id === saved)) saved = null;
  apply(saved || pool[Math.floor(Math.random()*pool.length)].id, false);
})();

/* links to a piece, and the share link */
const pieceHref = slug => 'wisdom.html#' + slug;
const cleanUrlsOK = () => location.protocol==='https:' && !/claude|anthropic/i.test(location.hostname);
const shareUrl = slug => cleanUrlsOK() ? location.origin + '/wisdom/' + slug : location.href.split('#')[0] + '#' + slug;
