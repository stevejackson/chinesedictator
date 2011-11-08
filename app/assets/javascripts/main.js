$(document).ready(function() {

  menuNavigator();

  //progress bar set up
  $('#progressBar').progressbar({
  });

  // horizontal scrolling
  //$('.section').scrollable().navigator();
  $('nav a').click(function(event) {

    event.preventDefault();

    $('#contentBoxMain').stop().scrollTo($($(this).attr('href')), 1000);

    // mark this as the currently selected item
    makeMenuSelection($(this));
  });

  $('.play').click(function() {

    $('#audio').get(0).play();

  });

  newQuestion();

});

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
    left: $('nav li:first').position().left,
    width: $('nav li:first').width()
  });

  $('nav li').hover(function() {
    $('#navigator').stop().animate({
      left: $(this).position().left,
      width: $(this).width()
    });
  },
  function() {
    var selected = $('nav .selected');
    $('#navigator').stop().animate({
      left: selected.position().left,
      width: selected.width()
    });
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

      showCompletionNotification();
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
  }

  function getTranslations() {
    var translations = [];

    $('#question .translation .sentence').each(function() {
      translations.push($(this).text());
    });

    return translations;
  }
}

function showCompletionNotification() {
  $('#question').show();
  
  // Now they can press enter to move onto the next question.
  $(document).keypress(function(event) {
    if(event.which == 13) {
      $('#userinput').val('');
      $.ajax('/question?difficulty=1');
    }
  });
}

function hideCompletion() {
  $('#question').hide();
  $(document).unbind('keypress');
}
