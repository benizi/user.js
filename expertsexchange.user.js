// ==UserScript==
// @name          Un ROT-13 the comments
// @namespace     http://benizi.com/gm
// @description   Undoes experts-exchange.com's retarded obfuscation
// @include       http://*experts-exchange.com/*html
// ==/UserScript==

(function () {
 var pat = [ '//div[@class="answerBody"]' ];
 try {
 p: for (var i = 0; i < pat.length; i++) {
  var all = document.evaluate(pat[i], document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var j = 0; j < all.snapshotLength; j++) {
   var it = all.snapshotItem(j);
   var search = new Array(it);
   while (search.length) {
    var c = search.pop();
    for (var k = 0; k < c.childNodes.length; k++) search.push(c.childNodes[k]);
    if (c.nodeType != 3) continue;
    var p = c.parentNode;
    var txt = c.nodeValue;
    var rep = new String("");
    for (var k = 0; k < txt.length; k++) {
     var ch = txt.charAt(k);
     if (!ch.match(/[A-Za-z]/)) { rep += ch; continue; }
     var cv = ch.charCodeAt(0);
     rep += String.fromCharCode(cv + (ch.match(/[N-Zn-z]/) ? -13 : 13));
    }
    var t = document.createTextNode(rep);
    p.replaceChild(t,c);
   }
  }
 }
 } catch (e) { alert("Nope:\n"+e); }
})();
