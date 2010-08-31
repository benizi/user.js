// ==UserScript==
// @name          Wikipedia Cite
// @namespace     http://benizi.com/gm
// @description   Changes "citation needed" to "fuck citations!"
// @include       http://*wikipedia.org/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

$(function(){
 $('a:contains(citation needed)').text('FUCK CITATIONS!');
});
