$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function buildGame () {

    var game = {};    

    function initialize () {
      $(".button_start_game").bind("click", startGame);
    }
    
    function startGame() {
      $(".but_start_game").unbind("click");
      BubbleShoot.UI.hideDialog();
    }

    game.initialize = initialize;

    return game;
  
  }

  BubbleShoot.Game = buildGame();

  BubbleShoot.Game.initialize();
});