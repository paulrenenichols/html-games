$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};
   

  /*
   *
   *  This function needs clean up.
   *  Better variable names, comments explaining exactly what is going on
   *  algorithmically.
   *
   */
  
  function findIntersection(userBubble, board, angle){

    // Get the rows from the board
    var rows = board.getRows();

    // The collsion we will eventually return
    var collision;

    // The bubble position as returned from the bubble
    var userBubblePosition = userBubble.position();

    // starting coordinates of the bubble to be fired, used for collision detections
    var userBubbleStartingPoint = {
      left : userBubblePosition.left + BubbleShoot.UI.BUBBLE_DIAMETER/2,
      top : userBubblePosition.top + BubbleShoot.UI.BUBBLE_DIAMETER/2
    };

    // given the angle, these are the incremental distances 
    // used to calculate the distance between userBubble and another bubble
    var dx = Math.sin(angle);
    var dy = -Math.cos(angle);

    var distanceToCollision;
    var bubbleDestination;

    for(var i=0; i<rows.length; i++) {

      var row = rows[i];
      
      for(var j=0; j<row.length; j++) {

        var bubble = row[j];

        if(bubble) {
         var coords = bubble.getCoordinates();
         var distToBubble = {
          x : userBubbleStartingPoint.left - coords.left,
          y : userBubbleStartingPoint.top - coords.top
        };

        var t = dx * distToBubble.x + dy * distToBubble.y;
        var ex = -t * dx + userBubbleStartingPoint.left;
        var ey = -t * dy + userBubbleStartingPoint.top;
        var distEC = Math.sqrt((ex - coords.left) * (ex - coords.left) +
                               (ey - coords.top) * (ey - coords.top));
        if(distEC<BubbleShoot.UI.BUBBLE_DIAMETER * 0.75){
          var dt = Math.sqrt(BubbleShoot.UI.BUBBLE_DIAMETER * BubbleShoot.
                             UI.BUBBLE_DIAMETER - distEC * distEC);
          var offset1 = {
            x : (t - dt) * dx,
            y : -(t - dt) * dy
          };
          var offset2 = {
            x : (t + dt) * dx,
            y : -(t + dt) * dy
          };
          var distToCollision1 = Math.sqrt(offset1.x * offset1.x +
                                           offset1.y * offset1.y);
          var distToCollision2 = Math.sqrt(offset2.x * offset2.x +
                                           offset2.y * offset2.y);
          if(distToCollision1 < distToCollision2) {
            distanceToCollision = distToCollision1;
            bubbleDestination = {
              x : offset1.x + userBubbleStartingPoint.left,
              y : offset1.y + userBubbleStartingPoint.top
            };
          } 
          else {
            distanceToCollision = distToCollision2;
            bubbleDestination = {
              x : -offset2.x + userBubbleStartingPoint.left,
              y : offset2.y + userBubbleStartingPoint.top
            };
          }

          if(!collision || collision.distanceToCollision>distanceToCollision){
            collision = {
              bubble : bubble,
              distanceToCollision : distanceToCollision,
              coords : bubbleDestination
            };
          }
          }
        }
      }
    }
    
    return collision;
  }

  BubbleShoot.CollisionDetector                   = {};
  BubbleShoot.CollisionDetector.findIntersection  = findIntersection;

});