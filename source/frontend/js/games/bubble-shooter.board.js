var createBubble = require('./bubble-shooter.bubble.js').create;
var ui = require('./bubble-shooter.ui.js');

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

  board.getRows   = getRows;
  board.addBubble = addBubble;

  return board;

}

module.exports = { 
  buildBoard: buildBoard 
};
