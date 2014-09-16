console.log('\'Allo \'Allo!');
$(function() {
  canvasOverlay = new CanvasOverlay();
  canvasOverlay.show();
  $(window).scroll(function(){canvasOverlay.updatePosition()})
});
