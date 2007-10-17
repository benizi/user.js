// ==UserScript==
// @name          Track URLs
// @namespace     http://benizi.com/gm
// @description   Tracks everything I view
// @include       *
// ==/UserScript==

(function(){
 /* 8757 = 'URLS' on a touchtone keypad */
 var url = 'http://localhost:8757/'+encodeURIComponent(document.location)+'?'+encodeURIComponent(document.referrer);
 if ('title' in document) url += '?'+encodeURIComponent(document.title);
// alert(url);
 GM_xmlhttpRequest({
  url:url,
  method:"HEAD",
  onload:function(){},
 });
})();
