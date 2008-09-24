var find = [
 ['thepic'],
 ['thepic'],
 ['subject'],
 ['image',/hq-celebrity/],
 ['fullImage',/dirtyrotten/],
 ['img_obj',/ns4w/],
 ['img_obj',/3ne/]
];
for (var i = 0; i < find.length; i++) {
 var info = find[i];
 var url = (info.length > 1) ? info[1] : undefined;
 if (url) if (!window.location.href.match(url)) continue;
 var thepic = document.getElementById(info[0]);
 if (thepic) {
  var loc = thepic.getAttribute('src');
  if (!loc.match(/^http/)) {
   var slash = loc.match(/^\//) ? '' : '/';
   loc = window.location.href.replace(/^(\w+:\/\/[^?]+\/).*$/, '$1') + slash + loc;
   loc = loc.replace(/([^:]\/)\//, '$1');
  }
  window.location = loc;
  return;
 }
}