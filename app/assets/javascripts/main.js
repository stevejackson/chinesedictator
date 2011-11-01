$(document).ready(function() {

  // horizontal scrolling
  $('ul.nav a').click(function(event) {
    $('#innercontainer').stop().animate({
      scrollLeft: $($anchor.attr('href')).offset().left
    }, 1000);
    event.preventDefault();
  });

  $('#info .about').click(function() {
    $('#helpcontent').hide();
    $('#aboutcontent').toggle();
  });

  $('#info .help').click(function() {
    $('#aboutcontent').hide();
    $('#helpcontent').toggle();
  });

  $('.play').click(function() {

    $('#audio').get(0).play();

  });


  newQuestion();

});

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
      alert('ok');
      $('#userinput').val('');
      $.ajax('/question?difficulty=1');
    }
  });
}

function hideCompletion() {
  $('#question').hide();
  $(document).unbind('keypress');
}
