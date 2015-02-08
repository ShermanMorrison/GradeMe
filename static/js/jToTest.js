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


var render = function(imgBg, img, index, qPerPage){

	var qHeight = c.height/qPerPage;

	imgBg.onload = function(){
		ctx.drawImage(imgBg,0,0);
	}
	
	img.onload = function(){
		ctx.drawImage(img,0,index * img.height/qPerPage,img.width,img.height,0,index*qHeight,c.width,qHeight);		
	}

}
