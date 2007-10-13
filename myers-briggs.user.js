// ==UserScript==
// @name          Shows the abbreviations
// @namespace     http://benizi.com/gm
// @description   Shows the 4-letter codes for "type relationship" links on typelogic.com
// @include       http://*typelogic.com*
// ==/UserScript==

(function () {
 var pat = [
  '//a[@href]'
 ];
 try {
 p: for (var i = 0; i < pat.length; i++) {
  var all = document.evaluate(pat[i], document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var j = 0; j < all.snapshotLength; j++) {
   var it = all.snapshotItem(j);
   var ma = it.href.match(/([ie][ns][tf][jp])\.html$/);
   if (!ma) continue;
   if (it.firstChild.nodeValue.match(ma[1].toUpperCase())) continue;
   var nt = document.createTextNode(' [' + ma[1].toUpperCase() + ']');
   it.appendChild(nt);
  }
 }
 } catch (e) { alert("Nope:\n"+e); }
})();
