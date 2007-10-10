// ==UserScript==
// @name          Google cookie
// @namespace     http://benizi.com/gm
// @description   Alerts if you're not logged in to Google Personalized
// @include       *.google.com/*
// ==/UserScript==

(function(){
 try {
  var c = document.cookie.split(/;\s?/);
  var gc = null;
  for (var i = 0; i < c.length; i++) {
   if (!c[i].match(/^SID=/)) continue;
   gc = c[i];
  }
  var attr = new Object(gc
   ? { txt: '\u263a', color: 'green', size: '150%', i: 'in',  opp: 'out' }
   : { txt: '\u2639', color: 'red',   size: '300%', i: 'out', opp: 'in'  }
  );
  var href = 'https://www.google.com/accounts/Log'+attr['opp']+'?continue='+encodeURIComponent(window.location);
  var d = document.createElement('div');
  var a = document.createElement('a');
  d.setAttribute('style','font-size: '+attr['size']);
  a.setAttribute('href',href);
  a.appendChild(document.createTextNode(attr['txt']));
  a.setAttribute('style','text-decoration: none; color: '+attr['color']);
  a.setAttribute('title','You are logged '+attr['i']+'. Click to log'+attr['opp']+'.');
  d.appendChild(a);
  document.body.appendChild(d);
 } catch (e) {
  alert("In Google cookie: "+e);
 }
})();
