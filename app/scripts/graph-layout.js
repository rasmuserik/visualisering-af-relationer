(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.layoutGraph = function layoutGraph() { //{{{1
    // Create forcegraph
    var force = window.d3.layout.force()
      .size([window.innerWidth, window.innerHeight])
      .nodes(relvis.nodes)
      .links(relvis.edges)
      .charge(-120)
      .linkDistance(30)
      .start();

    // handle each frame
    force.on('tick', function() {
      // make visible fixedPosition-nodes fixed
      var visibleNodes = relvis.nodes.filter(function(o) {
        return o.visible;
      });
      var boundaries = relvis.findBoundaries(visibleNodes, ['x', 'y']);
      relvis.nodes.forEach(function(node) {
        if (node.fixedPosition) {
          node.x = node.fixedPosition.x * boundaries.range.x + boundaries.min.x;
          node.y = node.fixedPosition.y * boundaries.range.y + boundaries.min.y;
        }
      });

      //redraw
      relvis.requestRedraw();
    });
  };
})();
