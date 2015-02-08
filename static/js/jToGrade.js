"use strict";

//////////////
//global vars//
//////////////

var c=document.getElementById("canvas");
c.width = 500;
c.height = 450;
var ctx=c.getContext("2d");
var text = "";
var keysDown = {};
var myPos = [0,0];
var maxIndex = 10;
var cycleIndex = 0;
var index = 0;

var len;

function next(){
    index += 1;
    if (index >= len){
        index = 0;
    }
    clear();
}
function back(){
    index -= 1;
    if (index < 0){
        index = len - 1;
    }
    clear();
}

var render = function(imgArray, assignedQ, qPerPage){
    len = imgArray.length;

    document.getElementById("nextButton").onclick = next;
    document.getElementById("backButton").onclick = back;

    renderAnimate(imgArray[index], assignedQ, qPerPage);

};
