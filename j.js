"use strict";


canvas.width = 600;
canvas.height = 800;

var ctx = document.getElementById('canvas').getContext('2d');

// var qPerPage = 10;
// var totalQ = 23;

// if ((totalQ < 1)){
// 	throw "Must have at least one question.";
// }
// if (qPerPage > 10){
// 	qPerPage = 10;
// }

// var numPages = (totalQ - 1) / qPerPage
// var lines = qPerPage - 1;
// var heightQ = canvas.height / lines;

// //dividing lines
// for (var i = 0; i < lines; i++){
// 	ctx.beginPath();
// 	ctx.moveTo(0, (i+1) * heightQ);
// 	ctx.lineTo(canvas.width, (i+1) * heightQ);
// 	ctx.stroke();
// }
// //border
// var offset = [0,0];
// var w = 40;
// var h = 20;

// ctx.beginPath();
// ctx.moveTo(offset[0], offset[1]);
// ctx.lineTo(offset[0] + w, offset[1]);
// ctx.stroke();
// ctx.beginPath();
// ctx.moveTo(offset[0], offset[1] + h);
// ctx.lineTo(offset[0] + w, offset[1] + h);
// ctx.stroke();
// ctx.beginPath();
// ctx.moveTo(offset[0], offset[1]);
// ctx.lineTo(offset[0], offset[1] + h);
// ctx.stroke();
// ctx.beginPath();
// ctx.moveTo(offset[0] + w, offset[1]);
// ctx.lineTo(offset[0] + w, offset[1] + h);
// ctx.stroke();

var doc = new jsPDF();

doc.line(20, 20, 60, 20); // horizontal line
	
doc.setLineWidth(0.5);
doc.line(20, 25, 60, 25);

doc.setLineWidth(1);
doc.line(20, 30, 60, 30);

doc.setLineWidth(1.5);
doc.line(20, 35, 60, 35);

doc.setDrawColor(255,0,0); // draw red lines

doc.setLineWidth(0.1);
doc.line(100, 20, 100, 60); // vertical line

doc.setLineWidth(0.5);
doc.line(105, 20, 105, 60);

doc.setLineWidth(1);
doc.line(110, 20, 110, 60);

/////////////////////
//class definitions//
/////////////////////
// function Page(qPerPage, numPages, index){
// 	this.qPerPage = qPerPage;
// 	this.numPages = numPages;
// 	this.index = index;
// 	this.space = 5; //space b/w pages
// 	this.width = (canvas.width - ((this.numPages + 1) * this.space))/this.numPages; //?

// 	this.height = 0;  //?
// }