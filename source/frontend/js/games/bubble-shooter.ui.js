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
