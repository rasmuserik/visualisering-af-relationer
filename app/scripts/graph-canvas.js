(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  // vector math, - maybe move this into util
  var xy = {};

  xy.mul = function(p1, p2) {
    return {
      x: p1.x * p2.x,
      y: p1.y * p2.y,
    };
  };
  xy.add = function(p1, p2) {
    return {
      x: p1.x + p2.x,
      y: p1.y + p2.y,
    };
  };
  xy.sub = function(p1, p2) {
    return {
      x: p1.x - p2.x,
      y: p1.y - p2.y,
    };
  };
  xy.scale = function(p, a) {
    return {
      x: p.x * a,
      y: p.y * a,
    };
  };
  xy.inv = function(p) {
    return {
      x: 1 / p.x,
      y: 1 / p.y
    };
  };

  // transformations to/from canvas coordinates
  relvis.offset = {
    x: 123,
    y: 456
  }; // odd start offset for testing
  relvis.scale = {
    x: 7,
    y: 8
  }; // odd start offset for testing
  relvis.toCanvasCoord = function(p) {
    return xy.mul(xy.sub(p, relvis.offset), relvis.scale);
  };
  relvis.toGraphCoord = function(p) {
    return xy.add(xy.mul(p, xy.inv(relvis.scale)), relvis.offset);
  };

  function drawGraph() { //{{{1
    if (!relvis.nodes || !relvis.overlayVisible) {
      return;
    }

    var visibleNodes = relvis.nodes.filter(function(o) {
      return o.visible;
    });

    // get and clear drawing context
    var canvas = relvis.canvas;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Find coordinate transformation
    var margin = 0.05;
    var boundaries = relvis.findBoundaries(visibleNodes, ['x', 'y']);

    relvis.offset = xy.sub(boundaries.min,
      xy.scale(boundaries.range, margin));
    relvis.scale = xy.scale(boundaries.range, 1 + 2 * margin);
    relvis.scale = xy.mul({
        x: canvas.width,
        y: canvas.height
      },
      xy.inv(relvis.scale));

    // Calculate view coordinates for all points
    visibleNodes.forEach(function(node) {
      var p = relvis.toCanvasCoord(node);
      node.vx = p.x;
      node.vy = p.y;
    });
    relvis.nearestPoints(visibleNodes, 'vx', 'vy');

    // Draw edges
    var visibleEdges = relvis.edges.filter(function(e) {
      return e.source.visible && e.target.visible;
    });

    visibleEdges.forEach(function(e) {
      relvis.drawEdge(ctx, e.source, e.target,
        e.source.vx, e.source.vy,
        e.target.vx, e.target.vy);
    });

    // drawNodes
    for (var i = 0; i < visibleNodes.length; ++i) {
      var node = visibleNodes[i];
      // size should be 1/2 distance to nearest (or if neares is smaller, a bit larger, which is why we make the size of the nearest node factor in)
      var size = node.nearestDist * 0.7 - 0.30 * node.nearestNode.nearestDist; // * Math.SQRT1_2;
      var w = size * 2;
      var x = node.vx - w / 2;
      var h = size * 2 / relvis.visualObjectRatio;
      var y = node.vy - h / 2;

      relvis.drawNode(ctx, node, x, y, w, h);
    }
  }

  relvis.requestRedraw = function() { //{{{1 
    // TODO: throttle this function, and make it async
    drawGraph();
  };

})(); //{{{1
