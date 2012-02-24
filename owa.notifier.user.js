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
   var notifications = {};
   function monitorChanges(selector, frequency, callback, onlyonce) {
      var html = $(selector).html();
      var listener;
      listener = setInterval(function(){
         var newhtml = $(selector).html();
         if (!newhtml) return;
         if (newhtml == html) return;
         html = newhtml;
         callback();
         if (onlyonce) clearInterval(listener);
      }, frequency);
   }
   if (window.webkitNotifications && window.webkitNotifications.checkPermission()) {
      $('<input type="button"/>')
      .value('Setup Notifications')
      .click(function(){
         window.webkitNotifications.requestPermission();
         $(this).remove();
      });
   }
   function showNotificationHTML(el, id) {
      id = id || '';
      if (notifications[id]) return;
      if (window.webkitNotifications) {
         var url = 'data:text/html;base64,'+encode_base64('<div onclick="window.close()">'+el.html()+'</div>');
         notifications[id] = window.webkitNotifications.createHTMLNotification(url);
         notifications[id].onclose = function () { notifications[id] = null; };
         notifications[id].show();
      } else {
         var divid = 'popper_div_for_notifications';
         var div = $('#'+divid);
         if (!div.length) {
            div = $('<div></div>').attr({id:divid})
               .css({position:'fixed',top:0,right:0,zIndex:10000,background:'white'})
               .appendTo($('body').filter(':first'));
         }
         notifications[id] = $('<div></div>').attr({id:divid+'_'+id}).append(el).appendTo(div);
         notifications[id].click(function() { notifications[id] = null; $(this).remove(); });
      }
   }
   // session timeout is 8 hours...
   setInterval(function(){
      $.get('keepalive.asx',null,function(){
         console.log('keptalive');
      });
   }, 5 * 60 * 60 * 1000); // five hours, in milliseconds
   function waitFor(selector, frequency, callback, once) {
      var listener;
      var listenfunc = function(){
         var found = $(selector);
         if (!found.length) return;
         callback(found);
         if (once) removeInterval(listener);
      };
      listener = setInterval(listenfunc, frequency);
      listenfunc();
   }
   waitFor('#username:visible, #tdMsg:contains(signed out)', 45000, function(){
      showNotificationHTML($('<div>Logged out</div>'),'signedout');
   });
   $.fn.reverse = [].reverse;
   var onChangeFunction = function(evt){
      var ignoreCurrency = (evt === true);
      var nid = 'reminders';
      if (notifications[nid]) return;
      var page = $('<div></div>');
      var logo = $('#imgLiveLogo');
      var src = logo.attr('src');
      var attr = { src: src };
      var css = {
         backgroundPosition: logo.css('backgroundPosition'),
         backgroundImage: logo.css('backgroundImage'),
         backgroundColor: 'transparent',
         height: logo.css('height'),
         width: logo.css('width'),
         border: 0
      };
      var bg = $('#divBackgroundImageMain');
      var bgcss = {
         backgroundImage: bg.css('backgroundImage'),
         backgroundColor: 'transparent',
         height: css.height,
         width: '100%'
      };
      var imgdiv = $('<div></div>').appendTo(page);
      var bgimg = $('<img/>').attr(attr).css(bgcss).appendTo(imgdiv);
      var img = $('<img/>').attr(attr).css(css).appendTo(imgdiv);
      img.css({position:'relative',top:'-'+css.height,marginBottom:'-'+css.height});
      var anyCurrent = false;
      $('.divNotificationsItem').reverse().each(function(){
         if ($(this).css('display') == 'none' && !ignoreCurrency) return;
         var div = $('<div></div>').appendTo(page);
         //div.css({position:'relative',top:css.height});
         anyCurrent = true;
         $('.divNotificationsColumn1 div', this).each(function(){
            div.append($('<div></div>').text($(this).text()));
         });
         $('div:first', div).css({fontWeight:'bold'});
         var timeWords = [];
         var el = this;
         $.each([ '2', '3' ], function(_i,n) {
            var css = '.divNotificationsColumn' + n;
            // funky nodeType == text node stuff, since there are embedded br's
            $(css, el).find('div:not(:contains(div))').each(function() {
               $(this).contents().each(function(){
                  if ($(this)[0].nodeType == 3)
                     timeWords.push($(this)[0].nodeValue)
               });
            });
         });
         $('div:last', div).append(' - ' + timeWords.join(' '));
      });
      if (!anyCurrent && !ignoreCurrency) return;
      if (!anyCurrent) page.append($('<div>No pending reminders</div>'));
      showNotificationHTML(page,nid);
   };
   monitorChanges('#divAlertBar', 1000, onChangeFunction);
   if (testing) {
      $.each([
         { text: 'Run Notifier', fn: onChangeFunction },
         { text: 'Test All', fn: function(){onChangeFunction(true)} }
      ], function(i,item) {
         $('<div></div>')
         .attr({_lnk:'1',class:'cmLnk mnuItmTxtItm'})
         .text(item.text || 'No Text!?')
         .click(item.fn)
         .appendTo($('#divHelpContextMenu'));
      });
   }
})(jQuery);
