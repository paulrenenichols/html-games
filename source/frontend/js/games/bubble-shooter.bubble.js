var $ = require('jquery');
var ui = require('./bubble-shooter.ui.js');

function create (row, column, type) {

  var bubble = {};

  if(type === undefined){
    type = Math.floor(Math.random() * 4);
  }

  var sprite = $(document.createElement("div"));
  sprite.addClass("bubble");
  sprite.addClass("bubble_" + type);

  function getSprite() {
    return sprite;
  }

  function position () {
    return sprite.position();
  }

  function animate() {
    return sprite.animate.apply(sprite, arguments);
  }

  function getType() {
    return type;
  }

  function getRow() {
    return row;
  }

  function getColumn() {
    return column;
  }

  function setRow(newRow) {
    row = newRow;
  }

  function setColumn(newColumn) {
    column = newColumn;
  }

  function getCoordinates(){
    var coordinates = {
      left: getColumn() * ui.BUBBLE_DIAMETER/2  + ui.BUBBLE_DIAMETER/2,
      top:  getRow()    * ui.ROW_HEIGHT     + ui.BUBBLE_DIAMETER/2
    };
    return coordinates;
  }

  function destroy() {
    console.log('bubble destroy');
    sprite.remove();
    sprite = null;
  }


  bubble.getSprite      = getSprite;
  bubble.position       = position;
  bubble.animate        = animate;
  bubble.getType        = getType;
  bubble.getRow         = getRow;
  bubble.getColumn      = getColumn;
  bubble.setRow         = setRow;
  bubble.setColumn      = setColumn;
  bubble.getCoordinates = getCoordinates;
  bubble.destroy        = destroy;

  return bubble;
}

module.exports = {
  create: create
};
