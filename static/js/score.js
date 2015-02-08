/**
 * Created by phrayezzen on 2/8/15.
 */

$(document).ready(function() {

    $.getJSON("/student", function(result) {
        var students = result["result"];
        for (var i = 0; i < students.length; i++) {
            var student = students[i];
            $("#student").append('<option value="' + student["student"] + '">Student ' +
                student["student"] + "</option>");
        }
    });

    $.getJSON("/test", function(result) {
        var tests = result["result"];
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            $("#test").append('<option value="' + test["name"] + '">' +
                test["name"] + "</option>");
        }
    });

    $("#submit").on("click", function() {
        $("thead").empty();
        $("tbody").empty();
        var students = $("#student option:selected");
        var tests = $("#test option:selected");
        for (var i = 0; i < tests.length; i++) {
            $("th").append("<td>" + tests[i].value + "</td>");
        }
    });
});