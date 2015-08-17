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

    bubble.getSprite = getSprite;

    return bubble;
  }

  BubbleShoot.Bubble        = {};
  BubbleShoot.Bubble.create = create;

});