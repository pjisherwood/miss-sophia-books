/* The private link in the access email lands here: it puts the token on this phone, checks it, and opens the stories. */
(function(){
  const root = $('#ms');
  const t = new URLSearchParams(location.search).get('t');
  const bad = () => { root.innerHTML = '<h1 class="title">We could not open that link</h1><p>The link may be incomplete. Please open it again from your email, or <a href="find-stories.html">ask for a new one with “Restore purchases”</a>.</p><p><a class="btn" href="library.html">Go to Story time</a></p>'; };
  if(!t){ bad(); return; }
  (async () => {
    msbAddToken(t);
    const owned = await msbRefresh();
    /* keep the address bar clean: the token is now remembered on this phone */
    try{ history.replaceState(null, '', '/mystories.html'); }catch(e){}
    if(owned.length){ location.replace('library.html' + (owned.length === 1 ? '#' + owned[0] : '')); } else bad();
  })();
})();
