
// Hello World! example user script
// version 0.1 BETA!
// 2005-04-25
// Copyright (c) 2005, Mark Pilgrim
// Released under the GPL license
// http://www.gnu.org/copyleft/gpl.html
//
// --------------------------------------------------------------------
//
// This is a Greasemonkey user script.  To install it, you need
// Greasemonkey 0.3 or later: http://greasemonkey.mozdev.org/
// Then restart Firefox and revisit this script.
// Under Tools, there will be a new menu item to "Install User Script".
// Accept the default configuration and install.
//
// To uninstall, go to Tools/Manage User Scripts,
// select "Hello World", and click Uninstall.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          PG Table Hack
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   Changes the width on paulgraham.com tables to 1300 from 375
// @include       http://paulgraham.com/*
// @include       http://www.paulgraham.com/*
// ==/UserScript==

(function () {
   var all = document.evaluate('//*[@width="375"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < all.snapshotLength; i++) {
      var it = all.snapshotItem(i);
      if (it.nodeName != null) {
         if (it.nodeName == 'TABLE' || it.nodeName == 'TD')
            it.setAttribute('width', '1300');
      }
   }
})();
