/**
 * Created by phrayezzen on 2/8/15.
 */

$(document).ready(function() {
  $.getJSON("/test", function(result) {
      var tests = result["result"];
      for (var i = 0; i < tests.length; i++) {
          var test = tests[i];
          $("#test").append('<option value="' + test["tId"] + '">' + test["name"] + "</option>");
      }
  });

    $.getJSON("/grader", function(result) {
        var graders = result["result"];
        for (var i = 0; i < graders.length; i++) {
            var grader = graders[i];
            $("#grader").append('<option value="' + grader["username"] + '">' +
                grader["firstName"] + " " + grader["lastName"] + "</option>");
        }
    });
});