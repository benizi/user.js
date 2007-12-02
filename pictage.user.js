// ==UserScript==
// @name          Pictage
// @namespace     http://benizi.com/gm
// @description   Unlimited-size pictage.com pictures
// @include       *pictage.com/*
// @include       *benizi.com/cgi/html*
// ==/UserScript==

(function(){
// http://www.pictage.com/photodisplay/PHOTODISPLAY/zoom_image.xml?producer=photodisplay&image=PIV2:374852/48&max_width=400&max_height=400&xsl=/xsl/pdconsumer/zoom_command.xsl&error_xsl=/xsl/orders/error.xsl&event=EVV1:374852&eov=&isfav=false&jsessionid=2064B55076A48EA737E6EFFBEC63B83D.bl1005a
// image URL
// http://pis-farm.pictage.com/servlet/PIS?load=/home/image/proxydb/M/P/MP003/2007/374852/01/44_D_S_0044.jpg|crop&x0=0&y0=1&wdth=900&hite=598|prop=below&wdth=2000&hite=2000&cb=0

 function picturl(base,n,w,h,pos) {
  if (!base) base = 'http://pis-farm.pictage.com/servlet/PIS?load=/home/image/proxydb/M/P/MP003/2007/374852/01/';
  else base = 'http://pis-farm.pictage.com/servlet/PIS?load='+base;
  var m = base.match(/^(.*\/)[^\/]+\.jpg$/);
  if (m) base = m[1];
  if (!w) w = 1280;
  if (!h) h = 800;
  if (!pos) pos = 'above';
  var s = ''+n;
  while (s.length < 2) s = '0' + s;
  var l = ''+n;
  while (l.length < 4) l = '0' + l;
  var url = base + '\\s_D_S_\\l.jpg|prop=\\p&wdth=\\w&hite=\\h&cb=0';
  return url.replace('\\s',s).replace('\\l',l).replace('\\p',pos).replace('\\w',w).replace('\\h',h);
 }
 var sizes = new Array(
  { w: 320, h: 240, t: 'mini', p: 'below' }
  ,{ w: 640, h: 480, t: 'VGA', p: 'above' }
  ,{ w: 1024, h: 768, t: '1024', p: 'above' }
  ,{ w: window.screen.width, h: window.screen.height, t: 'desktop', p: 'above' }
  ,{ w: 1600, h: 1200, t: '1600', p: 'above' }
  ,{ w: 2048, h: 2048, t: 'large', p: 'below' }
  ,{ w: 2048, h: 2048, t: 'enormous', p: 'above' }
 );
 try {
  var links = new Array();
  var all = document.evaluate('//span[@class="orange"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < all.snapshotLength; i++) {
   var it = all.snapshotItem(i);
   var txt = it.innerHTML;
   var m = txt.match(/^([0-9]+)$/);
   if (!m) continue;
   var num = m[1];
   var tr = it;
   while (tr && (!tr.tagName || (tr.tagName != 'TR' && tr.tagName != 'HTML')))
    tr = tr.parentNode;
   tr = tr.nextSibling;
   while (tr && (!tr.tagName || (tr.tagName != 'TR' && tr.tagName != 'HTML')))
    tr = tr.nextSibling;
   var imgs = document.evaluate('.//img', tr, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   var img = imgs.snapshotItem(0);
   var src = img.getAttribute('src');
   var m = src.match(/^([^?]+).*load=([^|)]+)/);
   if (!m) continue;
   var base = m[2];
   var urls = new Object();
   for (var j = 0; j < sizes.length; j++) {
    var s = sizes[j];
    it.appendChild(document.createTextNode(' '));
    var a = document.createElement('a');
    var href = picturl(base,num,s['w'],s['h'],s['p']);
    urls[s['t']] = href;
    a.setAttribute('href',href);
    a.appendChild(document.createTextNode('['+s['t']+']'));
    var title = (s['p'] == 'above') ? "larger than " : "smaller than ";
    title += s['w'] + 'x' + s['h'];
    a.setAttribute('title',title);
    it.appendChild(a);
   }
   links.push(new Object({u:urls,n:num}));
  }
  if (!GM_getValue('linkerpanel','')) return;
  if (!links.length) return;
  var linkgroups = new Array();
  var linko = new Object();
  while (links.length) {
   if (!linkgroups.length || linkgroups[linkgroups.length-1].length >= 6)
    linkgroups.push(new Array());
   linkgroups[linkgroups.length-1].push(links.shift());
  }
  var div = document.createElement('div');
  div.style.cssText = 'position: fixed; bottom: 0; right: 0; background: white';
  for (var j = 0; j < sizes.length; j++) {
   var s = sizes[j];
   div.appendChild(document.createTextNode(s['t']));
   for (var k = 0; k < linkgroups.length; k++) {
    var g = linkgroups[k];
    var t = g[0]['n'];//+'-'+g[g.length-1]['n'];
    var id = 'linker-'+j+'-'+k;
    linko[id] = new Array();
    for (var l = 0; l < g.length; l++) linko[id].push(g[l]['u'][s['t']]);
    var sp = document.createElement('SPAN');
    sp.setAttribute('id',id);
    sp.addEventListener('click',function(){
     var ls = linko[this.getAttribute('id')];
     for (var i = 0; i < ls.length; i++)
      window.open(ls[i]);
     this.style.cssText = 'color: #f0f';
    }, false);
    sp.appendChild(document.createTextNode(' '+t));
    div.appendChild(sp);
   }
   div.appendChild(document.createElement('BR'));
  }
  var b = document.getElementsByTagName('BODY');
  b[0].appendChild(div);
 } catch (e) { alert("Problem: "+e); }
})();
