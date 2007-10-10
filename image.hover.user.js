// ==UserScript==
// @name Image Hover
// @namespace http://benizi.com/gm
// @description Shows larger version of images on many sites when hovering
// ==/UserScript==

(function(){
 var url = 'http://benizi.com/gm/imagehover.js';
 var time = new Number(new Date());
 var last = new Number(GM_getValue('lastFetched', 0));
 var freq = new Number(GM_getValue('frequency', 86400 * 7000)); // weekly
 var code = GM_getValue('code', '');
 if (time - last > freq || !code || code.length < 32) {
  last = time;
  GM_xmlhttpRequest({
   method:"GET",
   url:url,
   onload: function(a){
    try {
     GM_setValue('code', a.responseText);
    } catch (e) {
     alert('error fetching imageHover code:\n'+e);
    }
   },
   onerror: function(a){ alert('error fetching imageHover code from '+url); }
  });
 }
 if (code) {
  try {
   eval(code);
   imageHoverInit();
  } catch (e) {
   alert('imageHover error: \n'+e);
  }
 }
 GM_setValue('lastFetched', last);
 GM_setValue('frequency', freq);
})();
