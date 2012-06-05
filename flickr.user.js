// ==UserScript==
// @name Flickr Defuckruppr
// @namespace http://gm.benizi.com/flickr/
// @description Allow downloading when it's been "prevented"
// @match http://www.flickr.com/photos/*/sizes/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

;(function($){
  $(function(){

    function clickLargest() {
      var href = $('.sizes-list li:contains(x):last a').attr('href');
      console.log(href ? 'Going to: ' + href : 'No bigger size found');
      if (href) window.location = href;
    }

    function preventPreventing() {
      $('.spaceball').remove();
    }

    function squishHeader() {
      $('#head, #head-status, #head-top, #head-nav-bar').css({float:'left',clear:'none',minWidth:0});
      $('#head-top').css('width', $('#head-status').width());
      $('#head-logo').remove();
      //$('#main h1:first, #all-sizes-header').addClass('hidden-by-benizi').hide();
      $('#allsizes-photo').prependTo('#main');
    }

    function clickToDownload() {
      var img = $('#allsizes-photo img').first();
      var href = img.attr('src');
      img.wrap($('<a></a>').attr('href',href));
    }

    clickLargest();
    preventPreventing();
    squishHeader();
    clickToDownload();
  });
})(jQuery);
