(function(){


$(document).ready(function() {

  menuNavigator();

  bindKeysNotComplete();

  $('#progressBar').progressbar();
  $('#progressBar .ui-progressbar-value').addClass('ui-corner-right');
  $('#progressBar .ui-progressbar-value').addClass('ui-corner-left');

  $('#userinput').enable_pinyin_input();

  $('nav a').click(function(event) {

    event.preventDefault();

    $('#contentBoxMain').stop().scrollTo($($(this).attr('href')), 1000);

    // mark this as the currently selected item
    makeMenuSelection($(this));
  });

  $('.play').click(function() {
    playAudio();
  });

  $('.hint').click(function() { $('#hint').show(); });
  $('.next').click(function() { getNextQuestion(0); });

  $('.diff1').click(function() { getNextQuestion(1); });
  $('.diff2').click(function() { getNextQuestion(2); });
  $('.diff3').click(function() { getNextQuestion(3); });
  $('.diff4').click(function() { getNextQuestion(4); });
  $('.diff5').click(function() { getNextQuestion(5); });

  newQuestion();

  $('#tutorial .showHide').click(function() { hideTutorial(); });

});

function hideTutorial() {
  $('#tutorial .showHide').html('<a>&#x25BE;&nbsp; Show tutorial</a>');
  $('#tutorial .content').slideUp('slow');

  $('#tutorial .showHide').off();
  $('#tutorial .showHide').click(function() { showTutorial(); });
}

function showTutorial() {
  $('#tutorial .showHide').html('<a>&#x25B4;&nbsp; Hide tutorial</a>');
  $('#tutorial .content').slideDown('slow');

  $('#tutorial .showHide').off();
  $('#tutorial .showHide').click(function() { hideTutorial(); });
}

function playAudio() {
  var newSource = $('#questionuri').text();
  $('#audio').attr('src', newSource);

  MediaElement('audio', { success: function(me) {
    me.play();
  }});

}

// clear all menu selections, and mark the given item as selected
function makeMenuSelection(selectedItem) {
  $('nav li a').each(function() {
    $(this).removeClass('selected');
  });

  selectedItem.addClass('selected');
}

function menuNavigator() {
  // at site load, animate it to first selection
  $('#navigator').animate({
    left: $('nav li a:first').position().left,
    width: $('nav li a:first').width()
  });

  $('nav li').hover(function() {
      $('nav .hovered').each(function() {
        $(this).removeClass('hovered');
      });

      $('#navigator').stop().animate({
        left: $(this).position().left,
        width: $(this).width()
      });

      $(this).addClass('hovered');
    },
    function() {
      var selected = $('nav .selected').parent();
      $('#navigator').stop().animate({
        left: selected.position().left,
        width: selected.width()
      });
      $(this).removeClass('hovered');
      $('nav .selected').addClass('hovered');
  });
}

function newQuestion() {
  $('#userinput').focus();

  $('#userinput').unbind('keyup');
  $('#userinput').keyup(function(event) {
    analyze();
  });

  analyze();

  function analyze() {
    var dic = new Dictator();
    dic.dictations = getTranslations();
    var userinput = $('#userinput').val();

    dic.analyze(userinput);

    var sanitizedTargetLength = dic.sanitize(dic.dictationTarget).length;
    var percentage = parseInt((dic.failureIndex / sanitizedTargetLength) * 100);

    if(percentage > 0) { $('#progressBar .ui-progressbar-value').show(); }
    else { $('#progressBar .ui-progressbar-value').hide(); }

    var targetWidth = (498 * (percentage / 100)).toString() + 'px';
    $('#progressBar .ui-progressbar-value').stop().animate({width:targetWidth}, 100);

    $('.pbLabel').text(percentage + "%");
    $('#hint').text('Hint: ' + dic.hint);

    $('#correctProgress').html(dic.correctSoFar);

    // update indicator on whether or not we're successful
    if(dic.completed) {
      $('#userinput').removeClass('incorrect');
      $('#userinput').addClass('correct');

      showCompletionNotification();
    }
    else {
      $('#userinput').removeClass('correct');
      $('#userinput').addClass('incorrect');
    }

  }

  function getTranslations() {
    var translations = [];

    $('#question .translation').each(function() {
      if($(this).find('.language').text() == 'pinyin') {
        translations.push($(this).find('.sentence').text());
      }
    });

    return translations;
  }
}

function showCompletionNotification() {
  bindKeysComplete();

  $('#notifications').addClass('pulsating');

  var english = $('#question .sentence').first().text();
  var hanzi = $('#question .translation .sentence').first().text();
  $('#notifications #translationEnglish').text(english);
  $('#notifications #translationHanzi').text(hanzi);
  $('#notifications #instructions').show();
  $('#hint').hide();
}

function clearNotificationArea() {
  $('#notifications').removeClass('pulsating');
  $('#correctProgress').text('');
  $('#notifications #translationHanzi').text('');
  $('#notifications #translationEnglish').text('');
  $('#hint').text('');

  $('#notifications #instructions').hide();
  $('#progressBar .ui-progressbar-value').stop().animate({width:'0px'}, 100);
}

function bindKeysNotComplete() {
  $(document).unbind('keypress', handlerComplete);
  $(document).unbind('keypress', handlerIncomplete);

  $(document).bind('keypress', handlerIncomplete);
}

function bindKeysComplete() {
  $(document).unbind('keypress', handlerIncomplete);
  $(document).unbind('keypress', handlerComplete);

  $(document).bind('keypress', handlerComplete);
}

function handlerComplete(event) {
  if(event.which == 13) {
    getNextQuestion(0);
  }
}

function handlerIncomplete(event) {
  // ctrl + enter, get a hint
  event.stopPropagation();
  if(event.which == 10 && event.ctrlKey) {
    $('#hint').show();
  }

  // anything else, hide the hint
  else {
    $('#hint').hide();
  }

  if(event.which == 13) {
    playAudio();
  }
}

function getNextQuestion(difficulty) {
  if(difficulty == 0) {
    // grab the difficulty from the existing question
    difficulty = parseInt($('#question .difficulty').text());
  }

  clearNotificationArea();

  $('#userinput').focus();
  $('#userinput').val('');
  bindKeysNotComplete();

  $.ajax({
    url: '/question?difficulty=' + difficulty,
    complete: function() { playAudio(); }
  });

}

})();
