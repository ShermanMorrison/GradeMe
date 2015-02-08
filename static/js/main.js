/**
 * Created by phrayezzen on 10/7/14.
 */

$(document).ready(function() {
    $("#qTotal").on("input", function() {
        var questions = $("#questions");
        questions.empty();
        var numQuestions = $("#qTotal")[0].value;
        for (var i = 1; i <= Math.min(200, numQuestions); i++) {
            questions.append('<div class="form-group">' +
                '<label class="col-md-3 control-label" for="' + i + '">Question ' + i + '</label>' +
                '<div class="col-md-6">' +
                '<input id="q' + i + '" name="q' + i + '" type="text" class="form-control input-md">' +
                '</div>' +
                '</div>');
        }
    });

    $("#submit").on("click", function() {
        var questionTexts = [];
        for (var i = 1; i <= $("#qTotal")[0].value; i++) {
            questionTexts.push($("#q" + i)[0].value);
        }
        drawPDF(questionTexts, $("#qPerPage")[0].value);

        $.post("/test", $("form").serialize());
    });

    $.getJSON("/professor", function(result) {
        var professors = result["result"];
        for (var i = 0; i < professors.length; i++) {
            var professor = professors[i];
            $("#professor").append('<option value="' + professor["username"] +
                (professor["username"] == result["username"] ? '" selected' : '"') + '>' +
                professor["firstName"] + " " + professor["lastName"] + "</option>");
        }
    });
});