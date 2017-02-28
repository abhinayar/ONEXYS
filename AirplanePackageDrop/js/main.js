
var plane  = {
	initX : 50,
	initY : 500, 
	speed : 0,
	xSpeed : 0,
	ySpeed : 0,
	x : 0,
	y : 0,
	image : new Image(),
	rotation : 0,
	getWidth: function(){ // For image reseizing
		return this.image.width * PLANE_SIZE;
	},
	getHeight: function(){
		return this.image.height * PLANE_SIZE;
	}
}; 

var package = {
	initX : 0,
	initY : 0,
	initXSpeed : 0,
	initYSpeed : 0,
	dropTime : 0,
	x : 0,
	y : 0,
	width : 0,
	height : 0,
	m : DEFAULT_PACKAGE_MASS,
	area : DEFAULT_PACKAGE_AREA
};

var dropZone = {
	x : 0,
	y : 0,
	width : 150,
	// Boundaries for mouse click
	boxWidth: 150,
	boxHeight: 80
};

SimulationStateEnum = {
	STOPPED : 0,
	STARTED : 1,
	PAUSED: 2,
	FINISHED: 3
}

var simulationSpeed = INITIAL_SIMULATION_SPEED;

var lastFrameTimeMs = 0;
var elapsedTime = 0;
var landedInDropZone = false;
var windSpeed = 0;
var airResistance = false;

function update(delta) {
	var elapsedTimeInSeconds = (elapsedTime) / 1000.0;

	plane.xSpeed = plane.speed * Math.cos(degreesToRadians(plane.rotation));
	plane.ySpeed = -1 * plane.speed * Math.sin(degreesToRadians(plane.rotation)); 

	var planePosition = getPlanePosition(elapsedTimeInSeconds);
	plane.x = planePosition.x;
	plane.y = planePosition.y;

	airResistance = document.getElementById("chkAirResistance").checked;	
	
	if (packageDropped){
		var timeSinceDrop = (elapsedTime - package.dropTime) / 1000.0; 
		var packagePosition = getPackagePosition(timeSinceDrop);
		package.x = packagePosition.x;
		package.y =	packagePosition.y;

		if (package.y <= dropZone.y){
			simulationState = SimulationStateEnum.FINISHED;
			// Collision detection with dropZone
			if (package.x < (dropZone.x + dropZone.width / 2) 
				&& package.x > (dropZone.x - dropZone.width / 2)){
				landedInDropZone = true;
			}else{
				landedInDropZone = false;
			}
		}
	}
}

function mainLoop(timestamp) {

	delta = timestamp - lastFrameTimeMs; 
	lastFrameTimeMs = timestamp;

	if (simulationState == SimulationStateEnum.STARTED){
		elapsedTime += simulationSpeed * delta;
		update(delta);
	}

    draw();
    requestAnimationFrame(mainLoop);
}

function degreesToRadians(angle){
	return angle * Math.PI / 180;
}

/*
	Gives package position at time t
*/
function getPackagePosition(time){
	var position = {
		x : 0,
		y : 0
	}

	var k_x = package.area * C_d / 2; 
	var k_y = package.area * C_d / 2; 

	if (airResistance){
		position.x = package.initX + 
					 windSpeed * time +
					 (package.m / k_x) * (package.initXSpeed - windSpeed) * (1 - Math.exp(-1 * (k_x / package.m) * time)); 
		var gm_ky = g * package.m / k_y;
		position.y = package.initY + 
					 - gm_ky * time +
		 			 (package.m / k_y) * (gm_ky + package.initYSpeed) * (1 - Math.exp(- k_y / package.m * time));
	}else{
		position.x = package.initX + (package.initXSpeed + windSpeed) * time;
		position.y = package.initY + package.initYSpeed * time - (g * time * time / 2);
	}
	return position;
}

/*
	Gives plane position at time t
*/
function getPlanePosition(time){
	var position = {
		x : 0,
		y : 0
	}

	position.x = plane.initX + plane.xSpeed * time;
	position.y = plane.initY + plane.ySpeed * time;
	return position;
}


/* 
*  Given a Y value
*
*/
function toCanvasCoords(y){
	return (-1 * y);
}



