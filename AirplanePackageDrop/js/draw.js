
function draw() {

	var canvas = document.getElementById("simulationBox");
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, canvas.width, canvas.height);

	// Draw plane
	drawPlane(canvas,context);

	// Draw package
	if (packageDropped){
		drawPackage(context);
	}

	// Draw Dropzone
	drawDropZone(context);

	drawHUD(context);

	context.beginPath();

	context.moveTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO + 40, COORDINATE_SYSTEM_Y_ZERO);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO + 35, COORDINATE_SYSTEM_Y_ZERO + 5);
	context.moveTo(COORDINATE_SYSTEM_X_ZERO + 40, COORDINATE_SYSTEM_Y_ZERO);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO + 35, COORDINATE_SYSTEM_Y_ZERO - 5);
	
	context.moveTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO - 40);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO + 5, COORDINATE_SYSTEM_Y_ZERO - 35);
	context.moveTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO - 40);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO - 5, COORDINATE_SYSTEM_Y_ZERO - 35);
	
	context.strokeStyle = "black";
    context.stroke();

    context.font = "14px Garamond";
    context.fillStyle = "black";
	context.fillText("(0,0)",COORDINATE_SYSTEM_X_ZERO - 15, COORDINATE_SYSTEM_Y_ZERO + 18);
	context.fillText("x",COORDINATE_SYSTEM_X_ZERO + 35, COORDINATE_SYSTEM_Y_ZERO + 18);
	context.fillText("y",COORDINATE_SYSTEM_X_ZERO - 18, COORDINATE_SYSTEM_Y_ZERO - 25);

	context.closePath();
}

// position (0,0) is on the lower left for the simulation, but in the top left corner for the canvas.
function toCanvasCoordinates(x, y){
	var canvasCoords = {
		x : 0,
		y : 0
	}
	canvasCoords.x = x * PIXEL_TO_METER_SCALE + COORDINATE_SYSTEM_X_ZERO;
	canvasCoords.y = -y * PIXEL_TO_METER_SCALE + COORDINATE_SYSTEM_Y_ZERO;
	return canvasCoords;
}

function drawDropZone(context){
	var canvasCoords = toCanvasCoordinates(dropZone.x, dropZone.y);
	var dropZone_y = canvasCoords.y;
	var dropZone_x = canvasCoords.x;

	var dropZone_width = dropZone.width * PIXEL_TO_METER_SCALE;
	
	context.beginPath();	
    context.moveTo(dropZone_x - (dropZone_width / 2), dropZone_y);    
	context.lineTo(dropZone_x + (dropZone_width / 2), dropZone_y);
	    
	context.moveTo(dropZone_x, dropZone_y - 5);
	context.lineTo(dropZone_x, dropZone_y + 5);
    
    context.moveTo(dropZone_x - (dropZone_width / 2), dropZone_y - 5);
	context.lineTo(dropZone_x - (dropZone_width / 2), dropZone_y + 5);
    
    context.moveTo(dropZone_x + (dropZone_width / 2), dropZone_y - 5);
	context.lineTo(dropZone_x + (dropZone_width / 2), dropZone_y + 5);
    		
    context.strokeStyle = "orange";
    context.stroke();
	
    context.font = "14px Garamond";
    context.fillStyle = "#994d00";
	context.fillText("Dropzone",dropZone_x - 23,dropZone_y + 20);

	context.closePath();
}

function drawPackage(context){
	var canvasCoords = toCanvasCoordinates(package.x, package.y);

	var package_x = canvasCoords.x;
	var package_y = canvasCoords.y;

	context.beginPath();
	context.rect(package_x - PACKAGE_SIDE / 2, package_y - PACKAGE_SIDE / 2, PACKAGE_SIDE, PACKAGE_SIDE);
	
	context.moveTo(package_x - PACKAGE_SIDE / 2, package_y - PACKAGE_SIDE / 2);
	context.lineTo(package_x + PACKAGE_SIDE / 2, package_y + PACKAGE_SIDE / 2);
	
	context.moveTo(package_x + PACKAGE_SIDE / 2, package_y - PACKAGE_SIDE / 2);
	context.lineTo(package_x - PACKAGE_SIDE / 2, package_y + PACKAGE_SIDE / 2);

	// Draw trail of package
	var steps = 0;
	var timeSinceDrop = (elapsedTime - package.dropTime) / 1000.0 ;
	while(steps < timeSinceDrop){
		var lineStart = getPackagePosition(steps);
		steps += 0.05;
		var lineFinish = getPackagePosition(steps);
		steps += 0.1;
		var lineStartC = toCanvasCoordinates(lineStart.x, lineStart.y);
		var lineFinishC = toCanvasCoordinates(lineFinish.x, lineFinish.y);
		context.moveTo(lineStartC.x, lineStartC.y);
		context.lineTo(lineFinishC.x, lineFinishC.y);
		console.log(lineStart);

	}

	context.strokeStyle = "#86592d";
	context.stroke();
	context.closePath();	
}

function drawPlane(canvas, context){
	var canvasCoords = toCanvasCoordinates(plane.x, plane.y);

	var plane_x = canvasCoords.x;
	var plane_y = canvasCoords.y;

	context.save();
	context.translate(plane_x, plane_y);
	context.rotate(degreesToRadians(plane.rotation));
	context.drawImage(plane.image, 0, 0, plane.image.width, plane.image.height, -plane.getWidth() / 2 , -plane.getHeight() / 2, plane.getWidth(), plane.getHeight());
	context.restore();
}

function drawHUD(context){
	var elapsedTimeInSeconds = Math.round((elapsedTime) / 10.0) / 100;
	var plane_x = Math.round(plane.x * 100.0) / 100;
	var plane_y = Math.round(plane.y * 100.0) / 100;

	context.beginPath();
    context.font = "16px Garamond";
    context.fillStyle = "black";
	context.fillText("t: " + elapsedTimeInSeconds + "s" ,1200,30);
	context.fillText("x_a(t): " + plane_x + "m" ,1200,47);
	context.fillText("y_a(t): " + plane_y + "m" ,1200,64);

	if (packageDropped){
		var timeSinceDrop = Math.round((elapsedTime - package.dropTime) / 10.0) / 100.0; 
		var package_x = Math.round(package.x * 100.0) / 100;
		var package_y = Math.round(package.y * 100.0) / 100;

		context.fillText("s: " + timeSinceDrop + "m" ,1200,90);
		context.fillText("x_p(s): " + package_x + "m" ,1200,107);
		context.fillText("y_p(s): " + package_y + "m" ,1200,124);		
	}

	if (simulationState == SimulationStateEnum.FINISHED){
		if (landedInDropZone){
			context.fillText("SIMULATION FINISHED: In Dropzone!" ,600,460);
		}else{
			context.fillText("SIMULATION FINISHED: Not in Dropzone" ,600,460);
		}
	}

	context.stroke();
	context.closePath;
}



