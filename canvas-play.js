
function colorLog(canvasEl) {
	function writeMessage(canvas, message) {
		console.log(message);
	}
	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	}
	var context = canvasEl.getContext('2d');
	canvasEl.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvasEl, evt);

        var x = Math.floor(mousePos.x);
        var y = Math.floor(mousePos.y);

        var imageData = context.getImageData(x,y,1,1);
        var data = imageData.data;
        color = "(" + data[0] + "," + data[1] + "," + data[2] + ")";

        var message = 'Mouse color: ' + color;
        writeMessage(canvasEl, message);

    }, false);
}


document.addEventListener("DOMContentLoaded", function(event) {

	var video = document.querySelector("#videoElement");

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
	if (navigator.getUserMedia) {       
		navigator.getUserMedia({video: true}, handleVideo, videoError);
	}

	function handleVideo(stream) {
		video.src = window.URL.createObjectURL(stream);


		
		var canvas = document.getElementById('myVideoCanv');
		colorLog(canvas);

		drawLoop();
	}

	function videoError() {
		console.log("could not do video");
	}


    initSwatch();

});

var rR = 255;
var rG = 1;
var rB = 253;


function luminance(r,g,b) {
	return 0.2126*r + 0.7152*g + 0.0722*b;
}

function gray(r,g,b) {
	return .393*r + .769*g + .189*b;
}

function isGreenScreen(r,g,b) {

	lum = luminance(r,g,b);
	greenMoreThanRed = Math.max(0, g -r);
	greenMoreThanBlue = Math.max(0, g -b);

	return 50 < lum && 
			lum  < 220 && 
			g > 90 &&
			greenMoreThanRed > 10 &&
			greenMoreThanBlue > 5;
}




function initSwatch(imageObj) {

	function drawImage() {
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');

		context.drawImage(imageObj, 0, 0);

		var width = canvas.width;
		var height = canvas.height;

		var imageData = context.getImageData(0,0,width,height);
		var data = imageData.data;
		var dataLength = data.length;



		for(var i = 0; i< dataLength; i +=4) {

			r=data[i];
			g=data[i+1];
			b=data[i+2];

			if(isGreenScreen(r,g,b)){
				data[i]   = rR;
				data[i+1] = rG;
				data[i+2] = rB;
			}
		}

		context.putImageData(imageData,0,0);
	}

	var imageObj = new Image();
	imageObj.onload = function() {
		drawImage(this);
	};
	imageObj.src = 'spectrum_small.png';




	var canvas = document.getElementById('myCanvas');
	colorLog(canvas);


}

function drawLoop() {
    if (window.requestAnimationFrame) window.requestAnimationFrame(drawLoop);
    // IE implementation
    else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(drawLoop);
    // Firefox implementation
    else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(drawLoop);
    // Chrome implementation
    else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(drawLoop);
    // Other browsers that do not yet support feature
    else setTimeout(drawLoop, 16.7);
    DrawVideoOnCanvas();
}

function DrawVideoOnCanvas() {
	var webCamObject = document.getElementById("videoElement");
	var width = webCamObject.width;
	var height = webCamObject.height;

	var canvas = document.getElementById("myVideoCanv");
	canvas.setAttribute('width', width);
	canvas.setAttribute('height', height);
	
	if (canvas.getContext) {
	    var context = canvas.getContext('2d');
	    
	    context.drawImage(webCamObject, 0, 0, width, height);
	    webcamDataNormal = context.getImageData(0, 0, width, height);
	    data = webcamDataNormal.data;

	    var imgData = context.createImageData(width, height);

	    for(var ii =0; ii< imgData.width * imgData.height * 4; ii+=4){
	    	r=webcamDataNormal.data[ii];
			g=webcamDataNormal.data[ii+1];
			b=webcamDataNormal.data[ii+2];
			a=webcamDataNormal.data[ii+3];

			if(isGreenScreen(r,g,b)){
				imgData.data[ii]   = rR;
				imgData.data[ii+1] = rG;
				imgData.data[ii+2] = rB;
				imgData.data[ii+3] = 255;
			} else {
				imgData.data[ii]   = r;
				imgData.data[ii+1] = g;
				imgData.data[ii+2] = b;
				imgData.data[ii+3] = a;
			}
	    }

	    context.putImageData(imgData, 0, 0);
	  
	}
}     

