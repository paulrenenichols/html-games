var $ = require('jquery');
var ui = require('./bubble-shooter.ui.js');
var createBubble = require('./bubble-shooter.bubble.js').create;
var board = require('./bubble-shooter.board.js');
var collisionDetector = require('./bubble-shooter.collision.js');
var kaboom = require('./jquery.kaboom.js');

function buildGame () {

  var game = {};    

  var userBubble;
  var userBubbleCount;
  var MAX_USER_BUBBLES = 70;

  function initialize () {
    $(".button_start_game").bind("click", startGame);
  }

  function mouseClickHandler(event){
    var angle = ui.getBubbleAngle(userBubble, event);
    var maxDuration = 2000;
    var duration = maxDuration;
    var distance = 1000;
    var collision = collisionDetector.findIntersection(userBubble, game.board, angle);
    var coords;
    if(collision) {
      console.log('collision', collision);
      coords = collision.coords;
      duration = Math.round(maxDuration * collision.distanceToCollision / distance);
      console.log('collision.distanceToCollision', collision.distanceToCollision);
      console.log('duration', duration);
      console.log('distance', distance);
      game.board.addBubble(userBubble, coords);
      var group = game.board.getGroup(userBubble, {});
      if(group.list.length >= 3){
        popBubbles(group.list, duration);

        var orphans = game.board.findOrphans();

        $.each(orphans, function(){
          console.log("orphan", this);
        })
        var delay = duration + 1000 + 35 * group.list.length;
        dropBubbles(orphans, delay);

      }
    }
    else {
      var distX = Math.sin(angle) * distance;
      var distY = Math.cos(angle) * distance;
      var bubbleCoords = ui.getBubblePosition(userBubble);
      coords = {
        x : bubbleCoords.left + distX,
        y : bubbleCoords.top - distY
      };
    }
    ui.fireBubble(userBubble, coords, duration);
    userBubble = createNextUserBubble();
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
    $(".button_start_game").unbind("click");
    ui.hideDialog();
    userBubbleCount = MAX_USER_BUBBLES;
    userBubble = createNextUserBubble();


    // Create the game board
    game.board = board.buildBoard();
    ui.drawBoard(game.board);
    
    $("#game").bind("click", mouseClickHandler);

  }

  game.initialize = initialize;

  return game;

}

module.exports = buildGame;