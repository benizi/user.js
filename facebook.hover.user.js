// ==UserScript==
// @name Facebook IMG Hover
// @namespace http://benizi.com/gm
// @description For small/tiny images on Facebook.com, hovers the larger img.
// ==/UserScript==

(function(){
 var url = 'http://localhost/imagehover.js';
 /*for (var i = 0; i < urls.length; i++) {
  var url = host + urls[i];*/
  GM_xmlhttpRequest({
   method:"GET",
   url:url,
   onload: function(a){
    try {
     eval(a.responseText);
     imageHoverInit();
    } catch (e) {
     alert('error in eval:\n'+e);
    }
   },
   onerror: function(a){ alert('error getting '+url); }
  });
/* }*/
})();
