// ==UserScript==
// @name orbitz
// @namespace http://benizi.com/gm
// @description orbitz
// @include *ViewFlightSearchResults*
// @include *ViewAnchoredLFSSearchResults*
// @include *PrepareUnanchorAllSlices*
// ==/UserScript==

(function(){
 var monthConvert = new Object({Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12'});
 var allFlights = new Array();
 var orbitzGMDebug = false;
 var labelGlobal = 0;
 var dta = document.createElement('div');
 dta.setAttribute('id','orbitzDiv');
 var toggles = new Object();
 function createToggle (name,cls,init) {
  var sty = document.createElement('style');
  sty.setAttribute('type','text/css');
  document.getElementsByTagName('head').item(0).appendChild(sty);
  var tog = new Object({vis:init,cls:cls,sty:sty});
  toggles[name] = tog;
  setToggle(name,init);
 }
 function setToggle (name, vis) {
  var tog = toggles[name];
  var sty = tog['sty'];
  toggles[name]['vis'] = vis;
  while (sty.childNodes.length) sty.removeChild(sty.firstChild);
  if (vis) {
  } else {
   sty.appendChild(document.createTextNode("."+tog['cls']+" { display: none; }\n"));
  }
 }
 function doToggle (name) {
  setToggle(name, toggles[name]['vis'] ? false : true);
 }
 createToggle('PathInner','orbitzPathInner',false);
 createToggle('Pathlen','orbitzPathlen',true);
 if (orbitzGMDebug) {
  var fta = document.createElement('form');
  var ta = document.createElement('textarea');
  ta.setAttribute('id','orbitz_debug');
  ta.setAttribute('rows','15');
  ta.setAttribute('cols','50');
  fta.appendChild(ta);
  dta.appendChild(fta);
 }
 dta.style.position = 'absolute';
 dta.style.top = '0px';
 dta.style.right = '0px';
 dta.style.backgroundColor = 'white';
 dta.style.fontFamily = 'monospace';
 dta.style.textAlign = 'right';
 dta.addEventListener('contextmenu', function (e) {
  e.stopPropagation();
  return false;
 }, false);
 document.getElementsByTagName('body').item(0).appendChild(dta);
 var sty = document.createElement('style');
 sty.setAttribute('type','text/css');
 for (var i = 0; i < 6; i++)
  sty.appendChild(document.createTextNode(".orbitzSlice"+i+" { display: inline; }\n"));
 sty.appendChild(document.createTextNode(".orbitzPrice { }\n"));
 sty.appendChild(document.createTextNode(".orbitzDate { color: red; }\n"));
 sty.appendChild(document.createTextNode(".orbitzPath { color: #b90; }\n"));
 sty.appendChild(document.createTextNode(".orbitzStart { border-bottom: 1px dotted #0f0; }\n"));
 sty.appendChild(document.createTextNode(".orbitzEnd { border-bottom: 1px dotted #f00; }\n"));
 sty.appendChild(document.createTextNode(".orbitzMsg { border: 1px dotted #000; }\n"));
 sty.appendChild(document.createTextNode("#orbitzDiv * { font-family: monospace; }\n"));
 sty.appendChild(document.createTextNode("acronym { border: none; text-decoration: none; }\n"));
 document.getElementsByTagName('head').item(0).appendChild(sty);
 function createLabel() {
  var newl = "orbitz_target_"+labelGlobal;
  labelGlobal++;
  return newl;
 }
 function parseResult(result) {
  var label = createLabel();
  var aTarg = document.createElement('a');
  aTarg.setAttribute('name',label);
  result.insertBefore(aTarg,result.firstChild);
  try {
   var price = document.evaluate('.//*[@class="totalPrice"]', result, null, XPathResult.STRING_TYPE, null).stringValue.replace('$','').replace(',','');
  } catch (e) {
   alert("getting price: "+e);
  }
  try {
   var slicex = document.evaluate('.//*[@class="resultSlice"]/div/..', result, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  } catch (e) {
   alert("getting slices: "+e);
  }
  var slices = new Array();
  for (var i = 0; i < slicex.snapshotLength; i++)
   slices.push(parseSlice(slicex.snapshotItem(i)));
  var msg = new Array();
  var seats = document.evaluate('.//*[@class="seatAvailabilityMsg"]//*[@class="lowestCount"]', result, null, XPathResult.STRING_TYPE, null).stringValue;
  if (seats.length) msg.push(" "+seats+" ");
  var ret = new Object({label:label,price:price,slices:slices,msgs:msg});
//  addResult(ret);
  return ret;
 }
 function divResult(result) {
  var price = result['price'];
  var slices = result['slices'];
  var div = document.createElement('div');
  div.setAttribute('class','orbitzChartRow');
  div.appendChild(document.createTextNode("$"));
  div.appendChild(spanClass(price,'orbitzPrice'));
  div.appendChild(document.createTextNode(" "));
  for (var i = 0; i < slices.length; i++) {
   if (i) div.appendChild(document.createTextNode(" "));
   var sl = divSlice(slices[i]);
   sl.setAttribute('class', sl.getAttribute('class')+i);
   div.appendChild(sl);
  }
  var aLink = document.createElement('a');
  aLink.setAttribute('href','#'+result['label']);
  aLink.appendChild(document.createTextNode('[<-]'));
  div.insertBefore(aLink, div.firstChild);
  for (var i = 0; i < result['msgs'].length; i++)
   div.insertBefore(spanClass(result['msgs'][i], 'orbitzMsg'), div.firstChild);
  return div;
 }
 function addResult(result) {
  dta.appendChild(divResult(result));
 }
 function airCode (ac) {
//  var acr = document.createElement('acronym');
  var sp = document.createElement('acronym');
  sp.appendChild(document.createTextNode(ac.childNodes[1].innerHTML));
  var txt = new String(ac.previousSibling.data).replace(/^\s+/,'').replace(/\s+$/,'');
  sp.setAttribute('title', txt);
  return sp;
 }
 function parseSlice (sli) {
  var legs = document.evaluate('.//*[@class="resultLeg"]', sli, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  try {
   var stime = document.evaluate('(.//*[@class="col2"]//dd)[1]', sli, null, XPathResult.STRING_TYPE, null).stringValue;
   var etime = document.evaluate('(.//*[@class="col2"]//dd)[last()]', sli, null, XPathResult.STRING_TYPE, null).stringValue;
  } catch (e) {
   alert("stime etime:\n"+e);
  }
  var dest_strs = new Array();
  for (var i = 0; i < legs.snapshotLength; i++) {
   var leg = legs.snapshotItem(i);
   try {
    var dat = document.evaluate('.//*[@class="col2"]/*[@class="legTitle"]', sli, null, XPathResult.STRING_TYPE, null).stringValue;
   } catch (e) {
    alert("legTitle:\n" + e);
   }
   var acs = document.evaluate('.//*[@class="airCode"]', leg, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var j = 0; j < acs.snapshotLength; j++) {
    var ac = airCode(acs.snapshotItem(j));
    // if (ac == dest_strs[dest_strs.length-1]) continue; // CHANGE
    if (dest_strs.length) if (ac.innerHTML == dest_strs[dest_strs.length-1].innerHTML) continue; // CHANGE
    dest_strs.push(ac);
   }
  }
  var tim = new Array(stime,etime);
  for (var i = 0; i < tim.length; i++) {
   var t = new String(tim[i]);
   if (t.match(/am/)) {
   //replace('am','')) {
    t = t.replace('am','').replace(/^(\d):/,'0$1:');
   } else if (t.match(/pm/)) {
    t = t.replace('pm','');
    var m = t.match(/^(\d+):/);
    if (m) {
     var hr = new Number(m[m.length-1]);
     if (hr != 12) hr += 12;
     t = t.replace(/(\d+):/,""+hr+":");
    }
   }
   tim[i] = t;
  }
  dat = dat.replace(/^Thu,/,'R').replace(/^(S[au]).,/,'$1').replace(/^([MTWF])..,/,'$1');
  var m = dat.match(/\s(\w\w\w)\s/);
  if (m) dat = dat.replace(m[m.length-1]+" ",monthConvert[m[m.length-1]]+"/");
  dat = dat.replace(/(\s\d\d\/)(\d)$/, '$1'+'0$2');
//  HEREHERE
  var ret = new Object({date:dat,path:dest_strs,pathlen:dest_strs.length-2,start:tim[0],end:tim[1]});
  //addSlice(ret);
  return ret;
 }
 function spanClass(txt,cls) {
  var sp = document.createElement('span');
  sp.setAttribute('class',cls);
  sp.appendChild(document.createTextNode(txt));
  return sp;
 }
 function divSlice(sl) {
  var sp = document.createElement('div');
  sp.setAttribute('class','orbitzSlice');
  sp.appendChild(spanClass(sl['date'],'orbitzDate'));
  sp.appendChild(document.createTextNode(" "));
  var pa = spanClass('','orbitzPath');
  var pai = null;
  var inn = false;
  var p = sl['path'];
  for (var i = 0; i < p.length; i++) {
   var toapp;
   if (i != p.length - 1) {
    if (!pai) {
      pai = spanClass('','orbitzPathInner');
      pa.appendChild(spanClass(sl['pathlen'],'orbitzPathlen'));
    }
    toapp = pai;
   } else {
    toapp = pa;
   }
   if (i) toapp.appendChild(document.createTextNode("-"));
   toapp.appendChild(sl['path'][i]);
  }
  if (pai) pa.insertBefore(pai,pa.firstChild);
  sp.appendChild(pa);
  sp.appendChild(document.createTextNode(" "));
  sp.appendChild(spanClass(sl['start'],'orbitzStart'));
  sp.appendChild(document.createTextNode(" "));
  sp.appendChild(spanClass(sl['end'],'orbitzEnd'));
  return sp;
 }
 function addSlice(sl) {
  dta.appendChild(spanSlice(sl));
 }
 function createChart () {
  try {
   var results = document.evaluate('//*[@class="result"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  } catch (e) {
   alert("While finding results:\n"+e);
  }
  var minPrice = 100000;
  var hardLimit = 100000;
  for (var i = 0; i < results.snapshotLength; i++) {
   var s = results.snapshotItem(i);
   if (s['price'] < minPrice) {
    minPrice = s['price'];
    hardLimit = minPrice * 1.4;
    if (hardLimit - minPrice < 350) hardLimit = minPrice + 350;
   }
   if (s['price'] > hardLimit) continue;
   allFlights.push(parseResult(s));
  }
 }
 createChart();
 var maxPrice = 0;
 function pricePasses (fl) {
  if (!maxPrice) return true;
  return (fl['price'] > maxPrice) ? false : true;
 }
 function passesFilters (fl) {
  if (!pricePasses(fl)) return false;
  for (var i = 0; i < filterFuncs.length; i++)
   if (!filterFuncs[i](fl))
    return false;
  return true;
 }
 function clickPrice () {
  if (this.getAttribute('class') != 'orbitzPrice') return;
  var pri = this.innerHTML;
  maxPrice = new Number(pri);
  redrawChart();
 }
 var sortFuncs = new Array();
 var filterFuncs = new Array();
 var rFuncs = new Array();
 function rFunc (txt, fn) {
  var rst = document.createElement('span');
  rst.appendChild(document.createTextNode('Reset '+txt));
  rst.addEventListener('click', fn, false);
  return rst;
 }
 rFuncs.push(rFunc('Sort', function () {
  sortFuncs = new Array();
  sortFlights();
 }));
 rFuncs.push(rFunc('Filter', function () {
  filterFuncs = new Array();
  redrawChart();
 }));
 rFuncs.push(rFunc('Max$', function () {
  maxPrice = 0;
  redrawChart();
 }));
 var reset = document.createElement('div');
 for (var i = 0; i < rFuncs.length; i++) {
  if (i) reset.appendChild(document.createTextNode(' | '));
  reset.appendChild(rFuncs[i]);
 }
 dta.insertBefore(reset,dta.firstChild);
 function clickSortFilter (e) {
  var tc = this.getAttribute('class');
  var ar = new Array();
  for (var p = this.parentNode; p; p = p.parentNode) {
   if (p.getAttribute('id') == 'orbitzDiv') break;
   var pc = p.getAttribute('class');
   var m;
   m = pc.match(/Slice(\d+)$/);
   if (!m) continue;
   ar.push('slices');
   ar.push(m[m.length-1]);
  }
  ar.push(tc.replace('orbitz','').toLowerCase());
  if (!e.button) {
   sortFuncs.push(sortFunc(ar));
   sortFlights();
  } else {
   filterFuncs.push(filterFunc(ar,this));
   redrawChart();
  }
 }
 function filterFunc(ar,el) {
  var val = document.evaluate('.', el, null, XPathResult.STRING_TYPE, null).stringValue;
  return function (l) {
   var ev = l;
   for (var i = 0; i < ar.length; i++)
    ev = ev[ar[i]];
   return (ev == val) ? true : false;
  };
 }
 function sortFunc (ar) {
  return function (a,b) {
   var v = new Array(a,b);
   for (var i = 0; i < ar.length; i++)
    for (var j = 0; j < v.length; j++)
	 v[j] = v[j][ar[i]];
   if (v[0] == v[1]) return 0;
   return (v[0] < v[1]) ? -1 : 1;
  };
 }
 function sortFlights() {
  if (!sortFuncs.length)
   allFlights.sort(function (a,b) {
    var aa = a['label'];
	var bb = b['label'];
	return (aa < bb) ? -1 : (aa > bb) ? 1 : 0;
   });
  else
   allFlights.sort(function (a,b) {
    for (var i = 0; i < sortFuncs.length; i++) {
     var v = sortFuncs[i](a,b);
     if (v) return v;
    }
    return 0;
   });
  redrawChart();
 }
 function aLTC (cls, ev, fn) { addListenersToClass('orbitz'+cls,ev,fn); }
 function addListenersToClass (cls, ev, fn) {
  addListenersTo('//*[@class="'+cls+'"]',ev,fn);
 }
 function addListenersTo (xpath, ev, fn) {
  try {
   var el = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  } catch (e) {
   alert("while adding listeners to:\n"+xpath+"\n"+e);
  }
  if (typeof(ev) == 'string') { var nev = new Object(); nev[ev]=0; ev=nev; }
  for (var i = 0; i < el.snapshotLength; i++)
   for (var e in ev)
    el.snapshotItem(i).addEventListener(e, fn, false);
 }
 function redrawChart () {
  var toDel = document.evaluate('//*[@class="orbitzChartRow"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < toDel.snapshotLength; i++)
   dta.removeChild(toDel.snapshotItem(i));
  for (var i = 0; i < allFlights.length; i++)
   if (passesFilters(allFlights[i]))
    addResult(allFlights[i]);
  aLTC('Path','click',function(){doToggle('PathInner');doToggle('Pathlen')});
  var ev = {click:0,contextmenu:0};
  aLTC('Price',ev,clickPrice);
  aLTC('Start',ev,clickSortFilter);
  aLTC('End',ev,clickSortFilter);
  aLTC('Date',ev,clickSortFilter);
  aLTC('Pathlen',ev,clickSortFilter);
 }
 redrawChart();
})();
