// pixels
var MIN_DROPZONE_X = 100; // in meters
var MAX_DROPZONE_X = 4500;

// pixels
var PACKAGE_SIDE = 16;

// Plane size given as a fraction of original image size
var PLANE_SIZE = 0.2;

// In degrees
var MIN_PLANE_ROTATION = -60;
var MAX_PLANE_ROTATION = 60;

// m/s
var MIN_WIND_SPEED = -20;
var MAX_WIND_SPEED = 20;

// m
var MIN_DROPZONE_WIDTH = 100;
var MAX_DROPZONE_WIDTH = 600;

// m/s
var MIN_PLANE_SPEED = 80;
var MAX_PLANE_SPEED = 250;

// kg
var MIN_PACKAGE_MASS = 1;
var MAX_PACKAGE_MASS = 50;

// kg
var MIN_PACKAGE_AREA = 0.1;
var MAX_PACKAGE_AREA = 1;

var MIN_PLANE_HEIGHT = 100;
var MAX_PLANE_HEIGHT = 1500;



var g = 9.8; // Gravitational constant


// Acts as a zoom (although image sizes do not change)
// How many meters per pixel
var PIXEL_TO_METER_SCALE = 4;

// Meters
var STARTING_PLANE_HEIGHT = 1000;

// Position of the center of the coordinate system, in pixels, in canvas coordinates.
var COORDINATE_SYSTEM_X_ZERO = 100;
var COORDINATE_SYSTEM_Y_ZERO = 450;

var INITIAL_DROPZONE_RADIUS = 400; // Meters

var INITIAL_PLANE_SPEED = 200; // m/s

var INITIAL_SIMULATION_SPEED = 1;

// Variables for air resistance
var DEFAULT_PACKAGE_MASS = 20.0; // default value por mass spinner 
var DEFAULT_PACKAGE_AREA = 0.25; // Area of package  0 - 1
var C_d = 2.1; // Drag coeficient
var p = 1; // Density of fluid


// Constant images
var cloud_image = new Image();
cloud_image.src = "images/cloud.svg";
var drop_x_image = new Image();
drop_x_image.src = "images/drop_x.svg";
var package_parachute = new Image();
package_parachute.src = "images/crate_with_para-01.svg";
var package_no_parachute = new Image();
package_no_parachute.src = "images/crate_no_para-01.svg";

var dropzone_image = new Image();
dropzone_image.src = "images/dropzone_rings_4-01.svg";
var dropzone_message = new Image();
dropzone_message.src = "images/dropzone_words.svg";

var plane_hint_image = new Image();
plane_hint_image.src = 'images/rotatePlaneHint.png';

var LINE_COLOR = "red";




