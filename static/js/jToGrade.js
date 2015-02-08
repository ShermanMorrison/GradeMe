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


var render = function(img, qNumArray, qPerPage){

	img.onload = function() {
		var qHeight = c.height/qPerPage;
		for (var count in qNumArray){
			var i = qNumArray[count];
			ctx.drawImage(img,0,i*qHeight,c.width,qHeight,0,count*qHeight,c.width,qHeight);
		}
	};

}