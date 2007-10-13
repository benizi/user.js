// ==UserScript==
// @name          Facebook layout discombobulator
// @namespace     http://www.benizi.com/greasemonkey
// @description   Makes Facebook wider
// @include       http://*.facebook.com/*
// @include       http://*.thefacebook.com/*
// ==/UserScript==
(function () {
   var addstyle='#book { width: 1550px; }\n\
#pageheader { width: 1300px; margin-left: 80px; }\n\
#gnav { line-height: 100%; }\n\
#sidebar, #qsearch, #qsearch input { width: 200px; }\n\
#snav a.edit { float: right; margin-top: -32px; }\n\
#snav li { width: 200px; }\n\
#pagebody { width: 1300px; }\n\
#profilenarrowcolumn { width: 400px; }\n\
.otherSchools, .otherGeos { width: 170px; }\n\
.rightColumn { width: 150px; }\n\
#profilepagewidecolumn { width: 850px; }\n';
   var style = document.createElement('style');
   style.setAttribute('type', 'text/css');
   style.innerHTML = addstyle;
   var head = document.getElementsByTagName('HEAD');
   head[0].appendChild(style);
   var br = document.evaluate('//div[@id="userprofile"]/BR', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < br.snapshotLength; i++)
      br.snapshotItem(i).parentNode.removeChild(br.snapshotItem(i));
   var hasedit = document.evaluate('//A[@class="hasedit"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
   for (var i = 0; i < hasedit.snapshotLength; i++)
      hasedit.snapshotItem(i).removeAttribute('class');
})();
