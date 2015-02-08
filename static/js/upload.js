/**
 * Created by phrayezzen on 2/8/15.
 */

var updateTests = function() {
    $.getJSON("/test/" + $("#professor option:selected")[0].value, function(result) {
        $("#test").empty();
        var tests = result["result"];
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            $("#test").append('<option num="' + test["qTotal"] + '" value="' + test["tId"] + '">' +
                test["name"] + "</option>");
        }
    });
};

$(document).ready(function() {

    $.getJSON("/professor", function(result) {
        var professors = result["result"];
        for (var i = 0; i < professors.length; i++) {
            var professor = professors[i];
            console.log(professor["username"] == result["username"])
            $("#professor").append('<option value="' + professor["username"] +
                (professor["username"] == result["username"] ? '" selected' : '"') + '>' +
                professor["firstName"] + " " + professor["lastName"] + "</option>");
        }
        updateTests();
    });

    $("#professor").on("change", updateTests);
});