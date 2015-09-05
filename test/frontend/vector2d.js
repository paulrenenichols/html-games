// # vector2d.js unit tests

// use browserify to pull in the vector2d library
var vector2d  = require('../../source/frontend/js/engine/vector2d.js');

// vector2d tests
describe('vector2d', function() {

  var xUnitVector;
  var yUnitVector;

  beforeEach(function () {
    xUnitVector = vector2d(1, 0);
    yUnitVector = vector2d(0, 1);
  });

  describe('vector2d.setSmallNumbersToZero(number)', function() {

    it('should return 4 when it is given 4', function () {
      expect(vector2d.setSmallNumbersToZero(4)).to.equal(4);
    });

    it('should return 0 when it is given a number smaller than vector2d.tolerance', function () {
      expect(vector2d.setSmallNumbersToZero( vector2d.tolerance / 2 )).to.equal(0);
    });

  });

  describe('vector2d constructor', function () {

    describe('tiny x and y values provided', function () {
      var tinyVector;

      beforeEach(function () {
        tinyVector = vector2d(vector2d.tolerance / 2, vector2d.tolerance / 2);
      });

      it('should have an x equal to 0', function () {
        expect(tinyVector.x).to.equal(0);
      });

      it('should have an y equal to 0', function () {
        expect(tinyVector.y).to.equal(0);
      });

      it('should have a magnitude equal to 0', function () {
        expect(tinyVector.magnitude()).to.equal(0);
      });
    });

  });

  describe('x-direction unit vector', function() {

    it('should not be null', function () {
      expect(xUnitVector).to.not.be.null;
    });

    it('should have an x-component equal to 1', function () {
      expect(xUnitVector.x).to.equal(1);
    });

    it('should have an y-component equal to 0', function () {
      expect(xUnitVector.y).to.equal(0);
    });

    it('should have a magnitude equal to 1', function () {
      expect(xUnitVector.magnitude()).to.equal(1);
    });
  });

  describe('y-direction unit vector', function() {

    it('should not be null', function () {
      expect(yUnitVector).to.not.be.null;
    });

    it('should have an x-component equal to 0', function () {
      expect(yUnitVector.x).to.equal(0);
    });

    it('should have an y-component equal to 1', function () {
      expect(yUnitVector.y).to.equal(1);
    });

    it('should have a magnitude equal to 1', function () {
      expect(yUnitVector.magnitude()).to.equal(1);
    });
  });

  describe('magnitude()', function() {

    var vector;

    beforeEach(function () {
      vector = vector2d(3, 4);
    });

    it('a vector with x component of 3 and a y component of 4 should have magnitude of 5 (pythagoras)', function () {
      expect(vector.magnitude()).to.equal(5);
    });
  });

  describe('scale()', function() {

    var vector;

    beforeEach(function () {
      vector = vector2d(3, 4);
    });

    it('scaling a unit vector by 3 should result in a vector with magnitude 3', function () {
      expect(yUnitVector.scale(3).magnitude()).to.equal(3);
    });

    it('scaling a vector by 3 should multiply each component by 3', function () {
      var originalX = vector.x;
      var originalY = vector.y;

      vector.scale(3);

      expect(vector.x).to.equal(originalX * 3);
      expect(vector.y).to.equal(originalY * 3);
    });

    it('scaling a vector by 3 should multiply the magnitude by 3', function () {
      var originalMagnitude = vector.magnitude();

      vector.scale(3);

      expect(vector.magnitude()).to.equal(originalMagnitude * 3);
    });
  });

  describe('normalize()', function() {

    var vector;

    beforeEach(function () {
      vector = vector2d(3, 4);
    });

    it('should make a vector have magnitude equal to 1', function () {
      expect(vector.normalize().magnitude()).to.equal(1);
    });

  });

  describe('reverse()', function() {

    var vector;
    var reversedVector;

    beforeEach(function () {
      vector          = vector2d(3, 4);
      reversedVector  = vector2d(3, 4).reverse();
    });

    it('should not change magnitude', function () {
      expect(reversedVector.magnitude()).to.equal(vector.magnitude());
    });

    it('should flip the sign of it\'s components', function () {
      expect(reversedVector.x).to.equal(-vector.x);
      expect(reversedVector.y).to.equal(-vector.y);
    });

  });

  describe('add()', function() {


    var vector1;
    var vector1copy;
    var vector2;
    var reversedVector;

    beforeEach(function () {
      vector1           = vector2d(3,  4);
      vector2           = vector2d(7, 20);
      vector1copy       = vector2d(3,  4);
      reversedVector    = vector2d(3,  4).reverse();
    });

    describe('adding to vectors', function () {
      it('should have an x component equal to the sum of the two vector\'s x components', function () {
        expect(vector1.add(vector2).x).to.equal(vector1copy.x + vector2.x);
      });

      it('should have an y component equal to the sum of the two vector\'s y components', function () {
        expect(vector1.add(vector2).y).to.equal(vector1copy.y + vector2.y);
      });
    });

    describe('adding a vector to its reverse', function () {
      it('should have a magnitude of zero', function () {
        expect(vector1.add(reversedVector).magnitude()).to.equal(0);
      });

      it('should have x component equal to zero', function () {
        expect(vector1.add(reversedVector).x).to.equal(0);
      });

      it('should have y component equal to zero', function () {
        expect(vector1.add(reversedVector).y).to.equal(0);
      });
    });

  });

  describe('dotProduct()', function() {

    var vector;

    beforeEach(function () {
      vector = vector2d(3, 4);
    });

    describe('with xUnitVector', function () {
      it('should return the x component of the vector', function () {
        expect(vector.dotProduct(xUnitVector)).to.equal(vector.x);
      });
    });

    describe('with yUnitVector', function () {
      it('should return the y component of the vector', function () {
        expect(vector.dotProduct(yUnitVector)).to.equal(vector.y);
      });
    });

  });

});