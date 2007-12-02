// ==UserScript==
// @name          Make Links Titles
// @namespace     http://benizi.com/gm
// @description   Changes all links without "title" attributes to title="(url)"
// @include       http://*
// ==/UserScript==

(function () {
 try {
  var all = document.evaluate('//a[not(@title)][not(.//img)]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var j = 0; j < all.snapshotLength; j++) {
   var it = all.snapshotItem(j);
   var label = it.getAttribute('href');
   if (!label) label = it.getAttribute('name');
   if (!label) label = 'no destination?';
   it.setAttribute('title',label);
  }
 } catch (e) { alert("Nope:\n"+e); }
})();
