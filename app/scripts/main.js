  $(function() {
    'use strict';
    function showGraph() {
      var canvasOverlay = new relvis.CanvasOverlay();
      canvasOverlay.show();
      relvis.createGraph( function(graph) { relvis.drawGraph(canvasOverlay.canvas, graph); });
    }

    // button on sample page pops up visualisation
    $('#relvis-button').click(showGraph);

    // show visualisation on load if we have #relvis hash
    if (location.hash === '#relvis') {
      showGraph();
    }
  });
