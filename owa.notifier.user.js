// ==UserScript==
// @name          Outlook Web Access Notifier
// @namespace     http://benizi.com/gm
// @description   Pop up notifications when the alert bar changes
// @include       http://*/owa/*
// @include       https://*/owa/*
// @require       http://benizi.com/base64.js
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

jQuery.noConflict();

(function ($){
   function monitorChanges(selector, frequency, callback, onlyonce) {
      var html = $(selector).html();
      var listener;
      listener = setInterval(function(){
         var newhtml = $(selector).html();
         if (newhtml == html) return;
         html = newhtml;
         callback();
         if (onlyonce) clearInterval(listener);
      }, frequency);
   }
   if (!window.webkitNotifications) return;
   if (window.webkitNotifications.checkPermission()) {
      $('<input type="button"/>')
      .value('Setup Notifications')
      .click(function(){
         window.webkitNotifications.requestPermission();
         $(this).remove();
      });
   }
   var notification = null;
   monitorChanges('#divAlertBar', 1000, function(){
      if (notification) return;
      var page = $('<div></div>');
      var logo = $('#imgLiveLogo');
      var src = logo.attr('src');
      var css = {
         backgroundPosition: logo.css('backgroundPosition'),
         backgroundImage: logo.css('backgroundImage'),
         height: logo.css('height'),
         width: logo.css('width')
      };
      var img = $('<img/>').attr({src:src,border:0}).css(css);
      page.append(img);
      var messages = $('.divNotificationsColumn1');
      if (!messages.length) return;
      messages.each(function(){
         var div = $('<div></div>').appendTo(page);
         $('div', this).each(function(){
            div.append($('<div></div>').text($(this).text()));
         });
         $('div:first', div).css({fontWeight:'bold'});
      });
      var url = 'data:text/html;base64,'+encode_base64('<div>'+page.html()+'</div>');
      notification = window.webkitNotifications.createHTMLNotification(url);
      notification.onclose = function () { notification = null; };
      notification.show();
   });
})(jQuery);
