(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.d3force = undefined;
  relvis.layoutGraph = relvis.throttle(function() { //{{{1
    var force = relvis.d3force;
    if(!force) {
    // Create forcegraph
    var force = window.d3.layout.force()
      .size([window.innerWidth, window.innerHeight])
      .charge(-120)
      .nodes(relvis.nodes)
      .links(relvis.edges)
      .linkDistance(30);

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
    relvis.d3force = force;
    }
    force.start();
  }, 1000);
})();
