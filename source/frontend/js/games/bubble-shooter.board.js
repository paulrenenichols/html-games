$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function buildBoard () {

    var board = {};    

    var NUM_ROWS = 9;
    var NUM_COLS = 32;


    var rows = createLayout();

    function getRows() { 
      return rows;
    }

    function createLayout() {
      var rows = [];
      for(var i=0; i<NUM_ROWS; i++){

        var row = [];
        var startCol = (i % 2 == 0) ? 1 : 0;
        for(var j=startCol; j<NUM_COLS; j+=2){
          var bubble = BubbleShoot.Bubble.create(i,j);
          row[j] = bubble;
        };
        rows.push(row);
      };
      return rows;
    }

    board.getRows = getRows

    return board;
  
  }

  BubbleShoot.Board             = {};
  BubbleShoot.Board.buildBoard  = buildBoard;

});