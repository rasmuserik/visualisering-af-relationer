(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  //{{{1 d3 force layout experiment
  //{{{2 create force graph
  var margin = 0.05;
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

    var t0 = Date.now();
    force.on('tick', function() {
      relvis.visualObjectRatio = 13 / 8;
      //console.log(Date.now() - t0);
      t0 = Date.now();

      var i;
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      var visibleNodes = graph.nodes.filter(function(o) {
        return o.visible;
      });
      var boundaries = relvis.findBoundaries(visibleNodes, ['x', 'y']);

      graph.nodes.forEach(function(node) {
        if(node.fixedPosition) {
          node.x = node.fixedPosition.x * boundaries.range.x + boundaries.min.x;
          node.y = node.fixedPosition.y * boundaries.range.y + boundaries.min.y;
        }
      });

      visibleNodes.forEach(function(node) {
        var xy = boundaries.zeroOne(node);
        node.vx = (xy.x * (1 - 2 * margin) + margin) * canvas.width;
        node.vy = (xy.y * (1 - 2 * margin) + margin) * canvas.height;
      });

      relvis.nearestPoints(visibleNodes, 'vx', 'vy');

      var visibleEdges = graph.edges.filter(function(e) {
        return e.source.visible && e.target.visible;
      });

      visibleEdges.forEach(function(e) {
        relvis.drawEdge(ctx, e.source, e.target, 
          e.source.vx, e.source.vy, 
          e.target.vx, e.target.vy, 
          window.devicePixelRatio || 1);
      });

      for (i = 0; i < visibleNodes.length; ++i) {
        var node = visibleNodes[i];
        // size should be 1/2 distance to nearest (or if neares is smaller, a bit larger, which is why we make the size of the nearest node factor in)
        var size = node.nearestDist * 0.8 - 0.34 * node.nearestNode.nearestDist; // * Math.SQRT1_2;
        var w = size * 2;
        var x = node.vx - w / 2;
        var h = size * 2 / relvis.visualObjectRatio;
        var y = node.vy - h / 2;

        relvis.drawNode(ctx, node, x, y, w, h, window.devicePixelRatio || 1);
      }
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
