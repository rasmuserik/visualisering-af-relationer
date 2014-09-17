(function() {
  'use strict';
  console.log('\'Allo \'Allo!');
  $(function() {
    var canvasOverlay = new window.CanvasOverlay();
    canvasOverlay.show();
    $(window).scroll(function() {
      canvasOverlay.updatePosition();
    });
  });
})();
