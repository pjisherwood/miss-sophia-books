/* Story time: choose a story, then a one-screen player coloured to match its cover. */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ITEMS = STORYTIME.concat(WISDOM.filter(w => w.audio).map(w => ({ slug:w.slug, title:w.title, summary:w.summary, chapter:w.kind, cover:w.playerImage || w.image || w.cover, thumb:w.thumb, audio:w.audio, duration:w.duration, marks:w.marks, body:w.body, theme:w.theme, credit:'' })));
/* audiobooks (chapter mode). They are paid: a book only opens for someone who owns it (see access.js); everyone else is sent to its product page. */
const BOOKITEMS = AUDIOBOOKS.map(b => ({ slug:b.slug, title:b.title, summary:b.chapters.length + ' chapters', chapter:'Audiobook · by ' + b.by, cover:b.cover, thumb:b.cover, chapters:b.chapters, duration:bookSeconds(b), theme:b.theme, credit:b.narration || '', by:b.by, access:b.access, productId:b.productId }));
const ALL = ITEMS.concat(BOOKITEMS);
(function(){
  const small = () => window.matchMedia('(max-width:800px)').matches;
  const icon = n => `<svg class="ic"><use href="#i-${n}"/></svg>`;
  $('#more').innerHTML = (typeof LISTEN_ITEMS !== 'undefined' && LISTEN_ITEMS.length ? `<h2>More to listen to</h2>` + LISTEN_ITEMS.map(i => `<a class="more-card" href="${i.url}"><span>${i.icon}</span><span><b>${esc(i.title)}</b><small>${esc(i.note)}</small></span></a>`).join('') : '') + (typeof PLATFORMS !== 'undefined' && PLATFORMS.length ? `<h2>Find Miss Sophia on</h2><div class="plat">${PLATFORMS.map(([n,u]) => `<a href="${u}">${esc(n)}</a>`).join('')}</div>` : '');
  $('#pic').style.backgroundImage = `url('${small() && STORYTIME_PICTURE.small ? STORYTIME_PICTURE.small : STORYTIME_PICTURE.image}')`;
  $('#pic').setAttribute('aria-label', STORYTIME_PICTURE.alt);

  const NAVITEMS = [["Home","index.html"],["Stories & Wisdom","wisdom.html"],["Story time","storytime.html"],["Books","books.html"],["Ask Miss Sophia","ask.html"],["Start here","start.html"]];
  $('#menu').innerHTML = NAVITEMS.map(([n,u]) => `<a href="${u}"${u === 'storytime.html' ? ' aria-current="page"' : ''}>${esc(n)}</a>`).join('');
  $('#menuBtn').onclick = () => { const m = $('#menu'); m.hidden = !m.hidden; $('#menuBtn').setAttribute('aria-expanded', !m.hidden); };
  document.addEventListener('click', e => { if(!e.target.closest('#menu') && !e.target.closest('#menuBtn')) $('#menu').hidden = true; });

  const fmt = s => { s = Math.max(0, Math.floor(s||0)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); };
  const audio = new Audio(); audio.preload = 'none';
  let story = null, marks = null, current = -1, rate = 1, pendingSeek = null, lastSave = 0, chunks = [], paraChunk = [];
  const rates = [0.85, 1, 1.15];
  const isBook = () => !!(story && story.chapters);
  let ch = 0, loadToken = 0, urls = {};
  const dur = () => (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : (isBook() ? story.chapters[ch].duration : (story && story.duration)) || 0;
  const key = () => isBook() ? 'stpos-' + story.slug + '-c' + (ch + 1) : 'stpos-' + story.slug;

  $('#storyList').innerHTML = ITEMS.map(s => `<button class="st-card" data-slug="${s.slug}">${s.cover ? `<img src="${s.thumb || s.cover}" alt="" width="76" height="76" loading="lazy">` : ''}<span><b>${esc(s.title)}</b><small>${esc(s.summary)}${s.duration ? ' · ' + fmt(s.duration) : ''}</small></span></button>`).join('');
  function lsv(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function cardStatus(){ document.querySelectorAll('.st-card').forEach(b => { const s = ALL.find(x => x.slug === b.dataset.slug); const pos = parseFloat(lsv('stpos-' + s.slug)); const m = Math.max(1, Math.round(s.duration/60));
    let t = ''; if(s.chapters) t = bookStatus(s); else if(pos > 5 && pos < s.duration - 10) t = 'In progress · ' + Math.max(1, Math.round((s.duration - pos)/60)) + ' min left'; else if(lsv('stdone-' + s.slug)) t = '✓ Listened';
    let e = b.querySelector('.stat'); if(!e){ e = document.createElement('em'); e.className = 'stat'; b.querySelector('span').appendChild(e); } e.textContent = t; e.hidden = !t; }); }
  cardStatus();
  $('#storyList').addEventListener('click', e => { const b = e.target.closest('.st-card'); if(b) open(b.dataset.slug); });

  /* "Your stories": the paid items this visitor owns (in stage 2 only in preview mode; stage 4 uses the private library link) */
  function renderYours(){
    const mine = BOOKITEMS.filter(b => typeof isOwned === 'function' && isOwned(b.slug));
    const box = $('#yours'); box.hidden = !mine.length; if(!mine.length) return;
    box.innerHTML = '<h2>Your stories' + (window.msbPreview && msbPreview() ? '<span class="tag">preview</span>' : '') + '</h2><div class="st-list">' +
      mine.map(s => `<button class="st-card" data-slug="${s.slug}"><img src="${s.thumb}" alt="" width="76" height="76" loading="lazy"><span><b>${esc(s.title)}</b><small>${esc(s.summary)} · ${fmt(s.duration)}</small></span></button>`).join('') + '</div>';
  }
  renderYours(); cardStatus();
  $('#yours').addEventListener('click', e => { const b = e.target.closest('.st-card'); if(b) open(b.dataset.slug); });

  /* chapter memory (on this phone): stpos-<slug>-cN = seconds into chapter N; stdone-<slug>-cN = finished; stlast-<slug> = chapter last played */
  function mm(sec){ return Math.max(1, Math.round(sec/60)); }
  function bookState(b){
    let listened = 0, doneN = 0;
    const rows = b.chapters.map((c,i) => { const d = !!lsv('stdone-' + b.slug + '-c' + (i+1)); const p = parseFloat(lsv('stpos-' + b.slug + '-c' + (i+1))) || 0; const part = !d && p > 5 && p < c.duration - 10;
      listened += d ? c.duration : (part ? p : 0); if(d) doneN++; return { d, p: part ? p : 0 }; });
    return { rows, listened, doneN };
  }
  function resumeIndex(b, st){
    const last = parseInt(lsv('stlast-' + b.slug)); const n = b.chapters.length;
    if(last >= 0 && last < n && !st.rows[last].d) return last;
    const from = (last >= 0 && last < n) ? last + 1 : 0;
    for(let k = 0; k < n; k++){ const i = (from + k) % n; if(!st.rows[i].d) return i; }
    return 0;
  }
  function bookStatus(b){
    const st = bookState(b); if(st.doneN === b.chapters.length) return '✓ Listened';
    if(!st.listened && !st.doneN) return '';
    const i = resumeIndex(b, st), left = b.chapters[i].duration - st.rows[i].p;
    return 'Continue: Chapter ' + (i+1) + ', ' + mm(left) + ' min left · ' + Math.round(st.listened / b.duration * 100) + '% listened';
  }

  /* colours taken from the cover picture (falls back to the colours stored with the story) */
  const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
  const hex = c => '#' + c.map(v => clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
  function applyTheme(bg, accent){
    const dk = (c,f) => c.map(v => v*f);
    const r = document.documentElement.style;
    r.setProperty('--bg1', hex(dk(bg,0.85))); r.setProperty('--bg2', hex(dk(bg,0.42)));
    r.setProperty('--accent', hex(accent));
    const lum = (0.299*accent[0] + 0.587*accent[1] + 0.114*accent[2]) / 255;
    r.setProperty('--on-accent', lum > 0.55 ? '#14100a' : '#ffffff');
    $('#themeColor').content = hex(dk(bg,0.6));
  }
  const parse = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
  /* soft pastel accents for the play button, the frame and the seek bar. In a story's theme write accent:"mint" (or any name below);
     if no accent is given, the pastel nearest to the strongest colour in the picture is used. A #hex colour still works too. */
  const PASTELS = { blue:'#a9cde6', mint:'#a8dcc2', teal:'#9ed6d1', pink:'#f0b9cd', peach:'#f6c6a3', yellow:'#f4e3a1', lavender:'#cdbfe9', grey:'#e4dfd5' };
  const hueOf = c => { const [r,g,b] = c, mx = Math.max(r,g,b), mn = Math.min(r,g,b), d = mx - mn; if(!d) return 0;
    const h = mx === r ? ((g-b)/d + 6) % 6 : mx === g ? (b-r)/d + 2 : (r-g)/d + 4; return h * 60; };
  const resolveAccent = v => PASTELS[v] ? parse(PASTELS[v]) : (/^#[0-9a-f]{6}$/i.test(v) ? parse(v) : parse(PASTELS.peach));
  function nearestPastel(c){
    const mx = Math.max(...c), mn = Math.min(...c); if(mx === 0 || (mx - mn) / mx < 0.15) return parse(PASTELS.grey);
    const h = hueOf(c); let best = 'peach', bd = 999;
    for(const k in PASTELS){ if(k === 'grey') continue; const ph = hueOf(parse(PASTELS[k])), d = Math.min(Math.abs(ph - h), 360 - Math.abs(ph - h)); if(d < bd){ bd = d; best = k; } }
    return parse(PASTELS[best]);
  }
  function themeFromStory(s){
    const t = Object.assign({bg:'#14110e', accent:'peach'}, s.theme || {}); applyTheme(parse(t.bg), resolveAccent(t.accent));
    if(!s.cover) return;
    const img = new Image(); img.onload = () => { try{
      const c = document.createElement('canvas'); c.width = c.height = 48; const x = c.getContext('2d'); x.drawImage(img,0,0,48,48);
      const d = x.getImageData(0,0,48,48).data; let br=0,bg=0,bb=0,n=0; const buckets = Array.from({length:12}, () => ({w:0,r:0,g:0,b:0}));
      for(let i=0;i<d.length;i+=4){ const r=d[i],g=d[i+1],b=d[i+2], mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=mx/255, sat=mx?(mx-mn)/mx:0;
        if(l<0.45){ br+=r; bg+=g; bb+=b; n++; }
        if(l>0.6 && sat>0.3){ let h; const dd=mx-mn; if(mx===r) h=((g-b)/dd+6)%6; else if(mx===g) h=(b-r)/dd+2; else h=(r-g)/dd+4;
          const k=buckets[Math.floor(h*2)%12], w=l*sat; k.w+=w; k.r+=r*w; k.g+=g*w; k.b+=b*w; } }
      const top = buckets.reduce((m,k) => k.w > m.w ? k : m, buckets[0]);
      const acc = s.theme && s.theme.accent ? resolveAccent(s.theme.accent) : (top.w > 0 ? nearestPastel([top.r/top.w, top.g/top.w, top.b/top.w]) : resolveAccent(t.accent));
      if(n > 50 && story === s) applyTheme([br/n,bg/n,bb/n], acc);
    }catch(e){} }; img.src = s.cover;
  }

  /* if a story has no timings yet (marks), estimate each chunk's start from the length of its text */
  function estimateMarks(){
    if(!story.duration) return null;
    const tot = chunks.reduce((a,c) => a + c.text.length, 0); let c0 = 0;
    return chunks.map(c => { const t = story.duration * 0.02 + (story.duration * 0.96) * c0 / tot; c0 += c.text.length; return Math.round(t*10)/10; });
  }
  /* the text is shown a chunk at a time: about 30 words, ending at a sentence end (see chunks.js) */
  function goPara(i){
    i = Math.max(0, Math.min(chunks.length - 1, i));
    if(story.audio && marks) seekTo(marks[i] + 0.05); else { current = i; setPara(i); }
  }
  function fit(){
    const box = $('#words'), p = $('#para'); if(!p.textContent || $('#player').hidden || isBook()) return;
    let fs = small() ? (window.innerHeight >= 800 ? 22 : 21) : 26; p.style.fontSize = fs + 'px';
    /* the same size every time; only an unusually long chunk is allowed to shrink a little */
    const min = small() ? 17 : 20;
    while(box.scrollHeight > box.clientHeight + 1 && fs > min){ fs -= 1; p.style.fontSize = fs + 'px'; }
    box.scrollTop = 0;
  }
  function setBookMode(on){
    $('#player').classList.toggle('bookmode', on); $('#words').hidden = on; $('#chapters').hidden = !on; $('#listBtn').hidden = on;
  }
  function markRows(){
    if(!isBook()) return; const st = bookState(story);
    document.querySelectorAll('#chapters .chap').forEach((r,i) => { const c = story.chapters[i], row = st.rows[i];
      r.classList.toggle('done', row.d); r.classList.toggle('now', i === ch);
      r.querySelector('.cn').textContent = row.d ? '✓' : (i+1);
      r.querySelector('.cl').textContent = row.d ? '' : (row.p ? mm(c.duration - row.p) + ' min left' : mm(c.duration) + ' min'); });
  }
  function bookNote(t){
    if(!isBook()) return; const st = bookState(story);
    let l = 0; story.chapters.forEach((c,i) => { l += i === ch ? (st.rows[i].d ? c.duration : Math.min(t||0, c.duration)) : (st.rows[i].d ? c.duration : st.rows[i].p); });
    $('#stNote').textContent = 'Chapter ' + (ch+1) + ' of ' + story.chapters.length + ' · ' + Math.floor(l/60) + ' of ' + mm(story.duration) + ' min' + (story.credit ? '\n' + story.credit : '');
    markRows();
  }
  /* The chapter files are private. In stage 2 these are placeholder tones; stage 4 asks a Netlify Function for short-lived links
     (fetched all at once when the book opens, so tapping a chapter can play straight away on an iPhone). */
  async function loadUrls(b){
    urls = {}; b.chapters.forEach((c,i) => { urls[i] = 'audio/demo/chapter-' + String(i+1).padStart(2,'0') + '.mp3'; });
  }
  function selectChapter(i, play){
    const c = story.chapters[i]; if(!c || !urls[i]) return;
    ch = i; audio.pause(); pendingSeek = null;
    audio.src = urls[i]; audio.preload = 'none'; audio.playbackRate = rate;
    try{ localStorage.setItem('stlast-' + story.slug, i); }catch(e){}
    $('#pcount').textContent = (i+1) + ' / ' + story.chapters.length;
    $('#stSub').textContent = 'Chapter ' + (i+1) + ': ' + c.title;
    $('#tNow').textContent = '0:00'; $('#tAll').textContent = fmt(c.duration); $('#seek').value = 0; setPlayIcon(false);
    const s0 = parseFloat(lsv('stpos-' + story.slug + '-c' + (i+1)));
    if(s0 > 5 && s0 < c.duration - 10){ seekTo(s0); } 
    bookNote(Math.max(0, s0 || 0)); setMediaSession();
    const row = document.querySelector('#chapters .chap:nth-child(' + (i+1) + ')'); if(row && row.scrollIntoView) row.scrollIntoView({ block:'nearest' });
    if(play){ const p = audio.play(); if(p && p.catch) p.catch(() => { $('#stNote').textContent = 'Sorry, the recording could not be played.'; }); }
  }
  function stepChapter(d){
    if(!isBook()) return; const n = story.chapters.length;
    if(d < 0 && audio.currentTime > 3){ seekTo(0); return; }
    const i = ch + d; if(i < 0 || i >= n) return; selectChapter(i, !audio.paused);
  }
  async function openBook(){
    const b = story, st = bookState(b);
    chunks = []; marks = null; current = -1; pendingSeek = null;
    $('#browse').hidden = true; $('#player').hidden = false; $('#shareBtn').hidden = false;
    $('#cover').src = b.cover; $('#cover').alt = 'Cover of ' + b.title;
    themeFromStory(b);
    $('#stTitle').textContent = b.title; $('#stSub').classList.remove('big');
    document.title = b.title + ' – Story time';
    $('#chapters').innerHTML = b.chapters.map((c,i) => `<button class="chap" data-i="${i}"><span class="cn">${i+1}</span><span class="ct"><b>${esc(c.title)}</b><em>${esc(teaser(c.first))}</em></span><span class="cl"></span></button>`).join('');
    $('#playBtn').disabled = false; $('#seek').disabled = false;
    if(location.hash.slice(1) !== b.slug) history.pushState(null, '', '#' + b.slug);
    const tok = ++loadToken; await loadUrls(b); if(tok !== loadToken || story !== b) return;
    selectChapter(resumeIndex(b, st), false);
  }
  function setPara(i){
    const k = i < 0 ? 0 : i, c = chunks[k];
    $('#para').textContent = c.text; fit();
    $('#pcount').textContent = (k + 1) + ' / ' + chunks.length;
    document.querySelectorAll('#full p').forEach((p,n) => p.classList.toggle('now', n >= c.p0 && n <= c.p1));
  }
  function setPlayIcon(on){ const b = $('#playBtn'); b.innerHTML = icon(on ? 'pause' : 'play'); b.setAttribute('aria-label', on ? 'Pause' : 'Play'); }

  function showBrowse(){
    audio.pause(); story = null; loadToken++; setBookMode(false); renderYours(); cardStatus();
    $('#player').hidden = true; $('#browse').hidden = false; $('#sheet').hidden = true; $('#shareBtn').hidden = true;
    const r = document.documentElement.style; ['--bg1','--bg2','--accent','--on-accent'].forEach(v => r.removeProperty(v));
    $('#themeColor').content = '#14110e'; document.title = 'Story time – Miss Sophia Books';
  }
  function open(slug){
    story = ALL.find(s => s.slug === slug); if(!story) return showBrowse();
    if(story.access === 'paid' && !(typeof isOwned === 'function' && isOwned(story.slug))){ story = null; location.replace('/audiobook/' + slug); return; }
    audio.pause(); audio.removeAttribute('src'); loadToken++;
    setBookMode(!!story.chapters);
    if(story.chapters){ openBook(); return; }
    if(story.audio){ audio.src = story.audio; audio.preload = 'none'; audio.playbackRate = rate; }
    const cs = chunkStory(story.body); chunks = cs.chunks; paraChunk = cs.paraChunk;
    marks = (story.marks && story.marks.length === chunks.length) ? story.marks : estimateMarks();
    current = -1; pendingSeek = null;
    $('#browse').hidden = true; $('#player').hidden = false; $('#shareBtn').hidden = false;
    $('#cover').src = story.cover || STORYTIME_PICTURE.small; $('#cover').alt = 'Cover of ' + story.title;
    themeFromStory(story);
    $('#stTitle').textContent = story.title; $('#stSub').textContent = story.chapter || ''; $('#stSub').classList.toggle('big', !!story.sample);
    document.title = story.title + ' – Story time';
    $('#tNow').textContent = '0:00'; $('#tAll').textContent = fmt(story.duration);
    $('#seek').value = 0; setPlayIcon(false);
    if(story.audio){ const rd = 'Read by Miss Sophia (an AI voice)' + (story.credit && !story.sample ? ' · ' + story.credit : '');
      if(story.fullNote && story.fullLink) $('#stNote').innerHTML = `<a class="fulllink" href="${esc(story.fullLink)}" target="_blank" rel="noopener">Hear the full audiobook on Spotify</a>\n${esc(rd)}`;
      else $('#stNote').textContent = (story.fullNote ? story.fullNote + '\n' : '') + rd; }
    else $('#stNote').textContent = 'The recording of this story is not ready yet, but you can read it here.';
    $('#playBtn').disabled = !story.audio; $('#seek').disabled = !story.audio;
    $('#full').innerHTML = story.body.map((p,i) => `<p data-i="${i}">${esc(p)}</p>`).join('');
    $('#sheetTitle').textContent = story.title;
    setPara(-1); setMediaSession();
    if(location.hash.slice(1) !== story.slug) history.pushState(null, '', '#' + story.slug);
    try{ const s = parseFloat(localStorage.getItem(key())); if(s > 5 && s < story.duration - 10) seekTo(s); }catch(e){}
  }

  function toggle(){
    if(!story || !(story.audio || story.chapters)) return;
    if(audio.paused){ audio.playbackRate = rate; const p = audio.play(); if(p && p.catch) p.catch(() => { $('#stNote').textContent = 'Sorry, the recording could not be played.'; }); }
    else { saveNow(); audio.pause(); }
  }
  function seekTo(sec){
    const d = dur(); sec = Math.max(0, Math.min(sec, d || sec));
    if(audio.readyState === 0){ pendingSeek = sec; audio.preload = 'metadata'; audio.load(); } else audio.currentTime = sec;
    paint(sec);
  }
  function paint(t){
    if(!story) return;
    $('#tNow').textContent = fmt(t);
    const d = dur(); $('#seek').value = d ? Math.round(t / d * 1000) : 0;
    if(marks){ let i = 0; for(let k = 0; k < marks.length; k++){ if(t >= marks[k]) i = k; } if(i !== current){ current = i; setPara(i); } }
    if(Date.now() - lastSave > 3000 && t > 1){ lastSave = Date.now(); try{ localStorage.setItem(key(), t); }catch(e){} if(isBook()) bookNote(t); }
  }

  audio.addEventListener('play', () => { setPlayIcon(true); if('mediaSession' in navigator) navigator.mediaSession.playbackState = 'playing'; });
  audio.addEventListener('pause', () => { setPlayIcon(false); if('mediaSession' in navigator) navigator.mediaSession.playbackState = 'paused'; });
  audio.addEventListener('ended', () => {
    if(isBook()){
      try{ localStorage.removeItem(key()); localStorage.setItem('stdone-' + story.slug + '-c' + (ch+1), '1'); }catch(e){}
      if(ch < story.chapters.length - 1){ selectChapter(ch + 1, true); return; }   /* the next chapter plays by itself */
      setPlayIcon(false); try{ localStorage.setItem('stdone-' + story.slug, '1'); }catch(e){}
      audio.currentTime = 0; paint(0); markRows(); $('#stNote').textContent = 'The end. Thank you for listening.'; return;
    }
    setPlayIcon(false); try{ localStorage.removeItem(key()); localStorage.setItem('stdone-' + story.slug, '1'); }catch(e){} audio.currentTime = 0; paint(0); });
  audio.addEventListener('timeupdate', () => paint(audio.currentTime));
  audio.addEventListener('loadedmetadata', () => { audio.playbackRate = rate; if(!story) return; $('#tAll').textContent = fmt(dur()); if(pendingSeek != null){ audio.currentTime = pendingSeek; pendingSeek = null; } });
  audio.addEventListener('error', () => { if(story && audio.getAttribute('src')) $('#stNote').textContent = 'Sorry, the recording could not be loaded.'; });

  $('#playBtn').onclick = toggle; $('#words').onclick = toggle; $('#cover').onclick = toggle;
  $('#back').onclick = () => seekTo(audio.currentTime - 15);
  $('#fwd').onclick = () => seekTo(audio.currentTime + 15);
  $('#seek').addEventListener('input', e => seekTo(e.target.value / 1000 * dur()));
  $('#speed').onclick = () => { rate = rates[(rates.indexOf(rate) + 1) % rates.length]; audio.playbackRate = rate; $('#speed').textContent = rate + '×'; };
  $('#listBtn').onclick = () => { $('#sheet').hidden = false; const n = document.querySelector('#full p.now'); if(n) n.scrollIntoView({block:'center'}); };
  $('#closeSheet').onclick = () => { $('#sheet').hidden = true; };
  $('#full').addEventListener('click', e => { const p = e.target.closest('p'); if(p && marks && story.audio){ seekTo(marks[paraChunk[+p.dataset.i]] + 0.01); $('#sheet').hidden = true; if(audio.paused) toggle(); } });
  $('#prevP').onclick = () => isBook() ? stepChapter(-1) : goPara((current < 0 ? 0 : current) - 1);
  $('#nextP').onclick = () => isBook() ? stepChapter(1) : goPara((current < 0 ? 0 : current) + 1);
  $('#chapters').addEventListener('click', e => { const b = e.target.closest('.chap'); if(!b) return; const i = +b.dataset.i; if(i === ch && audio.src) toggle(); else selectChapter(i, true); });
  const saveNow = () => { if(story && audio.src && !audio.ended && audio.currentTime > 1){ try{ localStorage.setItem(key(), audio.currentTime); }catch(e){} } };
  window.addEventListener('pagehide', saveNow); document.addEventListener('visibilitychange', () => { if(document.hidden) saveNow(); });
  (function(){ let x0=null,y0=null; const w=$('#words'); w.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY;},{passive:true});
    w.addEventListener('touchend',e=>{ if(x0===null) return; const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; x0=null; if(Math.abs(dx)>50 && Math.abs(dx)>Math.abs(dy)*1.5){ e.preventDefault(); dx<0 ? $('#nextP').click() : $('#prevP').click(); } }); })();
  $('#backBtn').onclick = () => { if(location.hash){ history.back(); } else showBrowse(); };
  function toast(t){ const e = $('#toast'); e.textContent = t; e.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => { e.hidden = true; }, 2500); }
  $('#shareBtn').onclick = async () => {
    if(!story) return;
    const web = /^https?:/.test(location.protocol);
    /* a paid item is shared as its product page (never a library link) */
    const url = story.access === 'paid' ? (web ? location.origin + '/audiobook/' + story.slug : location.href) : (web ? location.origin + '/listen/' + story.slug : location.href);
    const text = story.access === 'paid' ? '“' + story.title + '” – the audiobook, with a free sample.' : 'Listen to “' + story.title + '” read by Miss Sophia (' + Math.max(1, Math.round(story.duration/60)) + ' min).';
    if(navigator.share){ try{ await navigator.share({ title: story.title + ' – Miss Sophia Books', text, url }); return; }catch(e){ if(e && e.name === 'AbortError') return; } }
    try{ await navigator.clipboard.writeText(url); toast('Link copied'); }catch(e){ toast(url); }
  };
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);
  window.addEventListener('resize', fit); $('#cover').addEventListener('load', fit);
  document.addEventListener('keydown', e => { if(e.code === 'Space' && story && !e.target.closest('input,button')){ e.preventDefault(); toggle(); } });

  function setMediaSession(){
    if(!('mediaSession' in navigator) || !story) return;
    const art = story.cover ? [{src: story.cover, }] : [];
    if(isBook()){ const c = story.chapters[ch];   /* lock screen: the book title and the current chapter */
      navigator.mediaSession.metadata = new MediaMetadata({ title: 'Chapter ' + (ch+1) + ': ' + c.title, artist: story.title, album: 'by ' + story.by, artwork: art });
      navigator.mediaSession.setActionHandler('previoustrack', () => stepChapter(-1)); navigator.mediaSession.setActionHandler('nexttrack', () => stepChapter(1)); }
    else { navigator.mediaSession.metadata = new MediaMetadata({ title: story.title, artist: 'Miss Sophia', album: story.credit || 'Story time', artwork: art });
      try{ navigator.mediaSession.setActionHandler('previoustrack', null); navigator.mediaSession.setActionHandler('nexttrack', null); }catch(e){} }
    navigator.mediaSession.setActionHandler('play', toggle); navigator.mediaSession.setActionHandler('pause', toggle);
    navigator.mediaSession.setActionHandler('seekbackward', () => seekTo(audio.currentTime - 15));
    navigator.mediaSession.setActionHandler('seekforward', () => seekTo(audio.currentTime + 15));
  }
  function route(){
    const pm = location.pathname.match(/^\/listen\/([^\/]+?)(?:\.html)?$/);
    if(pm && ALL.some(s => s.slug === decodeURIComponent(pm[1]))){ const sl = decodeURIComponent(pm[1]); history.replaceState(null, '', '/storytime.html#' + sl); }
    const want = location.hash.slice(1);
    if(want && ALL.some(s => s.slug === want)){ if(!story || story.slug !== want) open(want); }
    else if(story) showBrowse();
  }
  setPlayIcon(false);
  route();
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
