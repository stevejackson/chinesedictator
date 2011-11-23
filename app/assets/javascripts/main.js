(function(){
    $(document).ready(function() {


  menuNavigator();
  $(document).keypress(function(event) {
    if(event.which == 13) {
      playAudio();
    }
  });

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
  $('.next').click(function() { getNextQuestion(); });

  newQuestion();

  playAudio();
});

function playAudio() {
  $('#audio').get(0).play();
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
  bindKeysNotComplete();
}

function bindKeysNotComplete() {
  $('#userinputwrapper').unbind('keypress');

  $(document).keypress(function(event) {
    // ctrl + enter, get a hint
    event.stopPropagation();
    if(event.which == 10 && event.ctrlKey) {
      $('#hint').show(); 
    }

    // anything else, hide the hint
    else {
      $('#hint').hide();
    }
  });
}

function bindKeysComplete() {
  $('#userinputwrapper').unbind('keypress');

  $('#userinputwrapper').keypress(function(event) {
    if(event.which == 13) {
      getNextQuestion();
    }
  });
}

function getNextQuestion() {
  $.ajax({
    url: '/question?difficulty=1',
    complete: function() { playAudio(); }
  });
  $('#userinput').val('');

  clearNotificationArea();

  $('#userinput').focus();
}

})();
