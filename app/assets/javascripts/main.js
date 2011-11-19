(function(){
    $(document).ready(function() {

  menuNavigator();
  bindKeysNotComplete();

  $('#progressBar').progressbar();
  $('#userinput2').enable_pinyin_input();
  $('#userinput').enable_pinyin_input();
  //$('#test').enable_pinyin_input();

  $('nav a').click(function(event) {

    event.preventDefault();

    $('#contentBoxMain').stop().scrollTo($($(this).attr('href')), 1000);

    // mark this as the currently selected item
    makeMenuSelection($(this));
  });

  $('.play').click(function() {
    playAudio();
  });

  newQuestion();

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

    // update indicator on whether or not we're successful
    if(dic.completed) {
      $('#userinput').removeClass('incorrect');
      $('#userinput').addClass('correct');

      showCompletionNotification(dic);
    }
    else {
      $('#userinput').removeClass('correct');
      $('#userinput').addClass('incorrect');

      hideCompletion();
    }

    // update progress bar
    var sanitizedTargetLength = dic.sanitize(dic.dictationTarget).length;
    var percentage = parseInt((dic.failureIndex / sanitizedTargetLength) * 100);
    $('#progressBar').progressbar("option", "value", percentage);
    $('.pbLabel').text(percentage + "%");

    $('#notifications').text(dic.correctSoFar);
  }

  function getTranslations() {
    var translations = [];

    $('#question .translation .sentence').each(function() {
      translations.push($(this).text());
    });

    return translations;
  }
}

function showCompletionNotification(dictator) {
  //$('#notifications').show();
  bindKeysComplete();
}

function hideCompletion() {
  $('#question').hide();
  bindKeysNotComplete();
}

function bindKeysNotComplete() {
  $('#userinputwrapper').unbind('keypress');

  $('#userinputwrapper').keypress(function(event) {
    if(event.which == 13) {
      playAudio();
    }
  });
}

function bindKeysComplete() {
  $('#userinputwrapper').unbind('keypress');

  $('#userinputwrapper').keypress(function(event) {
    if(event.which == 13) {
      $('#userinput').val('');
      $.ajax('/question?difficulty=1');

      playAudio();
    }
  });
}
})();
