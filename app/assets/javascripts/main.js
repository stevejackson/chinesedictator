(function(){

  $(document).ready(function() {

    $('.initialset').buttonset();
    $('.finalset').buttonset();

    $('#initials #initial-all').button();
    $('#initials #initial-none').button();
    $('#finals #final-all').button();
    $('#finals #final-none').button();

    $('#initials #initial-all').click(function() { enableAll('.initialset input'); });
    $('#initials #initial-none').click(function() { disableAll('.initialset input'); });
    $('#finals #final-all').click(function() { enableAll('.finalset input'); });
    $('#finals #final-none').click(function() { disableAll('.finalset input'); });

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


    // jquery slideDown/slideUp fix
    $('#dropdown #tutorial').css('height', $('#dropdown #tutorial').height());
    $('#dropdown #syllables').css('height', $('#dropdown #syllables').height());

    $('#dropdown .showHideTutorial').click(function() { hideTutorial(function(){}); });
    $('#dropdown .showHideSyllable').click(function() { showSyllables(); });

  });

  function hideTutorial(callback) {
    $('#dropdown .showHideTutorial').html('<a>&#x25BE;&nbsp; Show tutorial</a>');
    $('#dropdown .showHideTutorial').off();
    $('#dropdown .showHideTutorial').click(function() { showTutorial(); });
    $('#dropdown #tutorial').slideUp(440, function() { callback(); });
  }

  function showTutorial() {
    var afterHidden = function() {
      $('#dropdown .showHideTutorial').html('<a>&#x25B4;&nbsp; Hide tutorial</a>');
      $('#dropdown #tutorial').slideDown(440);

      $('#dropdown .showHideTutorial').off();
      $('#dropdown .showHideTutorial').click(function() { hideTutorial(function() {}); });
    };

    hideSyllables(afterHidden);
  }

  function showSyllables() {
    var afterHidden = function() {
      $('#dropdown .showHideSyllable').html('<a>&#x25B4;&nbsp; Hide syllable filters</a>');
      $('#dropdown .showHideSyllable').off();
      $('#dropdown .showHideSyllable').click(function() { hideSyllables(function() {}); });
      $('#dropdown #syllables').slideDown(440);
    };

    hideTutorial(afterHidden);
  }

  function hideSyllables(callback) {
    $('#dropdown .showHideSyllable').html('<a>&#x25BE;&nbsp; Show syllable filters</a>');
    $('#dropdown .showHideSyllable').off();
    $('#dropdown .showHideSyllable').click(function() { showSyllables(); });
    $('#dropdown #syllables').slideUp(440, function() { callback(); });
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
    $('#hint').hide();
  }

  function clearNotificationArea() {
    $('#notifications').removeClass('pulsating');
    $('#correctProgress').text('');
    $('#notifications #translationHanzi').text('');
    $('#notifications #translationEnglish').text('');
    $('#hint').text('');

    $('#instructions #flash').text('');
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
      difficulty = parseInt($('#instructions #difficulty').text());
    }
    else {
      // save the difficulty
      $('#instructions #difficulty').text(difficulty);
    }

    if(isNaN(difficulty)) {
      difficulty = 1;
    }

    clearNotificationArea();

    $('#userinput').focus();
    $('#userinput').val('');
    bindKeysNotComplete();

    var initialsArray = new Array();
    $('.initialset label').each(function() {
      if($(this).attr('aria-pressed') == 'true') {
        var content = $(this).find('span').text();
        initialsArray.push(content);
      }
    });

    var finalsArray = new Array();
    $('.finalset label').each(function() {
      if($(this).attr('aria-pressed') == 'true') {
        var content = $(this).find('span').text();
        finalsArray.push(content);
      }
    });

    var builtUrl = '/question?difficulty=' + difficulty +
          '&initials=' + JSON.stringify(initialsArray) +
          '&finals=' + JSON.stringify(finalsArray);

    $.ajax({
      url: builtUrl,
      complete: function() { playAudio(); }
    });
  }

  function enableAll(selector) {
    $(selector).attr('checked', true);
    $(selector).button('enable').button('refresh');
  }

  function disableAll(selector) {
    $(selector).attr('checked', false);
    $(selector).button('enable').button('refresh');
  }
})();
