// ==UserScript==
// @name          Pictage
// @namespace     http://benizi.com/gm
// @description   Unlimited-size pictage.com pictures
// @include       *pictage.com/*
// @include       *benizi.com/cgi/html*
// ==/UserScript==

(function(){
// BODY
// http://www.pictage.com/photodisplay/PHOTODISPLAY/zoom_image.xml?producer=photodisplay&image=PIV2:374852/48&max_width=400&max_height=400&xsl=/xsl/pdconsumer/zoom_command.xsl&error_xsl=/xsl/orders/error.xsl&event=EVV1:374852&eov=&isfav=false&jsessionid=2064B55076A48EA737E6EFFBEC63B83D.bl1005a
// http://pis-farm.pictage.com/servlet/PIS?load=/home/image/proxydb/M/P/MP003/2007/374852/01/44_D_S_0044.jpg|crop&x0=0&y0=1&wdth=900&hite=598|prop=below&wdth=2000&hite=2000&cb=0
 function picturl(n) {
  var s = ''+n;
  while (s.length < 2) s = '0' + s;
  var l = ''+n;
  while (l.length < 4) l = '0' + l;
  return new String('http://pis-farm.pictage.com/servlet/PIS?load=/home/image/proxydb/M/P/MP003/2007/374852/01/\\s_D_S_\\l.jpg|prop=above&wdth=1280&hite=800&cb=0').replace('\\s',s).replace('\\l',l);
 }
 try {
  var all = document.evaluate('//span[@class="orange"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < all.snapshotLength; i++) {
   var it = all.snapshotItem(i);
   var txt = it.innerHTML;
   var m = txt.match(/^([0-9]+)$/);
//   if (!m) alert('no match:\n'+txt);
   if (!m) continue;
   it.appendChild(document.createTextNode(' '));
   var a = document.createElement('a');
   a.setAttribute('href',picturl(m[1]));
   a.appendChild(document.createTextNode('[large '+m[1]+']'));
   it.appendChild(a);
  }
 } catch (e) { alert("Problem: "+e); }
})();
