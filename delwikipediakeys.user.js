// ==UserScript==
// @name          Disable all accesskeys
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   Removes all accesskey attributes
// @include       http://*
// @include       https://*
// ==/UserScript==

(function () {
   var all = document.evaluate('//*[@accesskey]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < all.snapshotLength; i++)
      all.snapshotItem(i).removeAttribute('accesskey');
})();
function akeytt () { return; }
