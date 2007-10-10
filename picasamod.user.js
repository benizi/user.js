// ==UserScript==
// @name          PicasaMod
// @namespace     http://benizi.com/gm
// @description   Adds a "View Original" link to /photo pages on Picasa
// @include       http://picasaweb.google.com/*/photo*
// ==/UserScript==

(function(){
 window.addEventListener('load',function () {
  var which = 'download';
  var newel = 'picasa_mod_el';
  var p;
  window.setInterval(function () {
   var el = document.getElementById(which);
   if (!el) return;
   var v = el.getAttribute('href');
   if (p && v == p) return;
   p = v;
   var nel = document.getElementById(newel);
   if (!nel) {
    nel = document.createElement('a');
    nel.style.display = 'block';
    nel.setAttribute('id',newel);
    nel.appendChild(document.createTextNode('View Original'));
    el.parentNode.insertBefore(nel, el);
   }
   nel.setAttribute('href', v.replace(/\?.*$/,''));
  }, 70);
 },false);
})();
