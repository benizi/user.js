// ==UserScript==
// @name          Wikipedia Cite
// @namespace     http://benizi.com/gm
// @description   Changes "citation needed" to "fuck citations!"
// @include       http://*wikipedia.org/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(function(){
 $('sup.noprint').each(function(){
  if ($(this).text() != '[' + $('a', this).text() + ']') return;
  $('a', this).each(function() {
   var rep = null;
   switch ($(this).text()) {
    case 'citation needed': rep = 'FUCK CITATIONS!'; break;
    case 'vague': rep = 'ambiguity is inevitable'; break;
   }
   if (rep) $(this).text(rep);
  });
 });
});
