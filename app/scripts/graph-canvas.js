(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  var measureCache = {};

  relvis.textLayout = function textLayout(ctx, str, width, size) { //{{{1
    window.ctx = ctx;
    function measure(str) {
      var t = size + ',' + str;
      return (measureCache[t] = (measureCache[t] || ctx.measureText(str).width));
    }
    var spacing = measure(' ');
    var words = str.split(' ');
    var lengths = words.map(measure);
    var lines = [];
    var line = [];
    var linePos = 0;
    for (var i = 0; i < words.length; ++i) {
      if (linePos > 0 && linePos + lengths[i] > width) {
        lines.push({
          str: line.join(' '),
          len: linePos
        });
        line = [];
        linePos = 0;
      }
      line.push(words[i]);
      linePos += lengths[i] + spacing;
    }
    lines.push({
      str: line.join(' '),
      len: linePos
    });
    return lines;
  };

  relvis.writeBox = function writeBox(ctx, str, x, y, w, h) { //{{{1
    var size = 60;
    var lines, i, maxLen;
    do {
      size = size * 0.9 | 0;
      ctx.font = size + 'px sans-serif';
      lines = relvis.textLayout(ctx, str, w, size);
      maxLen = 0;
      for (i = 0; i < lines.length; ++i) {
        maxLen = Math.max(maxLen, lines[i].len);
      }
    } while (size > 13 && (maxLen > w || lines.length * size > h));

    for (i = 0; i < lines.length; ++i) {
      if (size * (i + 1) < h) {
        ctx.fillText(lines[i].str, x, y + size * (i + 1));
      }
    }
  };

  relvis.drawGraph = function drawGraph(canvas, graph) { //{{{1
    var margin = 0.05;

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var visibleNodes = graph.nodes.filter(function(o) {
      return o.visible;
    });
    var boundaries = relvis.findBoundaries(visibleNodes, ['x', 'y']);

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
})();
