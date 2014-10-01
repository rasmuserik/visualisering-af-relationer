  $(function() {
    'use strict';

    function showGraph() {
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
