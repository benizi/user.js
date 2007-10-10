// ==UserScript==
// @name          Coppermine Dimensions
// @namespace     http://benizi.com/gm
// @description   Shows the dimensions of Coppermine photo album photos
// @include       http://*/gallery/thumbnails.php*
// ==/UserScript==

(function () {
 var pat = [
  '//img[@title][contains(@title,"Dimensions")]'
 ];
 try {
 p: for (var i = 0; i < pat.length; i++) {
  var all = document.evaluate(pat[i], document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var j = 0; j < all.snapshotLength; j++) {
   var it = all.snapshotItem(j);
   var ne = document.createElement('p');
   var ma = it.title.match(/Dimensions=(\d+x\d+)/);
   var nt = document.createTextNode('[' + ma[1] + ']');
   ne.appendChild(nt);
   it.parentNode.insertBefore(ne,it.nextSibling);
   it.parentNode.insertBefore(document.createElement('br'),it.nextSibling);
//   break; // break p;
  }
 }
 } catch (e) { alert("Nope:\n"+e); }
})();
