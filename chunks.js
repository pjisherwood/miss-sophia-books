/* Story time: splits a story into short "chunks" of roughly 30 words, always ending at the end of a sentence,
   so the player can show every chunk at one standard font size.
   Used by storytime.js in the browser and by make_marks.py (through node) when it works out the timings.
   If you change these numbers, run make_marks.py again, because the timings are stored per chunk. */
(function (root) {
  var MIN = 20, TARGET = 32, MAX = 44, HARD = 50;

  function words(t) { var m = t.match(/\S+/g); return m ? m.length : 0; }

  /* a sentence of more than about 50 words is broken at the comma, semicolon or dash nearest its middle */
  function splitLong(s) {
    var n = words(s);
    if (n <= 50) return [s];
    var half = n / 2, best = -1, bestd = 1e9, re = /[,;:\u2014]\s+/g, m;
    while ((m = re.exec(s))) {
      var d = Math.abs(words(s.slice(0, m.index + 1)) - half);
      if (d < bestd) { bestd = d; best = m.index + m[0].length; }
    }
    if (best < 0) return [s];
    return splitLong(s.slice(0, best).trim()).concat(splitLong(s.slice(best).trim()));
  }

  /* split one paragraph into sentences (a full stop, ! or ? followed by a capital letter or an opening quote) */
  function sentences(p) {
    var out = [], start = 0, n = p.length, i = 0;
    while (i < n) {
      var c = p.charAt(i);
      if (c === '.' || c === '!' || c === '?' || c === '…') {
        var j = i + 1;
        while (j < n && /[.!?…”’)"']/.test(p.charAt(j))) j++;
        var k = j;
        while (k < n && /\s/.test(p.charAt(k))) k++;
        if (j >= n || (k > j && /[“‘A-Z0-9]/.test(p.charAt(k)))) {
          var s = p.slice(start, j).trim();
          if (s) out.push.apply(out, splitLong(s));
          start = k; i = k; continue;
        }
        i = j; continue;
      }
      i++;
    }
    if (start < n) { var r = p.slice(start).trim(); if (r) out.push.apply(out, splitLong(r)); }
    return out;
  }

  /* returns { chunks:[{text, p0, p1, w}], paraChunk:[index of the chunk each paragraph starts in] } */
  function chunkStory(body) {
    var items = [], paraFirst = [];
    body.forEach(function (par, pi) {
      var ss = sentences(par);
      paraFirst.push(items.length);
      var bal = 0;
      ss.forEach(function (s, si) {
        bal += (s.match(/\u201C/g) || []).length - (s.match(/\u201D/g) || []).length;
        items.push({ t: s, w: words(s), p: pi, si: si, end: si === ss.length - 1, open: bal > 0 && si < ss.length - 1 });
      });
    });
    var chunks = [], cur = null, itemChunk = [], carry = false;
    function close() { if (cur) { chunks.push(cur); cur = null; } }
    items.forEach(function (it, ix) {
      if (cur && cur.w >= MIN && ((!cur.open && (cur.endsPara || cur.w + it.w > MAX || cur.w >= TARGET)) || cur.w + it.w > HARD)) { carry = cur.open && it.p === cur.p1; close(); } else if (!cur) carry = false;
      if (!cur) cur = { text: '', w: 0, p0: it.p, s0: it.si, p1: it.p, endsPara: false, open: false };
      if (cur.w) cur.text += (it.p !== cur.p1 ? '\n' : ' ');
      /* a long quotation split across two chunks: the second part starts with an opening quote mark */
      if (!cur.w && carry && it.t.charAt(0) !== '\u201C') { cur.text += '\u201C'; }
      carry = false;
      cur.text += it.t; cur.w += it.w; cur.p1 = it.p; cur.endsPara = it.end; cur.open = it.open;
      itemChunk[ix] = chunks.length;
    });
    close();
    /* a very short last chunk joins the one before it */
    if (chunks.length > 1) {
      var last = chunks[chunks.length - 1], prev = chunks[chunks.length - 2];
      if (last.w < 12 && prev.w + last.w <= MAX + 12) {
        prev.text += (last.p0 !== prev.p1 ? '\n' : ' ') + last.text; prev.w += last.w; prev.p1 = last.p1;
        chunks.pop();
        for (var q = 0; q < itemChunk.length; q++) if (itemChunk[q] >= chunks.length) itemChunk[q] = chunks.length - 1;
      }
    }
    var paraChunk = paraFirst.map(function (ix) { return itemChunk[ix]; });
    return { chunks: chunks, paraChunk: paraChunk };
  }

  root.chunkStory = chunkStory;
  if (typeof module !== 'undefined' && module.exports) module.exports = { chunkStory: chunkStory, words: words, sentences: sentences };
})(typeof window !== 'undefined' ? window : this);
