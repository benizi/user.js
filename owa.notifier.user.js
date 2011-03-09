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
   var testing = true;
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
   var onChangeFunction = function(){
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
      var messages = $('.divNotificationsItem');
      if (!messages.length) return;
      var anyCurrent = false;
      messages.each(function(){
         if ($(this).css('display') == 'none') return;
         anyCurrent = true;
         var div = $('<div></div>').appendTo(page);
         $('.divNotificationsColumn1 div', this).each(function(){
            div.append($('<div></div>').text($(this).text()));
         });
         $('div:first', div).css({fontWeight:'bold'});
         var when = [];
         $('.divNotificationsColumn2, .divNotificationsColumn3', this).each(function(){
            when.unshift($(this).text());
         });
         div.append($('<div></div>').text(when.join(' ')));
      });
      if (!anyCurrent) return;
      var url = 'data:text/html;base64,'+encode_base64('<div>'+page.html()+'</div>');
      notification = window.webkitNotifications.createHTMLNotification(url);
      notification.onclose = function () { notification = null; };
      notification.show();
   };
   monitorChanges('#divAlertBar', 1000, onChangeFunction);
   if (testing) {
      $.each([
         { text: 'Test Popper', fn: function(){console.log('testing')} },
         { text: 'Run Notifier', fn: onChangeFunction }
      ], function(i,item) {
         $('<div></div>')
         .attr({_lnk:'1',class:'cmLnk mnuItmTxtItm'})
         .text(item.text || 'No Text!?')
         .click(item.fn)
         .appendTo($('#divHelpContextMenu'));
      });
   }
})(jQuery);
