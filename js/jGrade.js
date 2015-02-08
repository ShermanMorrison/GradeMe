"use strict";



//image input
var img= new Image();
img.src = "file:///C:/Users/Jonathan/Documents/GitHub/GradeMe/js/background.jpg";



var c=document.getElementById("canvas");
var ctx=c.getContext("2d");
ctx.drawImage(img,0,0);

document.getElementById("clrButton").onclick = clear;

//////////////
//local vars//
//////////////
var text = "";
var keysDown = {};
var myPos = [0,0];
var cycleIndex = 0;
var maxIndex = 10;

img.onload = function() {
  ctx.drawImage(img,0,0,1600,1200,0,0,1600,1200);

};

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

window.addEventListener("keydown", function(event){
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
	delete keysDown[event.keyCode];
});



window.onload = function(){
	document.body.appendChild(canvas);
	animate(step);
}

var step = function(){
	// do all updates and rendering
	update();
	render();
	animate(step);
}

var update = function(){
	cycleIndex += 1;
	if (cycleIndex == maxIndex + 1){
		cycleIndex = 0;
	}

	for (var key in keysDown){

		if (key == "13"){
			text = "";
		}

		ctx.fillText(text, myPos.x, myPos.y);
		if (cycleIndex == maxIndex){
			//delete
			if (key == "8"){
				text = text.substring(0, text.length - 1);
				ctx.drawImage(img, 0, 0);

			} 
			else{
				text += String.fromCharCode(key);
			}
		}
		

	}
}

function clear(){
	ctx.clearRect ( 0 , 0 , canvas.width, canvas.height );
	ctx.drawImage(img,0,0);
}

var render = function(){



}

///
var animate = window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };


