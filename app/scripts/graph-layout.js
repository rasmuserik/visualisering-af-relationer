(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.createGraph = function createGraph(update) {
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

      update(graph);
    });
  };
})();
