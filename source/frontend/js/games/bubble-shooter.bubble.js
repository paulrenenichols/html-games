$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function create (row, column, type) {

    var bubble = {};

    if(type === undefined){
      type = Math.floor(Math.random() * 4);
    }

    var sprite = $(document.createElement("div"));
    sprite.addClass("bubble");
    sprite.addClass("bubble_" + type);

    function getSprite() {
      return sprite;
    }

    function position () {
      return sprite.position();
    }

    function animate(options) {
      return sprite.animate(options);
    }

    function getType() {
      return type;
    }

    function getRow() {
      return row;
    }

    function getColumn() {
      return column;
    }


    bubble.getSprite  = getSprite;
    bubble.position   = position;
    bubble.animate    = animate;
    bubble.getType    = getType;
    bubble.getRow     = getRow;
    bubble.getColumn  = getColumn;

    return bubble;
  }

  BubbleShoot.Bubble        = {};
  BubbleShoot.Bubble.create = create;

});