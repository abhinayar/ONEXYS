
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

$(document).ready(function(){
	var canvas = document.getElementById("simulationBox");
	canvas.width = canvas.width = window.innerWidth - 15;
	canvas.style.display = 'block';

	var spnWidth = (canvas.width - 200);
	spnWidth = spnWidth - (spnWidth%100);
	document.getElementById('spnDropZonePosition').style.width = spnWidth;
	document.getElementById('spnDropZonePosition').max = spnWidth * 4.05;
	MAX_DROPZONE_X = spnWidth * 4.05;

	resetSimulation();
	requestAnimationFrame(mainLoop);
});

function startOrPauseSimulation(){
	switch(simulationState){
		case SimulationStateEnum.STARTED:
			simulationState = SimulationStateEnum.PAUSED;
			document.getElementById("btnStartAndPause").innerHTML = "Start";
			break;
		case SimulationStateEnum.STOPPED:
			lockUI();
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
}

function changeDropZoneRadius(){
	dropZone.width = parseInt(document.getElementById("spnDropZoneRadius").value);
	document.getElementById("txtDropZoneRadius").innerHTML = dropZone.width + " m";	
}

function changeDropZonePosition(){
	dropZone.x = parseInt(document.getElementById("spnDropZonePosition").value);	
}

function changePackageMass(){
	package.m = parseInt(document.getElementById("spnPackageMass").value);
	document.getElementById("txtPackageMass").innerHTML = package.m + " kg";	
}

function changePackageArea(){
	package.area = parseFloat(document.getElementById("spnPackageArea").value);
	document.getElementById("txtPackageArea").innerHTML = package.area + " m^2";	
}
function changePlaneRotation(){
	plane.rotation = -1 * parseInt(document.getElementById("spnPlaneRotation").value);
	document.getElementById("txtPlaneRotation").innerHTML = (-1 * plane.rotation) + "";
}

function changeWindDirection(){
	windSpeed = parseInt(document.getElementById("spnWindDirection").value);
	document.getElementById("txtWindDirection").innerHTML = windSpeed + " m/s";		
}

function changeSimulationSpeed(){
	simulationSpeed = parseFloat(document.getElementById("spnSimulationSpeed").value);
	document.getElementById("txtSimulationSpeed").innerHTML = "x" + simulationSpeed;		
}

/* Returns the simulation to time 0*/
function restartSimulation(){
	unlockUI();
	simulationState = SimulationStateEnum.STOPPED;
	plane.x = plane.initX;
	plane.y = STARTING_PLANE_HEIGHT;
	movingDropZone = false;
	movingPlane = false;
	packageDropped = false;
	startTime = 0;
	elapsedTime = 0;
	plane.rotation = 0;
	// In meters
	dropZone.y = 0;
	plane.speed = parseInt(document.getElementById("spnPlaneSpeed").value);
	document.getElementById("btnStartAndPause").innerHTML = "Start";
	plane.initY = parseInt(document.getElementById("spnPlaneHeight").value);
	plane.y = parseInt(document.getElementById("spnPlaneHeight").value);
	dropZone.width = parseInt(document.getElementById("spnDropZoneRadius").value);
	windSpeed = parseInt(document.getElementById("spnWindDirection").value);	
	plane.rotation = -1 * parseInt(document.getElementById("spnPlaneRotation").value);
	package.m = parseInt(document.getElementById("spnPackageMass").value);
	package.area = parseFloat(document.getElementById("spnPackageArea").value);
}

/* Initial simulation values */
function resetSimulation(){
	unlockUI();

	simulationState = SimulationStateEnum.STOPPED;
	plane.x = plane.initX;
	plane.y = STARTING_PLANE_HEIGHT;
	plane.image.src = "./images/plane.svg"; 
	movingDropZone = false;
	movingPlane = false;
	packageDropped = false;
	startTime = 0;
	elapsedTime = 0;
	plane.rotation = 0;
	dropZone.x = 2500;
	dropZone.y = 0;
	plane.speed = INITIAL_PLANE_SPEED;
	simulationSpeed = INITIAL_SIMULATION_SPEED;
	document.getElementById("spnPlaneSpeed").value = plane.speed;
	document.getElementById("txtPlaneSpeed").innerHTML = plane.speed + " m/s";
	document.getElementById("btnStartAndPause").innerHTML = "Start";
	document.getElementById("spnPlaneHeight").value = plane.y;
	plane.initY = plane.y;

	dropZone.width = INITIAL_DROPZONE_RADIUS;
	document.getElementById("spnDropZoneRadius").value = dropZone.width;	
	document.getElementById("txtDropZoneRadius").innerHTML = dropZone.width + " m";	

	document.getElementById("spnWindDirection").value = windSpeed;	
	document.getElementById("txtWindDirection").innerHTML = windSpeed + " m/s";

	document.getElementById("spnPlaneRotation").value = plane.rotation;
	document.getElementById("txtPlaneRotation").innerHTML = plane.rotation + "";

	document.getElementById("spnPackageMass").value = package.m;
	document.getElementById("txtPackageMass").innerHTML = package.m + " kg";	

	document.getElementById("spnPackageArea").value = package.area;
	document.getElementById("txtPackageArea").innerHTML = package.area + " m^2";	

	document.getElementById("txtSimulationSpeed").innerHTML = "x" + simulationSpeed;		
	document.getElementById("spnSimulationSpeed").value = simulationSpeed;

	document.getElementById("spnDropZonePosition").value = dropZone.x;

}

function dropPackage(){
	if (simulationState == SimulationStateEnum.STARTED && !packageDropped){
		packageDropped = true;
		package.dropTime = elapsedTime;
		package.initX = plane.x;
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
		var dropZone_width = dropZone.width / PIXEL_TO_METER_SCALE;
		if (mouseX > (dropZone_x - dropZone_width / 2) &&
			mouseX < (dropZone_x + dropZone_width / 2) &&
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
		dropZone.x += deltaX * PIXEL_TO_METER_SCALE;
		// Bound it to max and min position
		dropZone.x = Math.min(Math.max(dropZone.x, MIN_DROPZONE_X), MAX_DROPZONE_X);
		document.getElementById("spnDropZonePosition").value = dropZone.x;
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

function lockUI(){
	document.getElementById("spnPlaneSpeed").disabled = true;
	document.getElementById("spnPlaneHeight").disabled = true;
	document.getElementById("spnDropZoneRadius").disabled = true;	
	document.getElementById("spnWindDirection").disabled = true;	
	document.getElementById("spnPlaneRotation").disabled = true;
	document.getElementById("spnPackageMass").disabled = true;
	document.getElementById("spnPackageArea").disabled = true;	
	document.getElementById("chkAirResistance").disabled = true;	
	document.getElementById("spnSimulationSpeed").disabled = true;
	document.getElementById("spnDropZonePosition").disabled = true;

}

function unlockUI(){
	document.getElementById("spnPlaneSpeed").disabled = false;
	document.getElementById("spnPlaneHeight").disabled = false;
	document.getElementById("spnDropZoneRadius").disabled = false;	
	document.getElementById("spnWindDirection").disabled = false;	
	document.getElementById("spnPlaneRotation").disabled = false;
	document.getElementById("spnPackageMass").disabled = false;
	document.getElementById("spnPackageArea").disabled = false;
	document.getElementById("chkAirResistance").disabled = false;
	document.getElementById("spnSimulationSpeed").disabled = false;
	document.getElementById("spnDropZonePosition").disabled = false;
}



