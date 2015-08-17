$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function buildGame () {

    var game = {};    

    var userBubble;

    function initialize () {
      $(".button_start_game").bind("click", startGame);
    }
    
    function createNextUserBubble () {
      var bubble = BubbleShoot.Bubble.create();
      bubble.getSprite().addClass("user_bubble");
      $("#board").append(bubble.getSprite());
      return bubble;
    }

    function startGame() {
      $(".but_start_game").unbind("click");
      BubbleShoot.UI.hideDialog();
      userBubble = createNextUserBubble();
    }

    game.initialize = initialize;

    return game;
  
  }

  BubbleShoot.Game = buildGame();

  BubbleShoot.Game.initialize();
});