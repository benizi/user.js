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

function monitorChanges(selector, frequency, callback, onlyonce) {
   var html = jQuery(selector).html();
   var listener;
   listener = setInterval(function(){
      var newhtml = jQuery(selector).html();
      if (newhtml == html) return;
      html = newhtml;
      callback();
      if (onlyonce) clearInterval(listener);
   }, frequency);
}

(function (){
   if (!window.webkitNotifications) return;
   if (window.webkitNotifications.checkPermission()) {
      jQuery('<input type="button"/>')
      .value('Setup Notifications')
      .click(function(){
         window.webkitNotifications.requestPermission();
         jQuery(this).remove();
      });
   }
   var notification = null;
   monitorChanges('#divAlertBar', 1000, function(){
      if (notification) return;
      var page = jQuery('<div></div>');
      var logo = jQuery('#imgLiveLogo');
      var src = logo.attr('src');
      var css = {
         backgroundPosition: logo.css('backgroundPosition'),
         backgroundImage: logo.css('backgroundImage'),
         height: logo.css('height'),
         width: logo.css('width')
      };
      var img = jQuery('<img/>').attr({src:src,border:0}).css(css);
      page.append(img);
      var messages = jQuery('.divNotificationsColumn1');
      if (!messages.length) return;
      messages.each(function(){
         var div = jQuery('<div></div>').appendTo(page);
         jQuery('div', this).each(function(){
            div.append(jQuery('<div></div>').text(jQuery(this).text()));
         });
         jQuery('div:first', div).css({fontWeight:'bold'});
      });
      var url = 'data:text/html;base64,'+encode_base64('<div>'+page.html()+'</div>');
      notification = window.webkitNotifications.createHTMLNotification(url);
      notification.onclose = function () { notification = null; };
      notification.show();
   });
})();
