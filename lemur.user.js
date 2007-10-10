// ==UserScript==
// @name          11-741-homework-1
// @namespace     http://benizi.com/gm
// @description   Adds things to the Lemur GUI for convenience
// @include       http://education.lemurproject.org/search/*
// == testing ==
// @include       http://*localhost*lemur*
// ==/UserScript==
// debugging info : line 234 = 507, so subtract 373

(function(){
var queries = new Array(2,9,22,39,56,59,63,64,71,78,94,98,103,116,502,506,508,513,516,519,522,524,529,531,533,534,535,540,541,544);
var uniqueWords = new Object({
'hunt':'2', 'library':'2', 'memorial':'2', 
'kenneth':'9', 'mcgirr':'9', 
'applied':'22', 'at':'22', 'engineering':'22', 'george':'22', 'science':'22', 'u':'22', 'washington':'22', 
'club':'39', 'clubs':'39', 'dog':'39', 'zone\'':'39', 'zone\'s':'39', 
'cnet':'56', 
'classified':'59', 'classifieds':'59', 'free':'59', 'usa':'59', 
'canada':'63', 'connaught':'63', 'pasteur':'63', 
'eagle\'':'64', 'eagle\'s':'64', 'web':'64', 
'ntr.net':'71', 
'platteville':'78', 'wisconsin':'78', 
'estate':'94', 'napier':'94', 'real':'94', 'richmond':'94', 'va':'94', 
'scarborough':'98', 'toronto':'98', 
'java':'103', 'tutorial':'103', 
'intuit':'116', 
'define':'502', 'defining':'502', 'expression':'502', 'expressions':'502', 'factor':'502', 'factors':'502', 'mathematical':'502', 'number':'502', 'numbers':'502', 'prime':'502', 'them':'502', 'without':'502', 
'about':'506', 'be':'506', 'came':'506', 'danger':'506', 'dangers':'506', 'done':'506', 'first':'506', 'harm':'506', 'originated':'506', 'skateboarding':'506', 
'as':'508', 'caused':'508', 'connect':'508', 'connects':'508', 'context':'508', 'disease':'508', 'diseases':'508', 'drug':'508', 'facial':'508', 'hair':'508', 'hair los':'508', 'hair loss':'508', 'head':'508', 'humans':'508', 'if':'508', 'irrelevant':'508', 'los':'508', 'loss':'508', 'positively':'508', 'specific':'508', 'symptom':'508', 'synonymou':'508', 'synonymous':'508', 'therapy':'508', 'thi':'508', 'thinning hair':'508', 'this':'508', 'with':'508', 
'activity':'513', 'area':'513', 'areas':'513', 'causes':'513', 'do':'513', 'earthquake':'513', 'earthquakes':'513', 'frequently':'513', 'geographic':'513', 'most':'513', 'occur':'513', 'occurs':'513', 'often':'513', 'scientific':'513', 'they':'513', 'tremor':'513', 'tremors':'513', 
'custom':'516', 'customs':'516', 'day':'516', 'did':'516', 'evolve':'516', 'halloween':'516', 'modern':'516', 'origin':'516', 'original':'516', 'trick-or-treating':'516', 
'diet':'519', 'frog':'519', 'frog\'':'519', 'frog\'s':'519', 'frogs':'519', 'habitat':'519', 'info':'519', 'live':'519', 'natural':'519', 
'being':'522', 'desert':'522', 'mojave':'522', 'region':'522', 'supplied':'522', 'water':'522', 'way':'522', 'ways':'522', 
'defect':'524', 'defects':'524', 'disclose':'524', 'erase':'524', 'insufficient':'524', 'mere':'524', 'name':'524', 'procedure':'524', 'reference':'524', 'references':'524', 'removal':'524', 'remove':'524', 'scar':'524', 'skin':'524', 
'surgical removal':'524', 'tissue':'524', 
'account':'529', 'accounts':'529', 'cambodia':'529', 'historical':'529', 'information':'529', 
'explicit':'531', 'grammatical':'531', 'guidance':'531', 'proper':'531', 'versu':'531', 'versus':'531', 'whom':'531', 
'advertisement':'533', 'advertisements':'533', 'against':'533', 'an':'533', 'argument':'533', 'children':'533', 'con':'533', 'contain':'533', 'district':'533', 'districts':'533', 'either':'533', 'pro':'533', 'public':'533', 'regarding':'533', 'require':'533', 'requiring':'533', 'school':'533', 'schools':'533', 'simple':'533', 'statement':'533', 'statements':'533', 'student':'533', 'students':'533', 'uniform':'533', 'uniforms':'533', 'wear':'533', 'wearing':'533', 
'1700\'':'534', '1700\'s':'534', 'artist':'534', 'artist\'':'534', 'artist\'s':'534', 'artists':'534', 'date':'534', 'death':'534', 'died':'534', 'include':'534', 'item':'534', 'items':'534', 'referencing':'534', 
'building':'535', 'canadian':'535', 'code':'535', 'codes':'535', 'construction':'535', 'describing':'535', 'including':'535', 'pertaining':'535', 'regulation':'535', 'regulations':'535', 'road':'535', 
'between':'540', 'correlate':'540', 'description':'540', 'descriptions':'540', 'doe':'540', 'does':'540', 'obesity':'540', 'relationship':'540', 'stres':'540', 'stress':'540', 'studie':'540', 'studies':'540', 
'forecast':'541', 'forecasts':'541', 'instruments':'541', 'state':'541', 'themselve':'541', 'themselves':'541', 'weather':'541', 
'absence':'544', 'benefit':'544', 'benefits':'544', 'discussion':'544', 'discussions':'544', 'effect':'544', 'effects':'544', 'estrogen':'544', 'estrogen\'':'544', 'estrogen\'s':'544', 'general':'544', 'hormone':'544', 'hormones':'544', 'its':'544', 'needed':'544', 'negative':'544', 'play':'544', 'plays':'544', 'positive':'544', 'presence':'544', 'role':'544', 'roles':'544', 'why':'544'
});
 function _getQuery() {
  var forms = document.getElementsByTagName('form');
  for (var i = 0; i < forms.length; i++)
   for (var j = 0; j < forms[i].childNodes.length; j++)
    if (forms[i].childNodes[j].getAttribute
     && forms[i].childNodes[j].getAttribute('name') == 'q')
     return forms[i].childNodes[j].value;
  return null;
 }
 function _guessQuery() {
  var q = _getQuery();
  if (q)
   for (var k in uniqueWords)
    if (q.toLowerCase().match('\\b'+k.toLowerCase()+'\\b'))
     return uniqueWords[k];
  return _pref('query');
 }
 function _get(id) {
  var el = document.getElementById(id);
  return el ? el.value : _pref(id);
 }
 var _defaults = {
  Ndocs: 10,
  query: 'testQuery',
  runID: 'testRun',
  andrewid: 'andrewID',
  logtype: ''
 };
 function _pref (name, value) {
  if (value != undefined) {
   return GM_setValue(""+name, ""+value);
  } else {
   return GM_getValue(""+name, ""+_defaults[name]);
  }
 }
 function _setAll () { for (var k in _defaults) _pref(k, _get(k)); }
 function TRECyURL (N,terse) {
  var prep = '?n='+N+'&list=e&';
  if (terse) prep += 'g=d&';
  var loc = new String(window.location);
  loc = loc.replace('?',prep);
  return loc;
 }
 function mylisten (obj, which, handler) {
  if (obj.addEventListener) return obj.addEventListener(which, handler, false);
  if (obj.attachEvent) return obj.attachEvent('on'+which, handler);
  obj['on'+which] = handler;
 }
 var inited = false;
 function _init () {
  if (inited) return;
  inited = true;
  if (new String(window.location).match(/&g=d&/)) return;
  try { add_buttons(); } catch (e) { alert("Adding buttons:\n"+e); }
 }
 function createEl (tag, att, styl) {
  var r = document.createElement(tag);
  if (att) for (var k in att) r.setAttribute(k, att[k]);
  if (styl) for (var k in styl) r.style[k] = styl[k];
  return r;
 }
 function createIn (typ, att, styl) {
  att['type'] = typ;
  return createEl('input', att, styl);
 }
 function initialize (el, id) {
  el.setAttribute('id',id);
  el.setAttribute('name',id);
  el.setAttribute('value',_pref(id));
 }
 function addText (el, txt) { el.appendChild(document.createTextNode(txt)); }
 function addOption (sel, val, txt) {
  var opt = createEl('option', {value:val});
  addText(opt, txt);
  sel.appendChild(opt);
 }
 function add_buttons () {
  if (!document.createElement) return;
  var outerFrame = createEl('div', {id:'lemurOuterFrame'},
   { border:'1px dotted #00f', position:'fixed', bottom:'0px', right:'0px',
     fontSize:'10pt', background:'#fff', color:'#000' });

  var sty = createEl('style', { type: 'text/css' });
  addText(sty, '.hidden { display: none; }\n.block { display: block !important; }');

  var minimize = createEl('a', {id:'mini',href:'#'});
  addText(minimize,'>>');

  mylisten(minimize, 'click', function () {
   var cn = frame.getAttribute('class');
   var lab;
   if (cn == 'hidden') {
    cn = '';
	lab = '>>';
   } else {
    cn = 'hidden';
	lab = '<<';
   }
   frame.setAttribute('class',cn);
   minimize.replaceChild(document.createTextNode(lab),minimize.firstChild);
  });
  outerFrame.appendChild(minimize);
  addText(outerFrame,' ');

  var frame = createEl('span', {id:'lemurHelperFrame'});

  var andrew = createIn('text', { size:14 });
  initialize(andrew,'andrewid');
  frame.appendChild(andrew);
  addText(frame, '@andrew');

  var ndoc = createIn('text', { size:4 });
  initialize(ndoc,'Ndocs');
  addText(frame, ' Ndocs:');
  frame.appendChild(ndoc);
  var forms = document.getElementsByTagName('form');
  if (forms.length) {
   var nParam = createIn('hidden', { name: 'n', value: _pref('Ndocs') });
   forms[0].insertBefore(nParam, forms[0].firstChild);
  }

  var qname = createEl('select');
  addOption(qname, 'full', 'All');
  for (var i = 0; i < queries.length; i++)
   addOption(qname,queries[i],""+queries[i]);
  initialize(qname,'query');
  var guessQ = _guessQuery();
  if (guessQ) {
   qname.value = guessQ;
   _defaults['query'] = guessQ;
   _pref('query', guessQ);
  }
  addText(frame, ' query:');
  frame.appendChild(qname);

  var logtype = createEl('select');
  addOption(logtype, '', 'Summary');
  addOption(logtype, '-q', 'Detailed');
  initialize(logtype, 'logtype');
  addText(frame, ' Log:');
  frame.appendChild(logtype);

  var runID = createIn('text', { size:10 });
  initialize(runID, 'runID');
  addText(frame, ' runID:');
  frame.appendChild(runID);

  var com_button = createIn('button', { value:'inline' });
  mylisten(com_button, 'click', function () { _setAll(); _in_place() });
  frame.appendChild(com_button);

  var sub_button = createIn('button', { value:'trec_eval' });
  mylisten(sub_button, 'click', function () { _setAll(); _trec_eval(true) });
  frame.appendChild(sub_button);

  outerFrame.appendChild(frame);
  document.body.appendChild(outerFrame);
  document.getElementsByTagName('head').item(0).appendChild(sty);
 }
 function _pop (url) {
  var win = window.open(url,'','');
  if (window.focus) win.focus();
  return false;
 }
 function _pop_TREC () { _pop(TRECyURL(_pref('Ndocs'),true)); }
 function buildForm (inputs,boundary) {
  var cr = '\r\n';
  var txt = '';
  for (var i = 0; i < inputs.length; i++) {
   var inp = inputs[i];
   txt += '--'+boundary+cr;
   txt += 'Content-Disposition: form-data; name="'+inp['name']+'"';
   if (inp['type'] == 'file') txt += '; filename="trec_eval"';
   txt += cr;
   if (inp['type'] == 'file') txt += 'Content-Type: application/octet-stream'+cr;
   txt += cr;
   var val = ""+inp['value'];
   val = val.replace(/([^\r])\n/g,'$1\r\n');
   txt += inp['value']+cr;
  }
  txt += '--'+boundary+'--'+cr;
  return txt;
 }
 function prefObj (id,type,value) {
  this.name = id;
  this.value = value ? value : _pref(id);
  this.type = type ? type : 'text';
 }
 function _trec_text_info () {
  var qn = document.getElementById('query');
  qn = qn.value;
  var txt = '';
  var qu = _getQuery();
  if (qu) txt = '#\t'+qn+'\t'+qu+'\n';
  var f = document.getElementsByTagName('font');
  var c = 0;
  var maxW = 0;
  for (var i = 0; i < f.length; i++) {
   var m = f[i].innerHTML.match(/DocID:\s+(\S+)\s+-\s+Score:\s+([-.0-9]+)/);
   if (!m) continue;
   var tx = new Array(_pref('query'), 'Q0', m[1], ++c, m[2], _pref('runID'));
   var len = 0;
   for (var j = 0; j < tx.length; j++)
    len += (j ? (8 - (len % 8)) : 0) + new String(""+tx[j]).length;
   if (len > maxW) maxW = len;
   txt += tx.join('\t') + '\n';
   if (c >= _pref('Ndocs')) break;
  }
  return new Array(txt,maxW+1,c+2);
 }
 function _trec_text () {
  var arr = _trec_text_info();
  return arr[0];
 }
 function _te_form_data (bnd) {
  var arr = new Array(new prefObj('andrewid'), new prefObj('query'), new prefObj('logtype'), new prefObj('infile','file',_trec_text()));
  return buildForm(arr,bnd);
 }
 function _trec_eval (pop) {
  var boundary = 'BoUnDaRy-GiBbErRiSh';
  var data = _te_form_data(boundary);
  var callback;
  if (!pop) {
   callback = function (req) {
    if (req.status != 200 && req.status != 0) return;
	var txt = req.responseText;
	var area = document.getElementById('evalResults');
	if (!area) {
     area = createEl('textarea', {id:'evalResults',cols:80,rows:30});
     addText(area, txt);
     var ol = document.getElementsByTagName('ol');
     ol[0].parentNode.insertBefore(area,ol[0]);
    } else {
     area.replaceChild(document.createTextNode(txt),area.firstChild);
    }
    area.select();
   };
  } else {
   callback = function (req) {
    if (req.status != 200 && req.status != 0) return;
    var txt = req.responseText;
    var newwin = window.open('');
    newwin.document.getElementsByTagName('html').item(0).innerHTML = txt;
   };
  }
  GM_xmlhttpRequest(
   new Object({
    method:'POST',
    url:'http://nyc.lti.cs.cmu.edu/classes/11-741/HW/HW1/upload.cgi',
    headers:{'Content-Type': 'multipart/form-data; boundary='+boundary},
    data:data,
    onload:callback
   })
  );
 }
 function _in_place () {
  var area = document.getElementById('inlined');
  var texArr = _trec_text_info();
  if (area) {
   while (area.childNodes.length > 0) area.removeChild(area.lastChild);
   area.setAttribute('cols',texArr[1]);
   area.setAttribute('rows',texArr[2]);
   addText(area, texArr[0]);
  } else {
   area = createEl('textarea', {id:'inlined',cols:texArr[1],rows:texArr[2]});
   addText(area, texArr[0]);
   var ol = document.getElementsByTagName('ol');
   ol[0].parentNode.insertBefore(area,ol[0]);
  }
  area.focus();
  area.select();
 }
 mylisten(window, 'DOMContentLoaded', _init);
 mylisten(window, 'load', _init);
})();
