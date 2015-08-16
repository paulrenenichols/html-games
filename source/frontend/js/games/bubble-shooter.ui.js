$(document).ready(function () {

  var BubbleShoot = window.BubbleShoot = window.BubbleShoot || {};

  function buildUI () {

    var ui = {};

    function initialize() {
    }

    function hideDialog () {
      $(".dialog").fadeOut(300);
    }

    ui.initialize = initialize;
    ui.hideDialog = hideDialog;

    return ui;
  
  }

  BubbleShoot.UI = buildUI();

  BubbleShoot.UI.initialize();
});