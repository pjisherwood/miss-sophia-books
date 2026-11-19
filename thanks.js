/* After paying: confirm the payment with Stripe (through our function), then take the buyer to their stories.
   The phone keeps the buyer's private token, so the button opens their library straight away. */
(function(){
  const root = $('#thx');
  const id = new URLSearchParams(location.search).get('session_id');
  const show = (h) => { root.innerHTML = h; };
  if(!id){ show('<h1 class="title">Thank you</h1><p>If you have just bought something, your email has the link to your stories.</p><p><a class="btn" href="storytime.html">Go to Story time</a></p>'); return; }
  let tries = 0;
  async function check(){
    tries++;
    try{
      const r = await fetch('/api/order-status?session_id=' + encodeURIComponent(id));
      const d = await r.json().catch(() => ({}));
      if(r.ok && d.paid){
        if(d.token && window.msbAddToken) msbAddToken(d.token, d.slug);
        const item = AUDIOBOOKS.find(a => a.slug === d.slug);
        show(`<h1 class="title">Thank you</h1>
          <p style="font-size:1.15rem">Your payment went through${item ? ' for <b>' + esc(item.title) + '</b>' : ''}.</p>
          <p>${d.email ? 'We are emailing your private link to <b>' + esc(d.email) + '</b>. ' : ''}Keep that email: it is how you get back to your stories on any phone, with no password.</p>
          <p><a class="btn buy-btn" id="open" href="storytime.html#${esc(d.slug || '')}">Open my stories</a></p>
          <p class="soft" style="font-size:.95rem">Lost the email? On the Story time page, use “Find my stories”.</p>`);
        return;
      }
      if(r.ok && !d.paid){ show('<h1 class="title">We have not received your payment yet</h1><p>If you were charged, please wait a moment and refresh this page. Nothing is lost.</p><p><a class="btn" href="javascript:location.reload()">Check again</a></p>'); return; }
      show('<h1 class="title">Thank you</h1><p>' + esc(d.error || 'We could not check your payment just now.') + ' If you have paid, your email will have the link to your stories.</p>');
    }catch(e){ if(tries < 3){ setTimeout(check, 1500); } else show('<h1 class="title">Thank you</h1><p>We could not check your payment just now. If you have paid, your email will have the link to your stories.</p>'); }
  }
  check();
})();
