var $ = require('jquery');
var Q = require('q');
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

  function animatePop() {
    var top = type * sprite.height();
    console.log("top", top);
    // sprite.css( "background-position", "-50px -" + top + "px" );
    sprite.css("transform", "rotate(" + (Math.random() * 360) + "deg)");

    setTimeout(function(){
      sprite.css({"background-position": "-50px -" + top + "px", "tranform":  "rotate(" + (Math.random() * 360) + "deg)"});
    }, 200);
    setTimeout(function(){
      sprite.css({"background-position": "-100px -" + top + "px", "tranform":  "rotate(" + (Math.random() * 360) + "deg)"});
    }, 300);
    setTimeout(function(){
      sprite.css({"background-position": "-150px -" + top + "px", "tranform":  "rotate(" + (Math.random() * 360) + "deg)"});
    }, 400);
    console.log("top", top);
    // setTimeout(function(){
    //   sprite.remove();
    // }, 200);
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
    console.log('bubble destroyed');
    sprite.remove();
    sprite = null;
  }


  bubble.getSprite      = getSprite;
  bubble.position       = position;
  bubble.animate        = animate;
  bubble.animatePop     = animatePop;
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
