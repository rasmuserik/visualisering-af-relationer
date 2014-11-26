(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.d3force = undefined;
  relvis.layoutGraph = relvis.throttle(300, function() { //{{{1
    var force = relvis.d3force;
    if (!force) {
      // Create forcegraph
      force = window.d3.layout.force()
        .size([window.innerWidth, window.innerHeight])
        .charge(-200)
        .gravity(0.5)
        .linkDistance(30);

      // handle each frame
      force.on('tick', function() {
        // make visible fixedPosition-nodes fixed
        var visibleNodes = relvis.nodes.filter(function(o) {
          return o.visible;
        });
        var boundaries = relvis.findBoundaries(visibleNodes);
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
    force
      .nodes(relvis.nodes)
      .links(relvis.edges)
      .start();
  });
})();
