$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function create () {

    var bubble = {};

    var sprite = $(document.createElement("div"));
    sprite.addClass("bubble");
    sprite.addClass("bubble_0");

    function getSprite() {
      return sprite;
    }

    function position () {
      return sprite.position();
    }

    function animate(options) {
      return sprite.animate(options);
    }

    bubble.getSprite = getSprite;
    bubble.position  = position;
    bubble.animate  = animate;

    return bubble;
  }

  BubbleShoot.Bubble        = {};
  BubbleShoot.Bubble.create = create;

});