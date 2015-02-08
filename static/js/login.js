/**
 * Created by phrayezzen on 10/7/14.
 */

$(document).ready(function() {
  $.getJSON("/professor", function(result) {
      var professors = result["result"];
      for (var i = 0; i < professors.length; i++) {
          var professor = professors[i];
          $("#professors").append('<option value="' + professor["username"] + '">' +
          professor["firstName"] + " " + professor["lastName"] + "</option>");
      }
  });

  $("professor-0").on("click", function() {
      $("#professorsList").show();
  });
  $("professor-1").on("click", function() {
      $("#professorsList").hide();
  });
});