
// Control variables 
var movingDropZone = false;
var movingPlane = false;
var mousePosition = {
	x : 0,
	y : 0
}
var packageDropped = false;
var simulationState = SimulationStateEnum.STOPPED;
var startTime = 0;

function startOrPauseSimulation(){
	switch(simulationState){
		case SimulationStateEnum.STARTED:
			simulationState = SimulationStateEnum.PAUSED;
			document.getElementById("btnStartAndPause").innerHTML = "Start";
			break;
		case SimulationStateEnum.STOPPED:
		case SimulationStateEnum.PAUSED:
			simulationState = SimulationStateEnum.STARTED;
			startTime = lastFrameTimeMs;	
			document.getElementById("btnStartAndPause").innerHTML = "Pause";
			break;
	}
}

function changePlaneSpeed(){
	plane.speed = parseInt(document.getElementById("spnPlaneSpeed").value);
	document.getElementById("txtPlaneSpeed").innerHTML = plane.speed + " m/s";
}

function changePlaneHeight(){
	plane.y = parseInt(document.getElementById("spnPlaneHeight").value);
	plane.initY = plane.y;
	document.getElementById("txtPlaneHeight").innerHTML = plane.y + " m";
}

function changeDropZoneRadius(){
	dropZone.width = parseInt(document.getElementById("spnDropZoneRadius").value);
	document.getElementById("txtDropZoneRadius").innerHTML = dropZone.width + " m";	
}

function changePlaneRotation(){
	plane.rotation = -1 * parseInt(document.getElementById("spnPlaneRotation").value);
	document.getElementById("txtPlaneRotation").innerHTML = (-1 * plane.rotation) + "";
}

function changeWindDirection(){
	windSpeed = parseInt(document.getElementById("spnWindDirection").value);
	document.getElementById("txtWindDirection").innerHTML = windSpeed + " m/s";		
}

function restartSimulation(){
	simulationState = SimulationStateEnum.STOPPED;
	plane.x = plane.initX;
	plane.y = STARTING_PLANE_HEIGHT;
	plane.image.src = "./images/plane.png"; 
	movingDropZone = false;
	movingPlane = false;
	packageDropped = false;
	startTime = 0;
	elapsedTime = 0;
	plane.rotation = 0;
	dropZone.x = 200;
	dropZone.y = 0;
	plane.speed = 30;
	document.getElementById("spnPlaneSpeed").value = plane.speed;
	document.getElementById("txtPlaneSpeed").innerHTML = plane.speed + " m/s";
	document.getElementById("btnStartAndPause").innerHTML = "Start";

	document.getElementById("spnPlaneHeight").value = plane.y;
	document.getElementById("txtPlaneHeight").innerHTML = plane.y + " m";
	plane.initY = plane.y;

	dropZone.width = INITIAL_DROPZONE_RADIUS;
	document.getElementById("spnDropZoneRadius").value = dropZone.width;	
	document.getElementById("txtDropZoneRadius").innerHTML = dropZone.width + " m";	

	document.getElementById("spnWindDirection").value = windSpeed;	
	document.getElementById("txtWindDirection").innerHTML = windSpeed + " m/s";

	document.getElementById("spnPlaneRotation").value = plane.rotation;
	document.getElementById("txtPlaneRotation").innerHTML = plane.rotation + "";
}

restartSimulation();

function dropPackage(){
	if (simulationState == SimulationStateEnum.STARTED && !packageDropped){
		packageDropped = true;
		package.dropTime = elapsedTime;
		package.initX = plane.x - (plane.getWidth() / (2 * PIXEL_TO_METER_SCALE));
		package.initY = plane.y;
		package.initXSpeed = plane.xSpeed;
		package.initYSpeed = plane.ySpeed;
	}
}

function canvasMouseDown(event){
	// Get coordinates relative to box
	var canvas = document.getElementById("simulationBox");
	var rect = canvas.getBoundingClientRect();
	var mouseX = event.clientX - rect.left;
	var mouseY = event.clientY - rect.top;

	var canvasCoords = toCanvasCoordinates(plane.x, plane.y);
	var plane_x = canvasCoords.x;
	var plane_y = canvasCoords.y;

	canvasCoords = toCanvasCoordinates(dropZone.x, dropZone.y);
	var dropZone_x = canvasCoords.x;
	var dropZone_y = canvasCoords.y;
	
	if (simulationState == SimulationStateEnum.STOPPED){
		// Collision detection with dropZone
		if (mouseX > (dropZone_x - dropZone.boxWidth / 2) &&
			mouseX < (dropZone_x + dropZone.boxWidth / 2) &&
			mouseY > (dropZone_y - dropZone.boxHeight / 2) &&
			mouseY < (dropZone_y + dropZone.boxHeight / 2)){
			movingDropZone = true
			mousePosition.x = event.pageX; // absolute X position of mouse
			mousePosition.y = event.pageY; // absolute Y position of mouse
		}else if  // Collsion detection with plane
			(mouseX > (plane_x - plane.getWidth() / 2) &&
			mouseX < (plane_x + plane.getWidth() / 2)  &&
			mouseY > (plane_y - plane.getHeight() / 2) &&
			mouseY < (plane_y + plane.getHeight() / 2)){
			movingPlane = true;
		}
	}		
}

function canvasMouseUp(){
	movingDropZone = false;
	movingPlane = false;
}

document.onmousemove = function(event){
	event = event || window.event;
	var deltaX = event.pageX - mousePosition.x;
	var deltaY = event.pageY - mousePosition.y	
	mousePosition.x = event.pageX;
	mousePosition.y = event.pageY;
	if (movingDropZone){
		dropZone.x += deltaX / PIXEL_TO_METER_SCALE;
		// Bound it to max and min position
		dropZone.x = Math.min(Math.max(dropZone.x, MIN_DROPZONE_X), MAX_DROPZONE_X);
	}else if (movingPlane){
		if (deltaY != 0){
			var rotation = deltaY;
			plane.rotation += rotation;			
			plane.rotation = Math.min(Math.max(plane.rotation, MIN_PLANE_ROTATION), MAX_PLANE_ROTATION);

			document.getElementById("txtPlaneRotation").innerHTML = (-1 * plane.rotation) + "";
			document.getElementById("spnPlaneRotation").value = (-1 * plane.rotation) + "";
		}
	}
}
