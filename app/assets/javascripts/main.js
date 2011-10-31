$(document).ready(function() {

  $('#info .about').click(function() {
    $('#helpcontent').hide();
    $('#aboutcontent').toggle();
  });
  $('#info .help').click(function() {
    $('#aboutcontent').hide();
    $('#helpcontent').toggle();
  });

  $('#userinput').focus();

  $('.play').click(function() {

    $('#audio').get(0).play();

  });

  $(document).keypress(function(event) {
    if(event.which == 13) {
      alert("oh shit");
    }
  });

  $('#userinput').keyup(function() {
    var dic = new Dictator();
    dic.dictations = new Array("你好");
    var userinput = $(this).val();

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
    }
  });

  function showCompletionNotification() {
    $('#notification').show();
    $('#notification').html('<p>test</p>');
  }

});
