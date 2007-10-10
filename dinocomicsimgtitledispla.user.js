// ==UserScript==
// @name          Dino Comics img title display
// @namespace     http://benizi.com/gm
// @description   Shows the "title" of Dinosaur Comics comics (usually funny)
// @include       http://qwantz.com/*
// @include       http://www.qwantz.com/*
// ==/UserScript==

(function () {
   var all = document.evaluate('//img[@title]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < all.snapshotLength; i++) {
      var it = all.snapshotItem(i);
      if (!it.src.match('comics/comic')) continue;
      var ne = document.createElement('p');
      var nt = document.createTextNode('[' + it.title + ']');
      ne.appendChild(nt);
      it.parentNode.appendChild(ne);
   }
})();
