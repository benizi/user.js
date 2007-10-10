// ==UserScript==
// @name          Wikipedia Cite
// @namespace     http://benizi.com/gm
// @description   Changes "citation needed" to "fuck citations!"
// @include       http://*wikipedia.org/*
// ==/UserScript==

(function () {
  var types = new Array(
   '//sup//a//i//text()',
   '//sup//span//i//a//text()'
  );
  for (var j = 0; j < types.length; j++) {
   var all = document.evaluate(types[j], document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < all.snapshotLength; i++) {
      var it = all.snapshotItem(i);
      if (!it.data.match(/citation\s*needed/)) continue;
      it = it.parentNode;
      it.replaceChild(document.createTextNode("FUCK CITATIONS!"),it.firstChild);
   }
  }
})();
