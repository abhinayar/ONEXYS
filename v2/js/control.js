
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

// HTML Inputs
var spnPlaneRotation = document.getElementById("spnPlaneRotation");
var txtPlaneRotation = document.getElementById("txtPlaneRotation");
var btnStartAndPause = document.getElementById("btnStartAndPause")

var spnWindDirection = document.getElementById("spnWindDirection");
var txtWindDirection = document.getElementById("txtWindDirection");

var spnDropZoneRadius = document.getElementById("spnDropZoneRadius");
var txtDropZoneRadius = document.getElementById("txtDropZoneRadius");

var spnPlaneSpeed = document.getElementById("spnPlaneSpeed");
var txtPlaneSpeed = document.getElementById("txtPlaneSpeed");

var spnPackageMass = document.getElementById("spnPackageMass");
var txtPackageMass = document.getElementById("txtPackageMass");	

var spnPackageArea = document.getElementById("spnPackageArea");
var txtPackageArea = document.getElementById("txtPackageArea");

var spnPlaneHeight = document.getElementById("spnPlaneHeight");
var txtPlaneHeight = document.getElementById("txtPlaneHeight");

var spnDropZonePosition = document.getElementById("spnDropZonePosition");
var txtDropZonePosition = document.getElementById("txtDropZonePosition");

$(document).ready(function(){ 

	var canvas = document.getElementById("simulationBox");
	canvas.width = canvas.width = window.innerWidth - 15;
	canvas.style.display = 'block';

	var spnWidth = (canvas.width - 200);
	spnWidth = spnWidth - (spnWidth%100);
	document.getElementById('spnDropZonePosition').style.width = spnWidth;
	document.getElementById('spnDropZonePosition').max = spnWidth * 4.05;
	MAX_DROPZONE_X = spnWidth * 4.05;

	createInitClouds();
	resetSimulation();
	requestAnimationFrame(mainLoop);
});

function startOrPauseSimulation(){
	switch(simulationState){
		case SimulationStateEnum.STARTED:
			simulationState = SimulationStateEnum.PAUSED;
			btnStartAndPause.innerHTML = "Start";
			break;
		case SimulationStateEnum.STOPPED:
			lockUI();
		case SimulationStateEnum.PAUSED:
			simulationState = SimulationStateEnum.STARTED;
			startTime = lastFrameTimeMs;	
			btnStartAndPause.innerHTML = "Pause";
			break;
	}
}

function changePlaneSpeed(event){
	if (event.target == spnPlaneSpeed)
		plane.speed = parseFloat(spnPlaneSpeed.value);
	if (event.target == txtPlaneSpeed)
		plane.speed = parseFloat(txtPlaneSpeed.value) || 0;
	
	plane.speed = clamp(plane.speed, MIN_PLANE_SPEED, MAX_PLANE_SPEED);

	spnPlaneSpeed.value = plane.speed;
	txtPlaneSpeed.value = plane.speed;
}

function changePlaneHeight(event){
	if (event.target == spnPlaneHeight)
		plane.y = parseInt(spnPlaneHeight.value);
	if (event.target == txtPlaneHeight)
		plane.y = parseInt(txtPlaneHeight.value) || 0;
	
	plane.y = clamp(plane.y, MIN_PLANE_HEIGHT, MAX_PLANE_HEIGHT);

	spnPlaneHeight.value = plane.y;
	txtPlaneHeight.value = plane.y;
	plane.initY = plane.y;
}

function changeDropZoneRadius(event){
	if (event.target == spnDropZoneRadius)
		dropZone.width = parseInt(spnDropZoneRadius.value);
	if (event.target == txtDropZoneRadius){
		dropZone.width = parseInt(txtDropZoneRadius.value) || 0;
	}

	dropZone.width = clamp(dropZone.width, MIN_DROPZONE_WIDTH, MAX_DROPZONE_WIDTH);

	spnDropZoneRadius.value = dropZone.width;
	txtDropZoneRadius.value = dropZone.width;	
}

function changeDropZonePosition(event){
	if (event.target == spnDropZonePosition)
		dropZone.x = parseInt(spnDropZonePosition.value);
	if (event.target == txtDropZonePosition){
		dropZone.x = parseInt(txtDropZonePosition.value) || 0;
	}

	dropZone.x = clamp(dropZone.x, MIN_DROPZONE_X, MAX_DROPZONE_X);

	spnDropZonePosition.value = dropZone.x;
	txtDropZonePosition.value = dropZone.x;
}

function schedulePackageDropTime(){
	scheduledDropTime = parseFloat(document.getElementById("txtPackageDropTime").value) || -1;
	if (scheduledDropTime >= 0){
		document.getElementById("txtPackageDropTime").value = scheduledDropTime;
	}else{
		document.getElementById("txtPackageDropTime").value = "";
	}
}

function changePackageMass(event){
	if (event.target == spnPackageMass)
		package.m = parseInt(spnPackageMass.value);
	if (event.target == txtPackageMass)
		package.m = parseInt(txtPackageMass.value) || 0;

	package.m = clamp(package.m, MIN_PACKAGE_MASS, MAX_PACKAGE_MASS);

	spnPackageMass.value = package.m;
	txtPackageMass.value = package.m;
}

function changePackageArea(event){
	if (event.target == spnPackageArea)
		package.area = parseFloat(spnPackageArea.value);
	if (event.target == txtPackageArea)
		package.area = parseFloat(txtPackageArea.value) || 0;

	package.area = clamp(package.area, MIN_PACKAGE_AREA, MAX_PACKAGE_AREA);

	spnPackageArea.value = package.area;
	txtPackageArea.value = package.area;
}

function changePlaneRotation(event){
	if (event.target == spnPlaneRotation)
		plane.rotation = -1 * parseInt(spnPlaneRotation.value);
	if (event.target == txtPlaneRotation){
		plane.rotation = -1 * parseInt(txtPlaneRotation.value) || 0;
	}
		
	plane.rotation = clamp(plane.rotation, MIN_PLANE_ROTATION, MAX_PLANE_ROTATION);
	spnPlaneRotation.value = -1 * plane.rotation;
	txtPlaneRotation.value = -1 * plane.rotation;
}

function changeWindDirection(event){
	if (event.target == spnWindDirection)
		windSpeed = parseInt(spnWindDirection.value);
	if (event.target == txtWindDirection){
		windSpeed = parseInt(txtWindDirection.value) || 0;
	}
	
	windSpeed = clamp(windSpeed, MIN_WIND_SPEED, MAX_WIND_SPEED);

	spnWindDirection.value = windSpeed;
	txtWindDirection.value = windSpeed;		
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
	document.getElementById("txtPlaneSpeed").value = plane.speed;
	document.getElementById("btnStartAndPause").innerHTML = "Start";

	document.getElementById("spnPlaneHeight").value = plane.y;
	document.getElementById("txtPlaneHeight").value = plane.y;
	plane.initY = plane.y;

	dropZone.width = INITIAL_DROPZONE_RADIUS;
	document.getElementById("spnDropZoneRadius").value = dropZone.width;	
	document.getElementById("txtDropZoneRadius").value = dropZone.width;	

	windSpeed = 0;
	document.getElementById("spnWindDirection").value = windSpeed;	
	document.getElementById("txtWindDirection").value = windSpeed;

	document.getElementById("spnPlaneRotation").value = plane.rotation;
	document.getElementById("txtPlaneRotation").value = plane.rotation;

	document.getElementById("spnPackageMass").value = package.m;
	document.getElementById("txtPackageMass").value = package.m;	

	document.getElementById("spnPackageArea").value = package.area;
	document.getElementById("txtPackageArea").value = package.area;	

	document.getElementById("txtSimulationSpeed").innerHTML = "x" + simulationSpeed;		
	document.getElementById("spnSimulationSpeed").value = simulationSpeed;

	document.getElementById("spnDropZonePosition").value = dropZone.x;
	document.getElementById("txtDropZonePosition").value = dropZone.x;

	scheduledDropTime = -1;
	document.getElementById("txtPackageDropTime").value = "";

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

var mouse_X = 0;
var mouse_Y = 0;

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
			//(mouseX > (plane_x - plane.getWidth() / 2) &&
			//mouseX < (plane_x + plane.getWidth() / 2)  &&
			//mouseY > (plane_y - plane.getHeight() / 2) &&
			//mouseY < (plane_y + plane.getHeight() / 2)){
			(sqrtDist2(plane_x + Math.cos(degreesToRadians(plane.rotation)) * ((plane.getWidth() / 2) - 5) , 
				plane_y + Math.sin(degreesToRadians(plane.rotation)) * ((plane.getWidth() / 2) - 5), 
				mouseX, 
				mouseY) 
					< 20){
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
	
	var canvas = document.getElementById("simulationBox");
	var rect = canvas.getBoundingClientRect();
	mouse_X = event.clientX - rect.left;
	mouse_Y = event.clientY - rect.top;
	
	if (movingDropZone){
		dropZone.x += deltaX * PIXEL_TO_METER_SCALE;
		// Bound it to max and min position
		dropZone.x = Math.min(Math.max(dropZone.x, MIN_DROPZONE_X), MAX_DROPZONE_X);
		document.getElementById("spnDropZonePosition").value = dropZone.x;
		document.getElementById("txtDropZonePosition").value = dropZone.x;
	}else if (movingPlane){
		if (deltaY != 0){
			var rotation = deltaY;
			plane.rotation += rotation;			
			plane.rotation = Math.min(Math.max(plane.rotation, MIN_PLANE_ROTATION), MAX_PLANE_ROTATION);

			txtPlaneRotation.value = (-1 * plane.rotation) ;
			spnPlaneRotation.value = (-1 * plane.rotation) ;
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

	document.getElementById("txtPlaneSpeed").disabled = true;
	document.getElementById("txtPlaneHeight").disabled = true;
	document.getElementById("txtDropZoneRadius").disabled = true;	
	document.getElementById("txtWindDirection").disabled = true;	
	document.getElementById("txtPlaneRotation").disabled = true;
	document.getElementById("txtPackageMass").disabled = true;
	document.getElementById("txtPackageArea").disabled = true;	
	document.getElementById("txtDropZonePosition").disabled = true;
	document.getElementById("txtPackageDropTime").disabled = true;
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

	document.getElementById("txtPlaneSpeed").disabled = false;
	document.getElementById("txtPlaneHeight").disabled = false;
	document.getElementById("txtDropZoneRadius").disabled = false;	
	document.getElementById("txtWindDirection").disabled = false;	
	document.getElementById("txtPlaneRotation").disabled = false;
	document.getElementById("txtPackageMass").disabled = false;
	document.getElementById("txtPackageArea").disabled = false;	
	document.getElementById("txtDropZonePosition").disabled = false;
	document.getElementById("txtPackageDropTime").disabled = false;
}

/* Returns a random with normal distribution, defined by mean and stdev */
function randomNormalDistribution(mean, stdev) {
  return (((Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1))*stdev+mean);
}

/* Returns a random value between minValue and maxValue */
function randomUniformDistribution(minValue, maxValue){
	var intervalSize = maxValue - minValue;
	return (minValue + Math.random() * intervalSize);
}

/* Constraints the value 'value' between the min and max interval */
function clamp(value, min, max){
	return Math.max(Math.min(value,max),min);
}

function constraintToNumbers(event){
	if (event.which < 48 || event.which > 57){ // Accept only numbers
		if (event.which != 45 && event.which != 13 && event.which !=46) // Accept - sign, enter and dot
	        event.preventDefault();
    }
}