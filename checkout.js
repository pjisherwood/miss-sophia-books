/* The page just before Stripe: what you are buying, one tick you must give, and one optional tick (unticked to start with). */
(function(){
  const root = $('#co');
  const qs = new URLSearchParams(location.search);
  const slug = qs.get('slug') || '';
  /* only for testing with a Stripe test key: ?route=uk or ?route=overseas picks the payment route (the server ignores it with a live key) */
  const route = qs.get('route') || '';
  const item = AUDIOBOOKS.concat(WISDOM.filter(w => w.access === 'paid' && w.audio)).find(x => x.slug === slug && x.access === 'paid');
  if(!item){ root.innerHTML = '<h1 class="title">We couldn’t find that one</h1><p><a class="btn" href="books.html">See the books</a></p>'; return; }
  document.title = 'Checkout – ' + item.title + ' – Miss Sophia Books';
  const cover = item.cover || item.image;

  root.innerHTML = `
    <h1 class="title" style="margin-top:0">Almost there</h1>
    <div class="co-item"><div class="pcover small" style="background-image:url('${esc(cover)}')" role="img" aria-label="Cover of ${esc(item.title)}"></div>
      <div><b>${esc(item.title)}</b><span class="soft">${esc(item.kind || 'Audio')}</span><span class="facts"><b>${esc(item.priceText)}</b></span></div></div>

    <label class="tick"><input type="checkbox" id="agree"> <span>${esc(CHECKOUT_WORDING.digital)}</span></label>
    <label class="tick"><input type="checkbox" id="mkt"> <span>${esc(CHECKOUT_WORDING.marketing)}</span></label>

    <button class="btn buy-btn" id="pay" disabled>Continue to payment</button>
    <p class="buynote" id="msg">You will pay securely on Stripe, with a card, Apple Pay or Google Pay if your phone has them. Then your stories are waiting for you, with no password.</p>
    <p class="buynote">By buying you agree to our <a href="terms-of-service" target="_blank" rel="noopener">terms</a>. See how we look after your details in our <a href="privacy.html" target="_blank" rel="noopener">privacy notice</a>.</p>
    <p class="soft" style="font-size:.95rem"><a href="audiobook/${esc(item.slug)}">← Back</a></p>`;

  const agree = $('#agree'), mkt = $('#mkt'), pay = $('#pay'), msg = $('#msg');
  agree.onchange = () => { pay.disabled = !agree.checked; };
  pay.onclick = async () => {
    pay.disabled = true; pay.textContent = 'One moment…'; msg.textContent = '';
    try{
      const r = await fetch('/api/create-checkout', { method:'POST', headers:{ 'content-type':'application/json' },
        body: JSON.stringify({ productId:item.productId, agreed:agree.checked, marketing:mkt.checked, route }) });
      const d = await r.json().catch(() => ({}));
      if(r.ok && d.url){ location.href = d.url; return; }
      msg.textContent = (d.error || 'Sorry, something went wrong. Please try again.');
    }catch(e){ msg.textContent = 'Sorry, we could not connect. Please check your internet and try again.'; }
    pay.disabled = !agree.checked; pay.textContent = 'Continue to payment';
  };
  /* coming back with the browser's back button must not leave the button stuck */
  window.addEventListener('pageshow', e => { if(e.persisted){ pay.textContent = 'Continue to payment'; pay.disabled = !agree.checked; } });
})();
