"use strict";





////////////////////
//global functions//
////////////////////
function drawLines(doc,lines,heightQ,width){
	for (var i = 0; i < lines; i++){
		doc.setLineWidth(1);
		doc.line(15, (i+1) * heightQ, width, (i+1) * heightQ);
	}
}
function drawText(doc, textArray, qPerPage, heightQ, page){
	doc.setTextColor(100);

	for (var i = 0; i<qPerPage; i++){
		if ((qPerPage * page + i) >= textArray.length){
			return;
		}
		doc.text(20, heightQ * i + 20, (qPerPage * page + i + 1) + ")")
		doc.text(20, heightQ * i + 40, textArray[qPerPage * page + i]);
	}
	
}

//Event Listener to download PDF
function drawPDF(inputArray,qPerPage) {
	var width = 195;
	var height = 290;

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

	var doc = new jsPDF();
	doc.setLineWidth(5);

	//	draw the lines in the first page
	drawLines(doc,lines,heightQ,width);
	//	draw the text in the first page
	drawText(doc, inputArray, qPerPage, heightQ, 0);

	// draw the lines and text on remaining pages
	for (var i = 1; i < numPages; i++){
		doc.addPage();
		drawLines(doc,lines,heightQ,width);
		drawText(doc, inputArray, qPerPage, heightQ, i);
	}

	// Save the PDF
	doc.save('Test.pdf');


}


