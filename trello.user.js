// ==UserScript==
// @name Trello Popper
// @namespace http://userscripts.4moms.com/trello
// @description Show what members of the current board are working on from all boards
// @match http://trello.com/board/*
// @match https://trello.com/board/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://api.trello.com/1/client.js?key=f27e414384e2d5bec5d4b6c18e240896
// ==/UserScript==

;(function($){

  function id(what) {
    return 'trello-popper-' + what;
  }

  $(window).on('resize', function(){
    $('#' + id('users')).css({width:$('#board').position().right});
  });

  function currentBoard() {
    var m = window.location.href.match(/^https?:\/\/trello.com\/board\/(?:.*\/)?([^\/?#]+)/);
    return m ? m[1] : null;
  }

  var avatars = {};

  // function to change an element into a relevant avatar
  $.fn.avatarify = function(uid) {
    // member ID is either passed in or found in the element's data
    uid = uid || $(this).data('uid');
    if (!uid) return this;
    $(this).data({uid:uid});
    var size = '30';
    if (uid in avatars) {
      var txt = this.text();
      this.html(
        $('<img class="member-avatar"/>')
        .attr({
          src: 'https://trello-avatars.s3.amazonaws.com/' + avatars[uid] + '/' + size + '.png',
          height: size,
          width: size,
          title: txt
        })
      );
    } else {
      var element = this;
      Trello.get('members/' + uid, function(member){
        avatars[uid] = member.avatarHash;
        $(element).avatarify(uid);
      });
    }
    return this;
  };

  // cache of list Names
  var listNames = {};
  var listNamesPending = {};
  // function to filter based on a card's list name
  $.fn.filterByList = function() {
    var lid = $(this).data('list');
    if (lid) {
      if (lid in listNamesPending) {
        // if pending, try again in a little bit
        var element = this;
        window.setTimeout(function(){
          $(element).filterByList();
        }, 250);
      } else if (lid in listNames) {
        var name = listNames[lid];
        if (name.match(/done/i)
          || name.match(/hold/i)
          || name.match(/to.do/i)
          || name.match(/stag(ed?|ing)/i)
          || name.match(/\s\d\d\d\d$/i)
        )
          $(this).toggle(false);
        else
          $(this).toggle(true);
      } else {
        var element = this;
        listNamesPending[lid] = true;
        Trello.get('lists/' + lid, function(list) {
          listNames[lid] = list.name;
          delete listNamesPending[lid];
          $(element).filterByList();
        }, function(list) {
          delete listNamesPending[lid];
        });
      }
    }
    return this;
  };

  function currentBoardUsers() {
    var out = id('users');

    $('#' + out).remove();

    // make this list look like a Trello list
    $('<div class="list"><div class="list-header clearfix"><span class="app-icon small-icon list-icon"></span><div class="list-title non-empty clearfix" attr="name"><h2 class="hide-on-edit current">Member Current Tasks</h2></div></div><div class="list-card-area"><div class="list-gradient-top"></div><div class="list-gradient-bottom"></div><div class="list-cards"></div></div></div>')
    .attr({id:out})
    .css({ width: $('.list:first').css('width') }) // match the list's width
    .click(currentBoardUsers)
    .prependTo('.list-area:first');

    var destination = '#' + out + ' .list-cards';

    var board = currentBoard();

    // find all members on this board
    var members_path = 'boards/' + board + '/members?fields=fullName,initials,avatarHash';
    Trello.get(members_path, function(members) {

      // keep track of cards, so they're not added multiple times
      var card_divs = {};

      $.each(members, function(i,member){
        avatars[member.id] = member.avatarHash;

        // find all open cards for this member
        var cards_path = 'members/' + member.id + '/cards/open';
        Trello.get(cards_path, function(cards) {
          $.each(cards, function(ic, card) {
            if (!card_divs[card.id]) {
              $(destination).append(
                $('<div class="list-card clearfix active-card"></div>')
                .data({card: card.id})
                .data({list: card.idList})
                .hide()
                .filterByList()
                .append(
                  $('<a class="list-card-title"></a>')
                  .attr({href:card.url})
                  .addClass('card')
                  .text(card.name)
                )
                .append(
                  $('<div class="list-card-members"></div>')
                  .data('card', card.id)
                  .css({ marginTop: '-28px' }) // Make these cards very compact
                )
              );
              card_divs[card.id] = $('.list-card-members:last', destination)[0];
            }

            // Add the member to the existing card
            $(card_divs[card.id])
            .append(
              $('<div class="member"></div>')
              .data({uid:member.id})
              .text(member.fullName)
              .avatarify()
            );
          });
        });
      });
    });
  }

  function findCurrentCards() {
    currentBoardUsers();
    $(window).trigger('resize');
  }

  function whenExists(selector, callback) {
    if ($(selector).length)
      callback();
    else
      window.setTimeout(function(){ whenExists(selector, callback) }, 100);
  }

  function authFail() {
    console.log('Authorization failed?!');
  }

  function addClicker(idpart, text, click) {
    return $('<a class="button-link"></a>')
    .attr({id:id(idpart)})
    .append($('<span></span>').addClass('app-icon').addClass('small-icon').addClass('board-icon'))
    .append(text)
    .click(click)
    .hide()
    .appendTo('.board-widget:nth(1) .board-widget-content');
  }

  function setupTrelloLogin() {

    // Add a button to set up authorization
    addClicker('login', 'Authorize Trello Popper', function() {
      Trello.authorize({
        type: 'popup',
        succcess: updateTrelloLogin,
        error: updateTrelloLogin
      });
    });

    // And another to logout
    addClicker('logout', 'Logout Trello Popper', function() {
      Trello.deauthorize();
      updateTrelloLogin();
    });

    addClicker('refresh', 'Refresh Trello Popper', updateTrelloLogin).show();

    // Try non-interactive authorization, updating buttons regardless of status
    Trello.authorize({
      interactive: false,
      success: updateTrelloLogin,
      error: updateTrelloLogin
    });
  }

  function updateTrelloLogin() {
    var loggedIn = Trello.authorized();
    $('#' + id('login')).toggle(!loggedIn);
    $('#' + id('logout')).toggle(loggedIn);
    if (loggedIn)
      findCurrentCards();
  }

  whenExists('#board-header', setupTrelloLogin);

  /* workarounds for non-Firefox UserScript stuff
  // *Script injection is munged by jQuery intentionally, so use the DOM directly*
  function addJavaScript(opts) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    if (opts.src)
      s.src = opts.src;
    else
      s.text = opts.text;
    var h = document.getElementsByTagName('head')[0];
    h.appendChild(s);
  }

  function addTrelloAndRunAgain() {
    $(function(){
      everRun = true;
      addJavaScript({ src: 'https://api.trello.com/1/client.js?key=f27e414384e2d5bec5d4b6c18e240896' });

      window.TrelloPopperStartup = function(trello) {
        console.log('TrelloPopperStartup',trello);
        doThisThing($, window, trello);
      };

      addJavaScript({ text: 'console.log("appended script"); console.log(window); TrelloPopperStartup(window.Trello)' });
      console.log('outside');
    });
  }

  if (!Trello && !everRun) {
    addTrelloAndRunAgain();
  } else {
    console.log('running');
  }
  */
})(jQuery);
