(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  //{{{1 d3 force layout experiment
  //{{{2 create force graph
  function createGraph(canvas) {
    var graph, force;
    graph = relvis.getActiveGraph();
    force = window.d3.layout.force()
      .size([window.innerWidth, window.innerHeight])
      .nodes(graph.nodes)
      .links(graph.edges)
      .charge(-120)
      .linkDistance(30)
      .start();
    //.gravity(1)

    force.on('tick', function() {
      var i;

      var visibleNodes = graph.nodes.filter(function(o) {
        return o.visible;
      });
      var boundaries = relvis.findBoundaries(visibleNodes, ['x', 'y']);
      graph.nodes.forEach(function(node) {
        if (node.fixedPosition) {
          node.x = node.fixedPosition.x * boundaries.range.x + boundaries.min.x;
          node.y = node.fixedPosition.y * boundaries.range.y + boundaries.min.y;
        }
      });

      relvis.drawGraph(canvas, graph);
    });
  }

  //{{{1 code for testing/demo
  $(function() {
    // button on sample page pops up visualisation
    $('#relvis-button').click(function() {
      var canvasOverlay = window.canvasOverlay = new relvis.CanvasOverlay();
      canvasOverlay.show();
      createGraph(canvasOverlay.canvas);
    });

    // show visualisation on load if we have #relvis hash
    if (location.hash === '#relvis') {
      var canvasOverlay = window.canvasOverlay = new relvis.CanvasOverlay();
      canvasOverlay.show();
      createGraph(canvasOverlay.canvas);
    }
  });
})();
