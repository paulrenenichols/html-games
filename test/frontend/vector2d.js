var vector2d  = require('../../source/frontend/js/engine/vector2d.js');


describe('vector2d', function() {

  var unitVectorX = vector2d(1, 0);
  // var unitVectorY = vector2d(0, 1);
  // var unitVector = vector2d(1, 1).normalize();

  describe('constructing a unit X vector', function() {

    it('should not be null', function () {
      expect(unitVectorX).to.not.be.null;
    });

    it('should have an x-component equal to 1', function () {
      expect(unitVectorX.x).to.equal(1);
    });

    it('should have an y-component equal to 0', function () {
      expect(unitVectorX.y).to.equal(0);
    });

    it('should have a magnitude equal to 1', function () {
      expect(unitVectorX.magnitude()).to.equal(1);
    });
  });
});