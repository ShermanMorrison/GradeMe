"use strict";

//////////////
//global vars//
//////////////

var c=document.getElementById("canvas");
c.width = 1600;
c.height = 2379;
var ctx=c.getContext("2d");
var text = "";
var keysDown = {};
var myPos = [0,0];
var maxIndex = 10;
var cycleIndex = 0;

///////////////////
//event listeners//
///////////////////

//Double Click Listener -- Place Text
c.addEventListener('dblclick',function(pos){
	myPos = pos;
	text = "";
	ctx.font = "30px Verdana";
	ctx.fillStyle="#FF0000";
});
//Mouse Drag -- Draw
var flag = -1;
var lastPos = [0,0];
document.addEventListener("mousedown", function(e){
    flag = 0;
}, false);
//1 after move
document.addEventListener("mousemove", function(e){
	//lastPos = xxxx.
	if (flag == 0){
		lastPos = [e.x,e.y];
		flag = 1;
	}
	else if (flag == 1){
	ctx.beginPath();
	ctx.lineWidth = 10;
	ctx.strokeStyle = '#ff0000';
	ctx.moveTo(lastPos[0], lastPos[1]);
	ctx.lineTo(e.x, e.y);
	ctx.stroke();
	lastPos = [e.x,e.y];
	console.log(lastPos[0]);
	flag = 1;
	}


}, false);
// -1 after up
document.addEventListener("mouseup", function(e){
    if(flag === 0){
        //console.log("click"); // this is a click
    }
    else if(flag === 1){
        //mouse drag

    }
    flag = -1;
}, false);


window.addEventListener("keydown", function(event){
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
	delete keysDown[event.keyCode];
});
//clear button
function clear(){
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	getimg();
}

///////////
//Animate//
///////////

window.onload = function(){
	document.body.appendChild(canvas);
	animate(step);
}

var step = function(){
	// do all updates and rendering
	update();
	animate(step);
}

var update = function(){
	cycleIndex -= 1;
	if (cycleIndex < 0){
		cycleIndex = 0;
	}

	for (var key in keysDown){

		if (key == "13"){
			// you hit enter..
		}

		ctx.fillText(text, myPos.x, myPos.y);
		if (cycleIndex == 0){
			if (key == "8"){
				// you hit backspace..
				// text = text.substring(0, text.length - 1);
			} 
			else{
				text += String.fromCharCode(key);
				cycleIndex += maxIndex;
			}

		}
		

	}
};


var renderAnimate = function(img, assignedQ, qPerPage) {

    var qHeight = c.height / qPerPage;

    var i = assignedQ;

    // ctx.drawImage(img,0,0);
    ctx.drawImage(img, 0, (i - qPerPage * Math.floor(i / qPerPage)) * qHeight, c.width, c.height, 0, 0, c.width, c.height);
    document.getElementById("clrButton").onclick = clear;

};

///
var animate = window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };

