$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot || {};

  function buildGame () {

    var game = {};    

    function initialize () {
      $(".button_start_game").bind("click", startGame);
    };
    
    function startGame() {
    };

    game.initialize = initialize;

    return game;
  
  }

  BubbleShoot.Game = buildGame();

  BubbleShoot.Game.initialize();
});