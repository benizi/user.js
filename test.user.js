// ==UserScript==
// @name          Trakken keyboard shortcut hack
// @namespace     http://benizi.com/gm/
// @description   Adds accesskeys to some Trakken buttons
// @include       http://campuscgi.princeton.edu/*
// ==/UserScript==

(function () {
   var all = document.evaluate('//input[@type="submit"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < all.snapshotLength; i++) {
      var it = all.snapshotItem(i);
      if (it.nodeName == null) continue;
	  if (it.nodeName != 'INPUT') continue;
      if (it.getAttribute('value') == 'Submit')
         it.setAttribute('accesskey', 's');
   }
})();
