// ==UserScript==
// @name          Rotten Tomatoes Fixer
// @namespace     http://benizi.com/gm
// @description   Fixes a problem on Rotten Tomatoes (text offscreen)
// @include       http://*.rottentomatoes.com/*
// @include       http://rottentomatoes.com/*
// ==/UserScript==

(function () {
 try {
  var d = document.getElementById('main_search_bar');
  for (var i = 0; i < d.childNodes.length; i++)
   if (d.childNodes[i].nodeName)
    if (d.childNodes[i].nodeName == 'DIV')
     d.childNodes[i].style.cssText = '';
 } catch (e) { alert("Rotten Tomatoes Fixer error:\n"+e); }
})();
