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
