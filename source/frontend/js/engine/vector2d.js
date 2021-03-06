// # vector2d.js

// **vector2d** is a class that handles 2 dimension vector math.

// **tolerance**
//
// any number that is less than tolerance will be reduced to 0
var tolerance = 0.001;

// **setSmallNumbersToZero()**
//
// This is a private function that helps to convert
// numbers that are below **tolerance** in magnitude
// to 0.
function setSmallNumbersToZero(number) {
  return (Math.abs(number) > tolerance) ? number : 0;
}

// ### vector2d

// **vector2d constructor**
//
// Constructs and returns a new vector object.
//
// There are two valid ways to call `vector2d`
// * `var vector1 = new vector2d(1, 2);
// * `var vector2 = vector2d(1, 2);
function vector2d(x, y) {
  if (!(this instanceof vector2d)) return new vector2d(x, y);

  this.x = setSmallNumbersToZero(x);
  this.y = setSmallNumbersToZero(y);
}

vector2d.tolerance              = tolerance;
vector2d.setSmallNumbersToZero  = setSmallNumbersToZero;

// **prototype initialization**
vector2d.prototype = {};

// **vector2d.magnitude()**
//
// returns the magnitude (length) of the current vector
vector2d.prototype.magnitude = function() {
  return Math.sqrt( (this.x * this.x) + (this.y * this.y) );
};

// **vector2d.scale()**
//
// multiplies all components of the vector by **scalingFactor**,
// which multiplies the vector's magnitude by **scalingFactor** 
// as well.
//
// returns itself for chaining.
vector2d.prototype.scale = function(scalingFactor) {
  scalingFactor = setSmallNumbersToZero(scalingFactor);

  this.x = this.x * scalingFactor;
  this.y = this.y * scalingFactor;

  return this;
};

// **vector2d.normalize()**
//
// set this vector's magnitude to 1.  Returns itself for chaining.
vector2d.prototype.normalize = function() {
  var magnitude = this.magnitude();

  if (magnitude <= tolerance) {
    magnitude = 1;
  }

  return this.scale(1 / magnitude);
};

// **vector2d.reverse()** 
//
// returns vector with the same magnitude (length) as
// the current vector, but in the oposite direction.
vector2d.prototype.reverse = function() {
  this.x = -this.x;
  this.y = -this.y;

  return this;
};

// **vector2d.add()**
//
// adds a vector to the current vector.
// returns itself for chaining.
vector2d.prototype.add = function(vector) {
  this.x = this.x + vector.x;
  this.y = this.y + vector.y;

  return this;
};

// **vector2d.dotProduct()**
//
// returns the dot product of two vectors.
//
// for vectors **u** and **v**, 
// u.dotProduct(v) === u.magnitude() * v.magnitude() * cos(angleBetweenTheVectors).
vector2d.prototype.dotProduct = function(vector) {
  return (this.x * vector.x) + (this.y * vector.y);
};

module.exports = vector2d;