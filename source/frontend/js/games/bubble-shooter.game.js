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

  var firedBubble;
  var firedBubbleVelocity;

  var arrow = $('#arrow');

  function initialize() {
    $(".button_start_game").on("click", startGame);
  }

  function animate(velocity) {
    debug('animate start');

    firedBubble = userBubble;

    var start = 0;

    var leftOverTime = 0;

    var timeStep = 10;

    function loop(timestamp) {

      if(!start) {
        start = timestamp;
      }

      var delta = timestamp - start;

      debug('loop, delta ' + delta);

      leftOverTime += delta;

      var stepCount = Math.floor(leftOverTime / timeStep);

      leftOverTime -= ( stepCount * timeStep );

      for( var i = 0; i < stepCount; i++) {
        firedBubble.move(velocity);
      }

      if (firedBubble.position().top < 0) {
        firedBubble.destroy();
        firedBubble = null;
        userBubbleCount--;
        userBubble = createNextUserBubble();
      }
      else {
        window.requestAnimationFrame(loop);
      }
    }

    window.requestAnimationFrame(loop);
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

    mouseVector.normalize();

    animate(mouseVector);
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

  function createNextUserBubble() {
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