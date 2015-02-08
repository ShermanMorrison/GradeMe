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
	ctx.drawImage(img,0,0);
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
			//save image because you hit enter
			// var cs = new CanvasSaver('./saveme.php')
			// var btn = cs.generateButton('save an image!', c, 'myimage');
			// document.appendChild(btn);
		}

		ctx.fillText(text, myPos.x, myPos.y);
		if (cycleIndex == maxIndex){
			//delete
			if (key == "8"){
				text = text.substring(0, text.length - 1);
				

			} 
			else{
				text += String.fromCharCode(key);
			}
		}
		

	}
}

var render = function(){



}

///
var animate = window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };

