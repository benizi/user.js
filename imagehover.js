/* I'm not even sure what could be considered derivative at this point, but:
 * Original code by Noel del Rosario del.freeshell.org del@freeshell.org
 * This code by Ben Haskell - benizi.com
 */
/* See RULES section below */
var al = 0;
var iHDebug = false;
var iHDStrings = new Array();
function myalert (s) {
 if (al<0) alert(s);
 al++;
 var v = document.getElementById('ihdebug');
 if (!v) v = document.getElementById('iHDebugInput');
 if (!v) return;
 var r = (v.tagName == 'TEXTAREA') ? v.getAttribute('rows') : 1;
 iHDStrings.push(s+' @ '+(new Date()));
 while (iHDStrings.length > r) iHDStrings.shift();
 v.value = iHDStrings.join("\n");
}
var iHElements = new Object();
function iHNewElement (site, list, pop) {
 if (pop == null) pop = false;
 else pop == true;
 myalert("site: "+site+"\nlist: "+list);
 var pat = (typeof(site) != 'string') ? new RegExp(site) : new String(site);
 if (list[0].match(/^[A-Za-z]*$/)) list[0] = '//'+list[0];
 var m = new Array();
 var r = new Array();
 for (var i = 2; i < list.length; i++)
  if ((i % 2) == 0) m.push(list[i]);
  else r.push(list[i]);
 if (!iHElements[site]) iHElements[site] = new Array();
 iHElements[site].push(new Object({
  pat: pat, xpath: list[0], attr: list[1], match: m, rep: r, pop: pop
 }));
}
/*vvvvvvvvvvvvvvvvvvvv RULES vvvvvvvvvvvvvvvvvvvvvvvv*/
try {
iHNewElement('.imdb.com', [ '//img', 'src',
 /([0-9])t\.jpg/, "$1m.jpg" ]);
iHNewElement('.imdb.com', [ '//img', 'src',
 /\/th-/, '/' ]);
iHNewElement('.google.com', [ '//img', 'src',
 /^http:\/\/[a-z0-9]+\.google\.com\/images\?q=tbn:[^:]*:(http:\/\/[^&]*)/, "$1"
 ], true);
iHNewElement('myspace.com', [ '//img', 'src',
 /_s\.jpg$/, "_l.jpg",
 /_m\.jpg$/, "_l.jpg",
 /\/s_/, "/l_",
 /\/m_/, "/l_" ]);
iHNewElement(/\.facebook\.com.*php/, [ '//img', 'src',
 /\/t([0-9])/, "/n$1",
 /\/q([0-9])/, "/n$1",
 /\/s([0-9])/, "/n$1" ]);
iHNewElement(/\.facebook\.com.*php/, [ '//div//a//span', 'style.backgroundImage',
 /^.*url\((http:\/\/.*\/)t([^\/\)]*)\)/, "$1s$2" ]);
iHNewElement('friendster.com', [ '//img', 'src',
 /([0-9])s\.jpg$/, "$1l.jpg",
 /([0-9])m\.jpg$/, "$1l.jpg" ]);
iHNewElement('consumating.com', [ '//img', 'src',
 /100\//, "large/" ]);
iHNewElement('flickr.com', [ '//img', 'src',
 '_m.jpg', '.jpg' ]);
iHNewElement('wikipedia.org', [ '//img', 'src',
 /thumb\/(.*)\/[0-9]+px[^\/]+$/, "$1" ]);
iHNewElement(/\.amazon\./, [ '//img', 'src',
 /_SCTHUMB/, '_SCLZZZZ',
 /_SCT/, '_SCL',
 /_OU01_/, '_SS500_',
 /_SL100_/, '_SS500_',
 /_AA240_/, '_SS500_'
]);
iHNewElement(/\.43(things|people)\.com/, [ '//img', 'src',
 's25.jpg', 's300.jpg',
 's30.jpg', 's300.jpg',
 's75.jpg', 's300.jpg',
 's150.jpg', 's300.jpg',
 's160.jpg', 's320.jpg',
 'pw150.jpg', 'pw300.jpg'
]);
iHNewElement(/\.victoriassecret\./, [ '//img', 'src',
 '/prodpri/', '/prodlgvw/',
 '/tmbsm/', '/prodlgvw/',
 '/tmbsm2/', '/prodlgvw/',
 '/tmblg/', '/prodlgvw/',
 '/tmblg2/', '/prodlgvw/',
]);
iHNewElement(/./, [ '//img', 'src',
 /_small/, '_large',
 /_medium/, '_large',
]);
} catch(e) { alert('RULES error: '+e); }
/*^^^^^^^^^^^^^^^^^^^^ RULES ^^^^^^^^^^^^^^^^^^^^^^^^*/
var imageHover;
var iHU = {
 micro: 'micro/', small: 'thumb/', medium: 'medium/', large: 'large/',
 nil: 'resource://gre/res/broken-image.gif',
 img: 'resource://gre/res/loading-image.gif'
};
var iHSize = {micro:1, small:1, medium:1, large:1};
var current_img;
function mylisten (obj, which, handler) {
 myalert("setting "+which);
 if (obj.addEventListener) return obj.addEventListener(which, handler, false);
 if (obj.attachEvent) return obj.attachEvent('on'+which, handler);
 obj['on'+which] = handler;
}
function imageHoverInit () {
 myalert("iHI opts: "+imageHoverInit.arguments);
 if (imageHoverInit.arguments && !(imageHoverInit.arguments.length % 2))
  for (var i = 0; i < imageHoverInit.arguments.length; i += 2)
   iHNewElement(imageHoverInit.arguments[i],imageHoverInit.arguments[i+1]);
 if (!document.getElementById) return;
 if (!document.getElementsByTagName) return;
 mylisten(window,'DOMContentLoaded',_imageHoverInitWrapped);
 mylisten(window,'load',_imageHoverInitWrapped);
 if (document.getElementsByTagName('body').item(0)) _imageHoverInitWrapped();
}
var iHInited = false;
function _iHPopUp (src,m,r) {
 return function (e) {
  current_img = this;
  for (var l = 0; l < m.length; l++) src = src.replace(m[l], r[l]);
  window.open(src,'iHWindow');
  return false;
 };
}
function _iHMouseOver (src,m,r) {
 return function (e) {
  current_img = this;
  //mylisten(current_img,'load',function(e){imageHoverMove(e)});
//  imageHoverMove(e);
//  iHLatestEvent = e;
  document.getElementById('imageHover').style.visibility = 'hidden';
  myalert('before: '+src);
  for (var l = 0; l < m.length; l++) src = src.replace(m[l], r[l]);
  for (var l = 0; l < m.length; l++) myalert('m['+l+']: '+m[l]+' -> r['+l+']: '+r[l]);
  myalert('after: '+src);
  document.getElementById('imageHoverImg').setAttribute('src', src);
  if (this.captureEvents) this.captureEvents(Event.MOUSEMOVE);
  mylisten(this, 'mousemove', imageHoverMove);
 };
}
function _imageHoverInitWrapped () {
 myalert('_iHIW');
 if (iHInited) return;
 iHInited = true;
 iHNotApplicable = true;
 for (var i in iHElements) {
  var pat = iHElements[i][0]['pat'];
  if (!new String(document.location).match(pat)) continue;
  iHNotApplicable = false;
 }
 if (iHNotApplicable) return;
 // If we can't create elements, this script won't work. So, return.
 imageHover = document.createElement('div');
 imageHover.setAttribute('id', 'imageHover');
 imageHover.style.padding = '0';
 imageHover.style.margin = '0';
 imageHover.style.position = 'absolute';
 imageHover.style.visibility = 'hidden';
 imageHover.style.top = '0';
 imageHover.style.left = '0';
 imageHover.style.border = '1px solid #000';
 imageHover.style.background = '#fff';
 imageHover.style.zIndex = '100000';

 var img = document.createElement('img');
 img.setAttribute('id', 'imageHoverImg');
 img.style.verticalAlign = 'bottom';
 imageHover.appendChild(img);

 if (iHDebug) {
  var d = document.createElement('div');
  var f = document.createElement('form');
  var t = document.createElement('input');
  d.style.position = 'fixed';
  d.setAttribute('id','iHDebugDiv');
  d.style.top = '0px';
  d.style.left = '0px';
  t.setAttribute('value','foo');
  t.setAttribute('size','200');
  t.setAttribute('id','iHDebugInput');
  f.appendChild(t);
  d.appendChild(f);
  document.getElementsByTagName('body').item(0).appendChild(d);
 }
 document.getElementsByTagName('body').item(0).appendChild(imageHover);
 for (var index in iHElements) {
  var pat = iHElements[index][0]['pat'];
  if (!new String(document.location).match(pat)) continue;
  myalert("matched: "+pat);
  for (var i = 0; i < iHElements[index].length; i++) {
   var el = iHElements[index][i];
   var match = document.evaluate(el['xpath'], document, null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var j = 0; j < match.snapshotLength; j++) {
    var thisel = match.snapshotItem(j);
    if (thisel == img) continue;
    var list = el['attr'].split('.');
    var attr = thisel[list[0]];
	for (var k = 1; k < list.length; k++) attr = attr[list[k]];
    myalert("found "+el['xpath']+': '+attr);
    var skip = true;
    for (var k = 0; k < el['match'].length; k++)
     if (new String(attr).match(el['match'][k])) skip = false;
    thisel.setAttribute('seen_by_imageHover',
     (thisel.getAttribute('seen_by_imageHover')
	  ?1+thisel.getAttribute('seen_by_imageHover')
	  :1));
    if (skip) continue;
    if (thisel.getAttribute('matched_by_imageHover')) continue;
    thisel.setAttribute('matched_by_imageHover', 'true');
    mylisten(thisel, 'mouseover', _iHMouseOver(attr,el['match'],el['rep']));
    if (el['pop']) {
     var newEl = document.createElement('img');
     newEl.setAttribute('src', iHU['img']);
     var append = thisel.parentNode;
     if (append.tagName == 'A') append = append.parentNode;
     append.appendChild(newEl);
     mylisten(newEl,'click', _iHPopUp(attr,el['match'],el['rep']));
    }
    mylisten(thisel, 'mouseout', function () {
     myalert('element['+j+'].onmouseout');
     current_img = null;
     imageHover.style.visibility = 'hidden'
     img.setAttribute('src', iHU['nil']);
     if (this.releaseEvents) this.releaseEvents(Event.MOUSEMOVE);
     this.onmousemove = null;
    });
   }
  }
 }

 mylisten(img, 'load', function() {
  myalert('imgarr['+i+'].onload');
  if (!img.getAttribute('src').match(iHU['nil']))
   imageHover.style.visibility = 'visible';
 });
 mylisten(img, 'error', function() { img.src = iHU['nil']; });
}

function imageHoverMove (evt) {
 var over_img = document.getElementById('imageHoverImg');

 var X = 15 + (evt ? evt.pageX : window.event.clientX+document.body.scrollLeft);
 var midX = (document.body.offsetWidth?document.body.offsetWidth:innerWidth)/2;

// innerHeight always seems OK
// and one of: document.body.scrollTop or document.documentElement.scrollTop
 var Y = 5 + (evt ? evt.pageY : window.event.clientY + document.body.scrollTop);
 var top = document.body.scrollTop + document.documentElement.scrollTop;
 var height = (innerHeight ? innerHeight : document.body.scrollTop + document.body.clientHeight) - 1;

/* if ((over_img.width && over_img.width > midX)
  || (over_img.height && over_img.height > height)) {
  var xr = midX / over_img.width;
  var yr = height / over_img.height;
  var r = (xr < yr) ? xr : yr;
  over_img.width *= r;
  over_img.height *= r;
 } */

 var offX = X - 25 - over_img.width;
 if ((X > midX) && (offX > 0)) X = offX;
 imageHover.style.left = '' + X + 'px';

 var imgHeight = over_img.height;
 if (Y + imgHeight > top + height) Y = top + height - imgHeight;
 if (Y < top) Y = top;
 imageHover.style.top = '' + Y + 'px';

 myalert('Y: '+Y+' e.pY: '+evt.pageY+' d.b.sT: '+document.body.scrollTop+' inH: '+innerHeight+' d.dE.sT: '+document.documentElement.scrollTop+' d.b.cH: '+document.body.clientHeight+' o.h: '+over_img.height);
}
