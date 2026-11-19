/* Product page for a paid audio item. Address: /audiobook/<slug> (also product.html?slug=<slug>). */
(function(){
  const root = $('#prod');
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); };
  const mins = s => Math.max(1, Math.round(s/60));
  const m = location.pathname.match(/^\/audiobook\/([^\/]+?)(?:\.html)?\/?$/);
  const slug = m ? decodeURIComponent(m[1]) : (new URLSearchParams(location.search).get('slug') || location.hash.slice(1));

  /* paid items: audiobooks with chapters, or any story/piece marked access:"paid" */
  const single = WISDOM.filter(w => w.access === 'paid' && w.audio).map(w => ({ slug:w.slug, access:'paid', price:w.price, priceText:w.priceText, productId:w.productId, title:w.title, kind:'Story', cover:w.playerImage || w.image || w.cover, summary:w.summary, duration:w.duration }));
  const item = AUDIOBOOKS.concat(single).find(x => x.slug === slug);
  if(!item){ root.innerHTML = `<h1 class="title">We couldn’t find that one</h1><p><a class="btn" href="books.html">See the books</a></p>`; return; }

  const book = BOOKS.find(b => b.slug === item.bookSlug) || null;
  const chapters = item.chapters || [];
  const totalSec = chapters.length ? bookSeconds(item) : item.duration;
  const facts = [item.priceText, mins(totalSec) + ' min'].concat(chapters.length ? [chapters.length + ' chapters'] : []);
  const owned = typeof isOwned === 'function' && isOwned(item.slug);
  document.title = item.title + ' – ' + item.kind.toLowerCase() + ' – Miss Sophia Books';
  const desc = book ? book.intro.concat(book.more) : [item.summary || ''];

  const icoPlay = '<svg viewBox="0 0 24 24"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.86l11-6.8a1 1 0 0 0 0-1.72l-11-6.8A1 1 0 0 0 8 5.2z"/></svg>';
  const icoPause = '<svg viewBox="0 0 24 24"><rect x="6" y="4.5" width="4.2" height="15" rx="1.2"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"/></svg>';

  root.innerHTML = `
    ${window.msbPreview && msbPreview() ? '<p class="previewbar">Preview mode is on in this browser (placeholder audio). Add ?preview=0 to the address to turn it off.</p>' : ''}
    <div class="top">
      <div class="pcover" style="background-image:url('${esc(item.cover)}')" role="img" aria-label="Cover of ${esc(item.title)}"></div>
      <div>
        <p class="kind">${esc(item.kind)}</p>
        <h1>${esc(item.title)}</h1>
        ${item.by ? `<p class="by">By ${esc(item.by)}${item.narration ? ' · ' + esc(item.narration) : ''}</p>` : ''}
        <p class="facts">${facts.map((f,i) => i === 0 ? `<b>${esc(f)}</b>` : esc(f)).join(' · ')}</p>
        ${owned
          ? `<p class="owned soft">You have this one.</p><br><a class="btn buy-btn" href="storytime.html#${esc(item.slug)}">Listen now</a>`
          : `<button class="btn buy-btn" id="buyBtn">Buy for ${esc(item.priceText)}</button>
             <p class="buynote" id="buyNote">One payment, no password. Listen on your phone straight away.</p>`}
      </div>
    </div>

    ${item.sample ? `<h2>Hear a little first</h2>
    <div class="sample" id="sample">
      <button id="spBtn" aria-label="Play the free sample">${icoPlay}</button>
      <div class="sb"><b>Free sample</b><small id="spTime">0:00 / ${fmt(item.sample.duration)}</small>
        <input type="range" id="spSeek" min="0" max="1000" value="0" aria-label="Position in the sample"></div>
    </div>` : ''}

    <h2>About this ${esc(item.kind.toLowerCase())}</h2>
    ${desc.map(p => `<p>${esc(p)}</p>`).join('')}

    ${chapters.length ? `<h2>The chapters</h2>
    <ol class="chapters">${chapters.map((c,i) => `<li><span class="n">${i+1}</span><span class="t"><b>${esc(c.title)}</b><em>${esc(teaser(c.first))}</em></span><span class="len">${mins(c.duration)} min</span></li>`).join('')}</ol>` : ''}

    ${book && (book.url || book.audiobook) ? `<h2>Also available</h2>
    <div class="also buy">${book.url ? `<a class="btn ghost" href="${esc(book.url)}">The book on Amazon</a>` : ''}${book.audiobook ? `<a class="btn spotify" href="${esc(book.audiobook)}" target="_blank" rel="noopener">Audiobook on Spotify</a>` : ''}</div>` : ''}
    <p class="soft" style="margin-top:26px;font-size:.95rem">Already bought this? <a href="storytime.html">Open your stories</a>.</p>
  `;

  /* free sample (a public file) */
  if(item.sample){
    const a = new Audio(); a.preload = 'none'; a.src = item.sample.audio;
    const btn = $('#spBtn'), seek = $('#spSeek'), tm = $('#spTime');
    const d = () => (isFinite(a.duration) && a.duration > 0) ? a.duration : item.sample.duration;
    btn.onclick = () => { if(a.paused){ const p = a.play(); if(p && p.catch) p.catch(() => { tm.textContent = 'Sorry, the sample could not be played.'; }); } else a.pause(); };
    a.addEventListener('play', () => { btn.innerHTML = icoPause; btn.setAttribute('aria-label','Pause the sample'); });
    a.addEventListener('pause', () => { btn.innerHTML = icoPlay; btn.setAttribute('aria-label','Play the free sample'); });
    a.addEventListener('ended', () => { a.currentTime = 0; });
    a.addEventListener('timeupdate', () => { tm.textContent = fmt(a.currentTime) + ' / ' + fmt(d()); seek.value = Math.round(a.currentTime / d() * 1000); });
    a.addEventListener('error', () => { tm.textContent = 'The sample is not ready yet.'; });
    seek.addEventListener('input', () => { if(a.readyState === 0){ a.preload = 'metadata'; a.load(); a.addEventListener('loadedmetadata', () => { a.currentTime = seek.value / 1000 * d(); }, { once:true }); } else a.currentTime = seek.value / 1000 * d(); });
    if('mediaSession' in navigator){ a.addEventListener('play', () => { navigator.mediaSession.metadata = new MediaMetadata({ title:'Free sample', artist:item.title, album:'Miss Sophia Books' }); }); }
  }

  /* Buy: switched on in stage 3 (Stripe). Until then the button explains itself. */
  const buy = $('#buyBtn');
  if(buy) buy.onclick = () => {
    if(typeof window.startCheckout === 'function') return window.startCheckout(item);
    $('#buyNote').textContent = 'Buying is not switched on yet. It will be soon.';
  };
})();
