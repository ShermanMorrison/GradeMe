/**
 * Created by phrayezzen on 2/8/15.
 */

var updateQuestions = function() {
    var q = $("#questions");
    q.empty();
    for (var i = 1; i <= $("#test option:selected").attr("num"); i++) {
        q.append('<option value="' + i + '">' + i + "</option>");
    }
};

$(document).ready(function() {

    $.getJSON("/test", function(result) {
        var tests = result["result"];
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            $("#test").append('<option num="' + test["qTotal"] + '" value="' + test["tId"] + '">' +
                test["name"] + "</option>");
        }
        updateQuestions();
    });

    $.getJSON("/grader", function(result) {
        $("#grader").append('<option value="' + result["self"][0] + '">' +
            result["self"][1] + " " + result["self"][2] + "</option>");
        var graders = result["result"];
        for (var i = 0; i < graders.length; i++) {
            var grader = graders[i];
            $("#grader").append('<option value="' + grader["username"] + '">' +
                grader["firstName"] + " " + grader["lastName"] + "</option>");
        }
    });

    $("#test").on("change", updateQuestions);

    setTimeout(function() {
        $("#assign").on("click", function () {
            var toDelete = $("#questions option:selected");
            var l = toDelete.length;
            for (var i = l - 1; i >= 0; i--) {
                toDelete[i].remove();
            }
        });
    }, 1000);
});