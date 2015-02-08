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


var render = function(imgArray, graderQArray, qPerPage,lowQ){


	for (var imgIndex in imgArray){
		// var myImg = document.createElement("img");
		// myImg.src = imgArray[imgIndex].src;
		imgArray[imgIndex].onload = function() {

			var qHeight = c.height/qPerPage;
			for (var count in graderQArray){
				for (var qIndex=0; qIndex<graderQArray[count].length; qIndex++){
					var qNum = graderQArray[count][qIndex];
					// ctx.drawImage(imgArray[imgIndex],0,0);
					ctx.drawImage(imgArray[count],0,qIndex*qHeight,c.width,qHeight,0,(qNum - lowQ)*qHeight,c.width,qHeight);
				}
			}
		};
	}

}
