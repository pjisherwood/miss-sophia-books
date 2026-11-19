/* Who owns what.
   STAGE 2 (now): nobody owns anything, except in "preview" mode. Open any product page once with ?preview=1 on the end of the address
   (for example /audiobook/a-christmas-dream?preview=1) and this browser can open the chapter player with placeholder audio.
   Use ?preview=0 to switch preview off again.
   STAGE 4 replaces this with the private library link (the long random token) checked by a Netlify Function. */
(function(){
  const K = 'msb-preview';
  try{
    if(/[?&]preview=1\b/.test(location.search)) localStorage.setItem(K, '1');
    if(/[?&]preview=0\b/.test(location.search)) localStorage.removeItem(K);
  }catch(e){}
  window.msbPreview = () => { try{ return localStorage.getItem(K) === '1'; }catch(e){ return false; } };
  window.isOwned = slug => window.msbPreview();
})();
