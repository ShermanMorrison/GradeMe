"use strict";


canvas.width = 600;
canvas.height = 800;

var ctx = document.getElementById('canvas').getContext('2d');

var numQ = 10;
var lines = numQ - 1;
var heightQ = canvas.height / lines;

for (var i = 0; i < numQ; i++){
	ctx.beginPath();
	ctx.moveTo(0,i * heightQ);
	ctx.lineTo(canvas.width, i * heightQ);
	ctx.stroke();
}
