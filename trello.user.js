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
          // Add the username -- will be replaced by avatar
          $('#'+out).append(
            $('<div></div>')
            .data({uid:member.id})
            .addClass('user')
            .css({float:'left',clear:'left'})
            .text(member.fullName)
            .avatarify()
          );

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
    updateTrelloLogin();
    currentBoardUsers();
    $(window).trigger('resize');
  }

  function whenExists(selector, callback) {
    if (!$(selector).length)
      callback();
    else
      window.setTimeout(function(){ whenExists(selector, callback) }, 100);
  }

  function authFail() {
    console.log('Authorization failed?!');
  }

  function setupTrelloLogin() {

    // Try non-interactive authorization first
    Trello.authorize({
      interactive: false,
      succcess: findCurrentCards,
      error: authFail
    });

    if (Trello.authorized())
      return findCurrentCards();

    // Otherwise put up a button to set up authorization
    $('<div></div>')
    .attr({id:id('login')})
    .text('Authorize Trello popper')
    .click(function(){
      Trello.authorize({
        succcess: findCurrentCards,
        error: authFail
      });
    })
    .css({background:'white'})
    .appendTo('#board');
  }

  function updateTrelloLogin() {
    if (Trello.authorized())
      $('#' + id('login')).toggle();
  }

  whenExists('#board-header', setupTrelloLogin);
})(jQuery);
