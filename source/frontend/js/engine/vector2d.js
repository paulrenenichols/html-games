
var tolerance = 0.001;

function setSmallNumbersToZero(number) {
  if (Math.abs(number) > tolerance) {
    return number;
  }
  else {
    return 0;
  }
}

function vector2d(x, y) {
  if (!(this instanceof vector2d)) return new vector2d(x, y);

  this.x = x;
  this.y = y;
}

vector2d.prototype = {};

vector2d.prototype.magnitude = function() {
  return Math.sqrt( (this.x * this.x) + (this.y * this.y) );
};

vector2d.prototype.normalize = function() {
  var magnitude = this.magnitude();

  if (magnitude <= tolerance) {
    magnitude = 1;
  }

  var x = setSmallNumbersToZero(this.x / magnitude);
  var y = setSmallNumbersToZero(this.y / magnitude);

  return vector2d(x, y);
};

vector2d.prototype.reverse = function() {
  return vector2d(-this.x, -this.y);
};

vector2d.prototype.add = function(vector) {
  return vector2d(this.x + vector.x, this.y + vector.y);
};

vector2d.prototype.scale = function(scalingFactor) {
  return vector2d(this.x * scalingFactor, this.y * scalingFactor);
};

vector2d.prototype.dotProduct = function(vector) {
  return vector2d(this.x * vector.x, this.y * vector.y);
};

module.exports = vector2d;