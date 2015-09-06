var $ = require('jquery');
var ui = require('./bubble-shooter.ui.js');
var createBubble = require('./bubble-shooter.bubble.js').create;

var vector2d = require('vector2d');

var debug = require('./bubble-shooter.debug.js')('bubble-shooter:game');


function buildGame () {

  var game = {};    

  var userBubble;
  var userBubbleCount;
  var MAX_USER_BUBBLES = 70;
  var upUnitVector = vector2d(0, -1);
  var leftUnitVector = vector2d(1, 0);
  var lastMouseVector = vector2d(0, -1);
  var lastMouseAngle = 0;

  var arrow = $('#arrow');

  function initialize () {
    $(".button_start_game").on("click", startGame);
  }

  function getMouseVector(event) {
    var userBubbleCenter = userBubble.center();
    var x = event.clientX - userBubbleCenter.left;
    var y = event.clientY - userBubbleCenter.top;

    var mouseVector = vector2d(x, y);

    return mouseVector;
  }

  function mouseClickHandler(event) {
    debug('mouse click: ', event);

    var mouseVector = getMouseVector(event);

    var angle = upUnitVector.angle(mouseVector);
    var dotProduct = upUnitVector.dotProduct(mouseVector);
    var crossProductMagnitude = upUnitVector.crossProductMagnitude(mouseVector);
    var angleDiff = angle - lastMouseAngle;

    // if (angleDiff > 0) {
    //   arrow.css('transform', 'rotate(' + angleDiff + 'rad) translateY(-60px)');
    // }
    // else if (angle < 0) {
    //   arrow.css('transform', 'rotate(' + (Math.PI *2 - angleDiff) + 'rad) translateY(-60px)');
    // }

    // arrow.css('transform', 'rotate(' + angle + 'rad) translateY(-60px)');

    debug('mouse angle with upUnitVector: ', angle);
    debug('dotProduct with upUnitVector: ', dotProduct);
    debug('crossProductMagnitude with upUnitVector: ', crossProductMagnitude);
    debug('mouseVector: x: ', mouseVector.x, ', y: ', mouseVector.y);
    debug('lastMouseVector: x: ', lastMouseVector.x, ', y: ', lastMouseVector.y);

    lastMouseAngle = angle;
    lastMouseVector = mouseVector;
  }

  function mouseMoveHandler(event) {
    var mouseVector = getMouseVector(event);

    var angle = upUnitVector.angle(mouseVector);

    arrow.css('transform', 'rotate(' + angle + 'rad) translateY(-60px)');
  }
  
  function popBubbles(bubbles, delay) {
    $.each(bubbles, function(){
      
      var bubble = this;
      setTimeout(function(){
        bubble.animatePop();
      }, delay);

      game.board.popBubble(this.getRow(), this.getColumn());
      setTimeout(function(){
        bubble.getSprite().remove();
      }, delay + 900);
      delay += 60;
    }); 
  }

  function dropBubbles(bubbles, delay) {
    $.each(bubbles, function(){
      var bubble = this;

      game.board.popBubble(bubble.getRow(), bubble.getColumn());

      setTimeout(function(){
        bubble.getSprite().kaboom();
      }, delay);
    });
  }

  function createNextUserBubble () {
    var bubble = createBubble();
    bubble.getSprite().addClass("user_bubble");
    $("#board").append(bubble.getSprite());
    ui.drawUserBubbleCount(userBubbleCount);
    userBubbleCount--;
    return bubble;
  }

  function startGame() {
    $(".button_start_game").off("click");
    ui.hideDialog();
    userBubbleCount = MAX_USER_BUBBLES;
    userBubble = createNextUserBubble();

    $("#game").on("click", mouseClickHandler);
    $("body").on("mousemove", mouseMoveHandler);

  }

  game.initialize = initialize;

  return game;

}

module.exports = buildGame;