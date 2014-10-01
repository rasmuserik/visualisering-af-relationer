(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  function drawGraph() { //{{{1
    if(!relvis.nodes) {
      return;
    }
    var margin = 0.05;

    var canvas = relvis.canvas;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var visibleNodes = relvis.nodes.filter(function(o) {
      return o.visible;
    });
    var boundaries = relvis.findBoundaries(visibleNodes, ['x', 'y']);

    visibleNodes.forEach(function(node) {
      var xy = boundaries.zeroOne(node);
      node.vx = (xy.x * (1 - 2 * margin) + margin) * canvas.width;
      node.vy = (xy.y * (1 - 2 * margin) + margin) * canvas.height;
    });

    relvis.nearestPoints(visibleNodes, 'vx', 'vy');

    var visibleEdges = relvis.edges.filter(function(e) {
      return e.source.visible && e.target.visible;
    });

    visibleEdges.forEach(function(e) {
      relvis.drawEdge(ctx, e.source, e.target,
        e.source.vx, e.source.vy,
        e.target.vx, e.target.vy,
        window.devicePixelRatio || 1);
    });

    for (var i = 0; i < visibleNodes.length; ++i) {
      var node = visibleNodes[i];
      // size should be 1/2 distance to nearest (or if neares is smaller, a bit larger, which is why we make the size of the nearest node factor in)
      var size = node.nearestDist * 0.7 - 0.30 * node.nearestNode.nearestDist; // * Math.SQRT1_2;
      var w = size * 2;
      var x = node.vx - w / 2;
      var h = size * 2 / relvis.visualObjectRatio;
      var y = node.vy - h / 2;

      relvis.drawNode(ctx, node, x, y, w, h, window.devicePixelRatio || 1);
    }
  };
  relvis.requestRedraw = function() { //{{{1 
    // TODO: throttle this function, and make it async
    if(!this.overlayVisible) {
      return;
    }
    drawGraph();
  };

})(); //{{{1
