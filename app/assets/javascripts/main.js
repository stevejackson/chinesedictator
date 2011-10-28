$(document).ready(function() {

  $('#userinput').focus();

  $('.play').click(function() {

    $('#audio').get(0).play();

  });

  $('#userinput').keypress(function(event) {
    var dic = new Dictator();
    dic.dictations = new Array("testery!");
    var userinput = $(this).val();
    dic.analyze(userinput);
    alert(userinput);
    alert(dic.completed);
  });

});
