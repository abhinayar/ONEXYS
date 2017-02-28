
function draw() {

	var canvas = document.getElementById("simulationBox");
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, canvas.width, canvas.height);

	drawBackground(context);
	
	// Draw plane
	drawPlane(canvas,context);

	// Draw Dropzone
	drawDropZone(context);

	// Draw package
	if (packageDropped){
		drawPackage(context);
	}


	drawHUD(context);

	
	context.closePath();
}

// position (0,0) is on the lower left for the simulation, but in the top left corner for the canvas.
// X is in meters. Need to find where to draw them
function toCanvasCoordinates(x, y){
	var canvasCoords = {
		x : 0,
		y : 0
	}
	canvasCoords.x = x / PIXEL_TO_METER_SCALE + COORDINATE_SYSTEM_X_ZERO;
	canvasCoords.y = -y / PIXEL_TO_METER_SCALE + COORDINATE_SYSTEM_Y_ZERO;
	return canvasCoords;
}

function drawDropZone(context){
	var canvasCoords = toCanvasCoordinates(dropZone.x, dropZone.y);
	var dropZone_y = canvasCoords.y;
	var dropZone_x = canvasCoords.x;

	var dropZone_width = dropZone.width / PIXEL_TO_METER_SCALE;
	
	context.beginPath();	

	//package_width = package_no_parachute.width / 4;
	//package_height = package_no_parachute.height / 4;
	var dropZoneHeight = dropzone_image.height / 4;
	context.drawImage(dropzone_image, dropZone_x - dropZone_width / 2, dropZone_y - dropZoneHeight + package_no_parachute.height / 16 , dropZone_width, dropZoneHeight );	

	var dropZoneMessageWidth = dropzone_message.width / 4;
	var dropZoneMessageHeight = dropzone_message.height / 4;
	
	context.save();
	context.translate(dropZone_x - dropZoneMessageWidth, dropZone_y - dropZoneMessageHeight);
	context.rotate(0.2);
	context.translate(- dropZone_x + dropZoneMessageWidth, - dropZone_y + dropZoneMessageHeight);
	context.drawImage(dropzone_message, dropZone_x - 60 + dropZone_width * Math.cos(0.2), dropZone_y - dropZoneHeight - 20 - dropZone_width * Math.sin(0.2), dropZoneMessageWidth, dropZoneMessageHeight);	
	context.restore();

	context.closePath();
}

function drawPackage(context){
	var canvasCoords = toCanvasCoordinates(package.x, package.y);

	var package_x = canvasCoords.x;
	var package_y = canvasCoords.y;

	context.beginPath();
	//if (simulationState == SimulationStateEnum.FINISHED){
		package.width = package_no_parachute.width / 4;
		package.height = package_no_parachute.height / 4;
		context.drawImage(package_no_parachute, package_x - package.width/2, package_y - package.height * 0.75, package.width, package.height);	
	//}else{
	//	package.width = package_parachute.width / 4;
	//	package.height = package_parachute.height / 4;
	//	context.drawImage(package_parachute, package_x - package.width/2, package_y - package.height * 0.75, package.width, package.height);		
	//}
	context.stroke();
	context.closePath();

	// Draw trail of package
	var steps = 0;
	var timeSinceDrop = (elapsedTime - package.dropTime) / 1000.0 ;
	while(steps < timeSinceDrop){
		var lineStart = getPackagePosition(steps);
		var lineStartC = toCanvasCoordinates(lineStart.x, lineStart.y);
		if (steps == 0){
			var drop_x_image_width = drop_x_image.width / 10;
			var drop_x_image_height = drop_x_image.height / 10;
			context.drawImage(drop_x_image, lineStartC.x - drop_x_image_width/2, lineStartC.y - drop_x_image_height/2, drop_x_image_width, drop_x_image_height);
		}
		steps += 0.1;		
		context.beginPath();
		context.fillStyle = "red";	
		context.arc(lineStartC.x, lineStartC.y, 0.5, 0, 2 * Math.PI, false);
		context.stroke();
		context.closePath();
	}

	context.lineWidth = 1;
}

function drawPlane(canvas, context){
	var elapsedTimeInSeconds = (elapsedTime) / 1000.0;

	var canvasCoords = toCanvasCoordinates(plane.x, plane.y);

	var plane_x = canvasCoords.x;
	var plane_y = canvasCoords.y;

	context.save();
	context.translate(plane_x, plane_y);
	context.rotate(degreesToRadians(plane.rotation));
	context.drawImage(plane.image, -plane.getWidth() / 2 , -plane.getHeight() / 2, plane.getWidth(), plane.getHeight());
	context.restore();

	// Draw trail of plane
	var steps = 0;
	context.beginPath();
	context.strokeStyle = LINE_COLOR;
	while(steps < elapsedTimeInSeconds){
		var lineStart = getPlanePosition(steps);
		steps += 0.1;
		var lineFinish = getPlanePosition(steps);
		steps += 0.3;
		var lineStartC = toCanvasCoordinates(lineStart.x, lineStart.y);
		var lineFinishC = toCanvasCoordinates(lineFinish.x, lineFinish.y);
		context.moveTo(lineStartC.x, lineStartC.y);
		context.lineTo(lineFinishC.x, lineFinishC.y);
	}
	context.stroke();
	context.closePath();
}

function drawHUD(context){
	var elapsedTimeInSeconds = Math.round((elapsedTime) / 10.0) / 100;
	var plane_x = Math.round(plane.x * 100.0) / 100;
	var plane_y = Math.round(plane.y * 100.0) / 100;

	context.beginPath();
    context.font = "16px Garamond";
   	context.fillStyle = "black";
   	context.textAlign = "left";
	
	context.fillText("t: " + elapsedTimeInSeconds + "s" ,1200,30);
	context.fillText("x_a(t): " + plane_x + "m" ,1200,47);
	context.fillText("y_a(t): " + plane_y + "m" ,1200,64);

	if (packageDropped){
		var timeSinceDrop = Math.round((elapsedTime - package.dropTime) / 10.0) / 100.0; 
		var package_x = Math.round(package.x * 100.0) / 100;
		var package_y = Math.round(package.y * 100.0) / 100;

		context.fillText("s: " + timeSinceDrop + "s" ,1200,90);
		context.fillText("x_p(s): " + package_x + "m" ,1200,107);
		context.fillText("y_p(s): " + package_y + "m" ,1200,124);		
	}

	if (simulationState == SimulationStateEnum.FINISHED){
		if (landedInDropZone){
			context.fillText("SIMULATION FINISHED: In Dropzone!" , 150,400);
		}else{
			context.fillText("SIMULATION FINISHED: Not in Dropzone" ,150,400);
		}
	}

	context.stroke();

    context.font = "14px Garamond";
    context.fillStyle = "black";
    context.textAlign = "center";

	context.moveTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO + context.canvas.width, COORDINATE_SYSTEM_Y_ZERO);

	var metersInWidth = context.canvas.width * PIXEL_TO_METER_SCALE;
	var k;
	for (k = 100; k < metersInWidth; k += 100){
		context.moveTo(COORDINATE_SYSTEM_X_ZERO + (k / PIXEL_TO_METER_SCALE), COORDINATE_SYSTEM_Y_ZERO);
		context.lineTo(COORDINATE_SYSTEM_X_ZERO + (k / PIXEL_TO_METER_SCALE), COORDINATE_SYSTEM_Y_ZERO + 5);
		if (k % 1000 == 0){
			context.fillText((k/1000.0) + "km", COORDINATE_SYSTEM_X_ZERO + (k / PIXEL_TO_METER_SCALE), COORDINATE_SYSTEM_Y_ZERO + 20);
		}
	}

	context.moveTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO);
	context.lineTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO - context.canvas.height);
	
	var metersInHeight = context.canvas.height * PIXEL_TO_METER_SCALE;
	for (k = 100; k < metersInHeight; k += 100){
		context.moveTo(COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO - (k / PIXEL_TO_METER_SCALE));
		context.lineTo(COORDINATE_SYSTEM_X_ZERO - 5, COORDINATE_SYSTEM_Y_ZERO - (k / PIXEL_TO_METER_SCALE));
		if (k % 1000 == 0){
			context.fillText((k/1000.0) + "km", COORDINATE_SYSTEM_X_ZERO - 30 , COORDINATE_SYSTEM_Y_ZERO - (k / PIXEL_TO_METER_SCALE));
		}
	}

	//context.lineTo(COORDINATE_SYSTEM_X_ZERO + 35, COORDINATE_SYSTEM_Y_ZERO + 5);
	//context.moveTo(COORDINATE_SYSTEM_X_ZERO + 40, COORDINATE_SYSTEM_Y_ZERO);
	//context.lineTo(COORDINATE_SYSTEM_X_ZERO + 35, COORDINATE_SYSTEM_Y_ZERO - 5);
	
	
	context.strokeStyle = "black";
    context.stroke();

	context.fillText("(0,0)",COORDINATE_SYSTEM_X_ZERO, COORDINATE_SYSTEM_Y_ZERO + 18);
	context.fillText("x",COORDINATE_SYSTEM_X_ZERO + 35, COORDINATE_SYSTEM_Y_ZERO + 18);
	context.fillText("y",COORDINATE_SYSTEM_X_ZERO - 18, COORDINATE_SYSTEM_Y_ZERO - 25);

	context.closePath();
}



function drawBackground(context){

	var canvasCoords = toCanvasCoordinates(dropZone.x, dropZone.y);
	var dropZone_y = canvasCoords.y;
	var dropZone_x = canvasCoords.x;

	context.beginPath();
	context.fillStyle = "#79e1fe";	
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.drawImage(cloud_image, 50, 50, cloud_image.width / 3, cloud_image.height / 3);
	context.drawImage(cloud_image, 300, 20, cloud_image.width / 2, cloud_image.height / 2);
	context.drawImage(cloud_image, 400, 150, cloud_image.width / 4, cloud_image.height / 4);	
	context.drawImage(cloud_image, 600, 50, cloud_image.width / 2, cloud_image.height / 2);
	context.drawImage(cloud_image, 810, 120, cloud_image.width / 4, cloud_image.height / 4);
	context.drawImage(cloud_image, 1000, 40, cloud_image.width / 3, cloud_image.height / 3);
	context.drawImage(cloud_image, 1100, 150, cloud_image.width / 2, cloud_image.height / 2);

	context.fillStyle = "#ffd39e";
	context.fillRect(0, dropZone_y, context.canvas.width, context.canvas.height - dropZone_y);
	context.closePath();
}

