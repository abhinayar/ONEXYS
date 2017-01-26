// pixels
var MIN_DROPZONE_X = 50; // in meters
var MAX_DROPZONE_X = 400;

// pixels
var PACKAGE_SIDE = 16;

// Plane size given as a fraction of original image size
var PLANE_SIZE = 0.2;

// In degrees
var MIN_PLANE_ROTATION = -60;
var MAX_PLANE_ROTATION = 30;

var g = -9.8; // Gravitational constant


// Acts as a zoom (although image sizes do not change)
var PIXEL_TO_METER_SCALE = 4;

// Meters, in canvas coordinates
var STARTING_PLANE_HEIGHT = 50;

// Position of the center of the coordinate system, in pixels, in canvas coordinates.
var COORDINATE_SYSTEM_X_ZERO = 25;
var COORDINATE_SYSTEM_Y_ZERO = 400;

var INITIAL_DROPZONE_RADIUS = 30; // Meters