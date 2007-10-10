// ==UserScript==
// @name          Comic Alt Text
// @namespace     http://benizi.com/gm
// @description   Shows the "title" attribute of Dino- and XKCD comics
// @include       http://xkcd.com/*
// @include       http://www.xkcd.com/*
// @include       http://qwantz.com/*
// @include       http://www.qwantz.com/*
// ==/UserScript==

(function () {
 var pat = [
  '//img[@title][contains(@src,"comics/comic")]' // Dino Comics
  ,'//img[@title][contains(@src,"/comics/")]' // XKCD
 ];
 try {
 p: for (var i = 0; i < pat.length; i++) {
  var all = document.evaluate(pat[i], document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var j = 0; j < all.snapshotLength; j++) {
   var it = all.snapshotItem(j);
   var ne = document.createElement('p');
   var nt = document.createTextNode('[' + it.title + ']');
   ne.appendChild(nt);
   it.parentNode.insertBefore(ne,it.nextSibling);
   it.parentNode.insertBefore(document.createElement('br'),it.nextSibling);
   break p;
  }
 }
 } catch (e) { alert("Nope:\n"+e); }
})();
