"use strict";


var width = 220;
var height = 290;

var qPerPage = 3;	//input qPerPAge
var inputArray = ["1 1 1111 11","2222 2222","3333 3 3 3 3 3333","4","5"]; // input string array

var totalQ = inputArray.length;	

if ((totalQ < 1)){
	throw "Must have at least one question.";
}
if (qPerPage > 10){
	qPerPage = 10;
}

var numPages = Math.floor((totalQ - 1) / qPerPage) + 1;
var lines = qPerPage - 1;
var heightQ = height / qPerPage;


////////////////////
//global functions//
////////////////////
function drawLines(doc){
	for (var i = 0; i < lines; i++){
		doc.setLineWidth(1);
		doc.line(0, (i+1) * heightQ, width, (i+1) * heightQ);
	}
}

//Event Listener to download PDF
function demo() {
	var doc = new jsPDF();

	//	draw the lines in the first page
	drawLines(doc);
	//	draw the text in the first page

	for (var i = 1; i < numPages; i++){
		doc.addPage();
		drawLines(doc);
	}

	// Save the PDF
	doc.save('Test.pdf');


}


