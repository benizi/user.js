// ==UserScript==
// @name          Trakken keyboard shortcut hack
// @namespace     http://benizi.com/gm/
// @description   Adds accesskeys to some Trakken buttons
// @include       http://trakken.corp.google.com/*
// ==/UserScript==

(function () {
   var all = document.evaluate('//input[@type="submit"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < all.snapshotLength; i++) {
      var it = all.snapshotItem(i);
      if (it.nodeName == null) continue;
	  if (it.nodeName != 'INPUT') continue;
      var name = it.getAttribute('name');
      if (name == 'Action.Respond') it.setAttribute('accesskey', 'r');
      if (name == 'selectAllButton') it.setAttribute('accesskey', 'a');
   }
})();
