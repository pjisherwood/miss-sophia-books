/* "Restore purchases": asks the server to email a fresh private link to the address used at payment. The answer is always the same, whoever the address belongs to. */
(function(){
  const form = $('#ff'), em = $('#em'), go = $('#go'), msg = $('#msg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = em.value.trim();
    if(!/^\S+@\S+\.\S+$/.test(email)){ msg.textContent = 'Please check the email address.'; return; }
    go.disabled = true; go.textContent = 'One moment…'; msg.textContent = '';
    try{
      const r = await fetch('/api/find-stories', { method:'POST', headers:{ 'content-type':'application/json' }, body: JSON.stringify({ email }) });
      const d = await r.json().catch(() => ({}));
      msg.textContent = r.ok ? (d.message || 'Done.') : (d.error || 'Sorry, something went wrong. Please try again.');
      if(r.ok){ go.textContent = 'Sent'; return; }
    }catch(err){ msg.textContent = 'Sorry, we could not connect. Please check your internet and try again.'; }
    go.disabled = false; go.textContent = 'Send me my link';
  });
})();
