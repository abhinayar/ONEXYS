
var plane  = {
	initX : 50,
	initY : 50, 
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
	y : 0
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

var lastFrameTimeMs = 0;
var elapsedTime = 0;
var landedInDropZone = false;
var windSpeed = 0;

function update(delta) {
	var elapsedTimeInSeconds = (elapsedTime) / 1000.0;
	plane.xSpeed = plane.speed * Math.cos(degreesToRadians(plane.rotation));
	plane.ySpeed = -1 * plane.speed * Math.sin(degreesToRadians(plane.rotation)); 
	plane.x = plane.initX + plane.xSpeed * elapsedTimeInSeconds;
	plane.y = plane.initY + plane.ySpeed * elapsedTimeInSeconds; 

	if (packageDropped){
		var timeSinceDrop = (elapsedTime - package.dropTime) / 1000.0; 
		var packagePosition = getPackagePosition(timeSinceDrop);
		package.x = packagePosition.x;
		package.y =	packagePosition.y;

		if (package.y < dropZone.y){
			simulationState = SimulationStateEnum.FINISHED;
			// Collision detection with dropZone
			console.log(package.x + "   "  + (dropZone.x - dropZone.width / 2) + "   " + ((dropZone.x + dropZone.width / 2)) );
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
		elapsedTime += delta;
		update(delta);
	}

    draw();
    requestAnimationFrame(mainLoop);
}
 
requestAnimationFrame(mainLoop);

function degreesToRadians(angle){
	return angle * Math.PI / 180;
}

function getPackagePosition(time){
	var position = {
		x : 0,
		y : 0
	}
	position.x = package.initX + (package.initXSpeed + windSpeed) * time;
	position.y = package.initY + package.initYSpeed * time + (g * time * time / 2);
	return position;
}
