$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function buildUI () {

    var ui = {};

    var bubbleDiameter = 44;

    function initialize() {
    }

    function hideDialog () {
      $(".dialog").fadeOut(300);
    }

    function getMousePosition(event) {
      var coordinates = {x : event.pageX, y : event.pageY};
      return coordinates;
    }

    function getBubblePosition(bubble) {
      var bubblePosition = bubble.position();
      bubblePosition.left += bubbleDiameter/2;
      bubblePosition.top += bubbleDiameter/2;
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
          left : coordinates.x - bubbleDiameter/2,
          top : coordinates.y - bubbleDiameter/2
        },
        {
          duration : duration,
          easing : "linear"
        }
      );
    }

    ui.initialize         = initialize;
    ui.hideDialog         = hideDialog;
    ui.getMousePosition   = getMousePosition;
    ui.getBubblePosition  = getBubblePosition;
    ui.getBubbleAngle     = getBubbleAngle;
    ui.fireBubble         = fireBubble;

    return ui;
  
  }

  BubbleShoot.UI = buildUI();

  BubbleShoot.UI.initialize();
});