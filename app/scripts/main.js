$(function() {
  'use strict';

  function unsupportedPlatform() {
    // check that canvas is supported
    var elem = document.createElement('canvas');
    if(! elem.getContext) {
      return 'Missing canvas support';
    }

    // check that android version > 2.1 due to canvas bugs in version 2.1 and earlier 
    var android = navigator.userAgent.match(/android.*?([12]\.[0-9])/i);
    if(android && (+android[1] < 2.2) &&
      !navigator.userAgent.match(/(firefox|chrome|opera)/i)) {
        return 'Buggy android version:\n' + navigator.userAgent;
    }

    // everything is ok
    return false;
  }

  function showGraph() {
    if(unsupportedPlatform()) {
      window.alert('Warning unsupported platform.\n' + unsupportedPlatform());
    }
    var relvis = window.relvis;
    relvis.createGraph();
    relvis.layoutGraph();
    relvis.showCanvasOverlay();
  }

  // button on sample page pops up visualisation
  $('#relvis-button').click(showGraph);

  // show visualisation on load if we have #relvis hash
  if (location.hash === '#relvis') {
    showGraph();
  }
});
