// ==UserScript==
// @name          Testing zeitgeist
// @namespace     http://www.benizi.com/
// @description   Changes the width on paulgraham.com tables to 1300 from 375
// @include       http://elation.princeton.edu/~bhaskell/cgi-bin/zeitgeist
// ==/UserScript==

(function () {
   var all = document.evaluate('//*[@width="375"]',
                               document, null,
                               XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < all.snapshotLength; i++) {
      var it = all.snapshotItem(i);
      if (it.nodeName != null) {
         if (it.nodeName == 'TABLE' || it.nodeName == 'TD')
            it.setAttribute('width', '1300');
      }
   }
})();
