/**
 * Created by phrayezzen on 2/8/15.
 */

var updateTests = function() {
    $.getJSON("/test/" + $("#professor option:selected")[0].value, function(result) {
        var t = $("#test");
        t.empty();
        var tests = result["result"];
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            t.append('<option num="' + test["qTotal"] + '" value="' + test["tId"] + '">' +
                test["name"] + "</option>");
        }
    }).done(updateQNums);

};

var updateQNums = function() {
    $.getJSON("/question/" + $("#test option:selected")[0].value, function(result) {
        var q = $("#question");
        q.empty();
        var questions = result["result"];
        console.log(questions)
        for (var i = 0; i < questions.length; i++) {
            var question = questions[i];
            q.append('<option value="' + question["question"] + '">' + question["question"] + "</option>");
        }
    })
};

$(document).ready(function() {

    $.getJSON("/professor", function(result) {
        var professors = result["result"];
        for (var i = 0; i < professors.length; i++) {
            var professor = professors[i];
            $("#professor").append('<option value="' + professor["username"] +
                (professor["username"] == result["username"] ? '" selected' : '"') + '>' +
                professor["firstName"] + " " + professor["lastName"] + "</option>");
        }
    }).done(updateTests);

    $("#professor").on("change", updateTests);
});