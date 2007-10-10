// ==UserScript==
// @name          ImageVenueGrabber
// @namespace     http://benizi.com/gm
// @description   Redirects from view.php? to image
// @include       *.imagevenue.com/view.php*
// ==/UserScript==

(function(){
 function doit () {
  var p = document.getElementById('thepic');
  if (!p) { window.setTimeout(doit,100); return; }
  var hr = p.getAttribute('src');
  var w = (hr.match(/http/)) ? 'href' : 'pathname';
  window.location[w] = hr;
 }
 window.addEventListener('load', doit, false);
// window.addEventListener('DOMContentLoaded', doit, false);
})();
