(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var createBubble = require('./bubble-shooter.bubble.js').create;
var ui = require('./bubble-shooter.ui.js');
var $ = require('jquery');

function buildBoard () {

  var board = {};    

  var NUM_ROWS = 9;
  var NUM_COLS = 32;


  var rows = createLayout();

  function getRows() { 
    return rows;
  }

  function addBubble(bubble, coords) {
    var rowNum = Math.floor(coords.y / ui.ROW_HEIGHT);
    var colNum = coords.x / ui.BUBBLE_DIAMETER * 2;
    if(rowNum % 2 === 1){
      colNum -= 1;
    }
    colNum = Math.round(colNum/2) * 2;
    if(rowNum % 2 === 0) {
      colNum -= 1;
    }
    if(!rows[rowNum]) {
      rows[rowNum] = [];
    }
    rows[rowNum][colNum] = bubble;
    bubble.setRow(rowNum);
    bubble.setColumn(colNum);
  }

  function getBubble(rowNum, colNum){
    if(!getRows()[rowNum])
      return null;
      return getRows()[rowNum][colNum];
  }

  function getBubbleNeighbors(curRow, curCol){
    var bubbles = [];

    for (var rowNum = curRow -1; rowNum <= curRow + 1; rowNum++){
      for (var colNum = curCol -2; colNum <= curCol + 2; colNum++){
        var bubble = getBubble(rowNum, colNum);
        if(bubble && !(colNum === curCol && rowNum === curRow)){
          bubbles.push(bubble);
        }
      }
    }
    return bubbles;
  }

  function getGroup(bubble, found, differentColor){
    var curRow = bubble.getRow();
    var curCol = bubble.getColumn();

    // console.log(this);
    if(!found[curRow])
      found[curRow] = {};
    if(!found.list)
      found.list = [];
    if(found[curRow][curCol]){
      return found;
    }
    found[curRow][curCol] = bubble;
    found.list.push(bubble);
    var surrounding = getBubbleNeighbors(curRow, curCol);
    // console.log("neighbors of "+ curRow + ", " + curCol + ": ");
    for(var i = 0; i < surrounding.length; i++){
      var neighbor = surrounding[i];

      // console.log("       neighbor " + i + ": " + neighbor.getRow() + ", " + neighbor.getColumn() + ": ");
      if(neighbor.getType() === bubble.getType() || differentColor){
        found = getGroup(neighbor, found, differentColor);
      }
    }
    return found;
  }

  function popBubble(rowNum, colNum) {
    var row = rows[rowNum];
    delete row[colNum];
  }

  function findOrphans() {
    var connected = [];
    var groups = [];
    var i;

    for(i = 0; i < rows.length; i++) {
      connected[i] = [];
    }
    for(i = 0; i < rows[0].length; i++) {
      var bubble = getBubble(0, i);
      if(bubble && !connected[0][i]) {
        var group = getGroup(bubble, {}, true);
        $.each(group.list, function(){
          connected[this.getRow()][this.getColumn()] = true;
        });
      }
    }

    var orphaned = [];
    for(var i = 0; i < rows.length; i++){
      for(var j = 0; j < rows[i].length; j++){
        var bubble = getBubble(i, j);
        if(bubble && !connected[i][j]){
          orphaned.push(bubble);
        }
      }
    }
    return orphaned;
  }

  function createLayout() {
    var rows = [];
    for(var i=0; i<NUM_ROWS; i++){

      var row = [];
      var startCol = (i % 2 === 0) ? 1 : 0;
      for(var j=startCol; j<NUM_COLS; j+=2){
        var bubble = createBubble(i,j);
        row[j] = bubble;
      }
      rows.push(row);
    }
    return rows;
  }

  board.getRows     = getRows;
  board.addBubble   = addBubble;
  board.getGroup    = getGroup;
  board.getBubbleNeighbors = getBubbleNeighbors;
  board.getBubble   = getBubble;
  board.popBubble   = popBubble;
  board.findOrphans = findOrphans;
  return board;

}

module.exports = { 
  buildBoard: buildBoard 
};

},{"./bubble-shooter.bubble.js":2,"./bubble-shooter.ui.js":6,"jquery":"jquery"}],2:[function(require,module,exports){
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

},{"./bubble-shooter.ui.js":6,"jquery":"jquery","q":"q"}],3:[function(require,module,exports){
var ui = require('./bubble-shooter.ui.js');

/*
 *
 *  This function needs clean up.
 *  Better variable names, comments explaining exactly what is going on
 *  algorithmically.
 *
 */

function findIntersection(userBubble, board, angle){

  // Get the rows from the board
  var rows = board.getRows();

  // The collsion we will eventually return
  var collision;

  // The bubble position as returned from the bubble
  var userBubblePosition = userBubble.position();

  // starting coordinates of the bubble to be fired, used for collision detections
  var userBubbleStartingPoint = {
    left : userBubblePosition.left + ui.BUBBLE_DIAMETER/2,
    top : userBubblePosition.top + ui.BUBBLE_DIAMETER/2
  };

  // given the angle, these are the incremental distances 
  // used to calculate the distance between userBubble and another bubble
  var dx = Math.sin(angle);
  var dy = -Math.cos(angle);

  var distanceToCollision;
  var bubbleDestination;

  for(var i=0; i<rows.length; i++) {

    var row = rows[i];
    
    for(var j=0; j<row.length; j++) {

      var bubble = row[j];

      if(bubble) {
       var coords = bubble.getCoordinates();
       var distToBubble = {
        x : userBubbleStartingPoint.left - coords.left,
        y : userBubbleStartingPoint.top - coords.top
      };

      var t = dx * distToBubble.x + dy * distToBubble.y;
      var ex = -t * dx + userBubbleStartingPoint.left;
      var ey = -t * dy + userBubbleStartingPoint.top;
      var distEC = Math.sqrt((ex - coords.left) * (ex - coords.left) +
                             (ey - coords.top) * (ey - coords.top));
      if(distEC < ui.BUBBLE_DIAMETER * 0.75){
        var dt = Math.sqrt(ui.BUBBLE_DIAMETER * ui.BUBBLE_DIAMETER - distEC * distEC);
        var offset1 = {
          x : (t - dt) * dx,
          y : -(t - dt) * dy
        };
        var offset2 = {
          x : (t + dt) * dx,
          y : -(t + dt) * dy
        };
        var distToCollision1 = Math.sqrt(offset1.x * offset1.x +
                                         offset1.y * offset1.y);
        var distToCollision2 = Math.sqrt(offset2.x * offset2.x +
                                         offset2.y * offset2.y);
        if(distToCollision1 < distToCollision2) {
          distanceToCollision = distToCollision1;
          bubbleDestination = {
            x : offset1.x + userBubbleStartingPoint.left,
            y : offset1.y + userBubbleStartingPoint.top
          };
        } 
        else {
          distanceToCollision = distToCollision2;
          bubbleDestination = {
            x : -offset2.x + userBubbleStartingPoint.left,
            y : offset2.y + userBubbleStartingPoint.top
          };
        }

        if(!collision || collision.distanceToCollision>distanceToCollision){
          collision = {
            bubble : bubble,
            distanceToCollision : distanceToCollision,
            coords : bubbleDestination
          };
        }
        }
      }
    }
  }
  return collision;
}

module.exports = {
  findIntersection: findIntersection
};

},{"./bubble-shooter.ui.js":6}],4:[function(require,module,exports){
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
},{"./bubble-shooter.board.js":1,"./bubble-shooter.bubble.js":2,"./bubble-shooter.collision.js":3,"./bubble-shooter.ui.js":6,"./jquery.kaboom.js":7,"jquery":"jquery"}],5:[function(require,module,exports){
var $ = require('jquery');
var game = require('./bubble-shooter.game.js')();

game.initialize();

},{"./bubble-shooter.game.js":4,"jquery":"jquery"}],6:[function(require,module,exports){
var $ = require('jquery');

function buildUI () {

  var ui = {};

  var BUBBLE_DIAMETER = 44;
  var ROW_HEIGHT      = 40;


  function hideDialog () {
    $(".dialog").fadeOut(300);
  }

  function getMousePosition(event) {
    var coordinates = {x : event.pageX, y : event.pageY};
    return coordinates;
  }

  function getBubblePosition(bubble) {
    var bubblePosition = bubble.position();
    bubblePosition.left += BUBBLE_DIAMETER/2;
    bubblePosition.top += BUBBLE_DIAMETER/2;
    return bubblePosition;
  }

  function getBubbleAngle(bubble, event){
    var mousePosition = ui.getMousePosition(event);
    var bubblePosition = ui.getBubblePosition(bubble);
    var gamePosition = $("#game").position();
    var boardLeft = 120;
    var angle = Math.atan((mousePosition.x - bubblePosition.left - boardLeft) / (bubblePosition.top + gamePosition.top - mousePosition.y));
    if(mousePosition.y > bubblePosition.top + gamePosition.top){
      angle += Math.PI;
    }
    return angle;
  }

  function fireBubble(bubble, coordinates, duration){
    bubble.animate(
      {
        left : coordinates.x - BUBBLE_DIAMETER/2,
        top : coordinates.y - BUBBLE_DIAMETER/2
      },
      {
        duration : duration,
        easing : "linear",
        complete: function () {
          console.log('animation complete!');
          if(bubble.getRow() !== null){
            bubble.getSprite().css({
              left : bubble.getCoordinates().left - BUBBLE_DIAMETER/2,
              top : bubble.getCoordinates().top - BUBBLE_DIAMETER/2
            });
          }
        }
      }
    );
  }

  function drawBoard(board){

    var rows = board.getRows();

    var gameArea = $("#board");

    for(var i=0; i<rows.length; i++){

      var row = rows[i];
      for(var j=0; j<row.length; j++){

        var bubble = row[j];
        if(bubble){
          var sprite = bubble.getSprite();
          gameArea.append(sprite);
          var left = j * BUBBLE_DIAMETER/2;
          var top = i * ROW_HEIGHT;
          sprite.css({
            left : left,
            top : top
          });
        }
      }
    }
  }

  function drawUserBubbleCount (numBubbles){
    $("#bubbles_remaining").text(numBubbles);
  }

  ui.hideDialog           = hideDialog;
  ui.getMousePosition     = getMousePosition;
  ui.getBubblePosition    = getBubblePosition;
  ui.getBubbleAngle       = getBubbleAngle;
  ui.fireBubble           = fireBubble;
  ui.drawBoard            = drawBoard;
  ui.drawUserBubbleCount  = drawUserBubbleCount;
  ui.BUBBLE_DIAMETER      = BUBBLE_DIAMETER;
  ui.ROW_HEIGHT           = ROW_HEIGHT;

  return ui;

}

module.exports = buildUI();

},{"jquery":"jquery"}],7:[function(require,module,exports){
var $ = require('jquery');

(function (jQuery) {
	
	var defaults = {
		gravity: 1.3,
		maxY: 850
	};

	var toMove = [];

	jQuery.fn.kaboom = function (settings) {
		var config = $.extend({}, defaults, settings);
		if(toMove.length == 0) {
			setTimeout(moveAll, 80);
		}

		var dx = Math.round(Math.random() * 10) - 5;
		var dy = Math.round(Math.random() * 5) + 5;

		toMove.push({
			elm: this,
			dx: dx,
			dy: dy,
			x: this.position().left,
			y: this.position().top,
			config: config
		});
	};

	var moveAll = function() {
		var frameProportion = 1;
		var stillToMove = [];
		for(var i = 0; i < toMove.length; i++) {
			var obj = toMove[i];
			obj.x += obj.dx * frameProportion;
			obj.y -= obj.dy * frameProportion;
			obj.dy -= obj.config.gravity * frameProportion;

			if(obj.y < obj.config.maxY) {
				obj.elm.css({
					top: Math.round(obj.y),
					left: Math.round(obj.x)
				});

				stillToMove.push(obj);
			}
			else if(obj.config.callback) {
				obj.config.callback();
			}

		}
		toMove = stillToMove;
		if(toMove.length > 0) {
			setTimeout(moveAll, 40);
		}
	}
})($);
},{"jquery":"jquery"}]},{},[5])


//# sourceMappingURL=bubble-shooter.js.map