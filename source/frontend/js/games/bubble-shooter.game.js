$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function buildGame () {

    var game = {};    

    var userBubble;

    function initialize () {
      $(".button_start_game").bind("click", startGame);
    }

    function mouseClickHandler(event){
      var angle = BubbleShoot.UI.getBubbleAngle(userBubble, event);
      var duration = 750;
      var distance = 1000;
      var distX = Math.sin(angle) * distance;
      var distY = Math.cos(angle) * distance;
      var bubbleCoords = BubbleShoot.UI.getBubblePosition(userBubble);
      var coords = {
        x : bubbleCoords.left + distX,
        y : bubbleCoords.top - distY
      };
      BubbleShoot.UI.fireBubble(userBubble, coords, duration);
    }
    
    function createNextUserBubble () {
      var bubble = BubbleShoot.Bubble.create();
      bubble.getSprite().addClass("user_bubble");
      $("#board").append(bubble.getSprite());
      return bubble;
    }

    function startGame() {
      $(".button_start_game").unbind("click");
      BubbleShoot.UI.hideDialog();
      userBubble = createNextUserBubble();

      // Create the game board
      game.board = BubbleShoot.Board.buildBoard();
      BubbleShoot.UI.drawBoard(game.board);
      
      $("#game").bind("click", mouseClickHandler);

    }

    game.initialize = initialize;

    return game;
  
  }

  BubbleShoot.Game = buildGame();

  BubbleShoot.Game.initialize();
});