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

  function getBubble(rowNum, colNum){
    if(!this.getRows()[rowNum])
      return null;
      return this.getRows()[rowNum][colNum];
  }

  function getBubbleNeighbors(curRow, curCol){
    var bubbles = [];

    for (var rowNum = curRow -1; rowNum <= curRow + 1; rowNum++){
      for (var colNum = curCol -2; colNum <= curCol + 2; colNum++){
        var bubble = this.getBubble(rowNum, colNum);
        if(bubble && !(colNum === curCol && rowNum === curRow)){
          bubbles.push(bubble);
        }
      }
    }
    return bubbles;
  }

  function getGroup(bubble, found){
    var curRow = bubble.getRow();
    var curCol = bubble.getColumn();

    console.log(this);
    if(!found[curRow])
      found[curRow] = {};
    if(!found.list)
      found.list = [];
    if(found[curRow][curCol]){
      return found;
    }
    found[curRow][curCol] = bubble;
    found.list.push(bubble);
    var surrounding = this.getBubbleNeighbors(curRow, curCol);
    console.log("neighbors of "+ curRow + ", " + curCol + ": ");
    for(var i = 0; i < surrounding.length; i++){
      var neighbor = surrounding[i];

      console.log("       neighbor " + i + ": " + neighbor.getRow() + ", " + neighbor.getColumn() + ": ");
      if(neighbor.getType() === bubble.getType()){
        found = this.getGroup(neighbor, found);
      }
    }
    return found;
  }

  function popBubble(rowNum, colNum){
    var row = rows[rowNum];
    delete row[colNum];
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

  return board;

}

module.exports = { 
  buildBoard: buildBoard 
};
