(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  var info = '';
  var graphTouchCoord = {};
  var node;

  function redraw() { //{{{1
    var ctx = relvis.canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 500, 10);
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#000';
    ctx.fillText(info + ' ' + Date.now(), 10, 10);
  }

  function showStatus(text) { //{{{1
    info = text;
  }

  relvis.addEventListener('tapstart', function(e) { //{{{1
    node = (e.node || {});
    graphTouchCoord = relvis.toGraphCoord(e);
    showStatus('tapstart ' + JSON.stringify({
      pos: graphTouchCoord,
      x: e.x,
      y: e.y,
      node: node.label
    }));
    node.fixed = true;
    relvis.fixedViewport = true;
    relvis.requestRedraw();
  });
  relvis.addEventListener('tapmove', function(e) { //{{{1
    var coord = relvis.toGraphCoord(e);
    var dpos = relvis.xy.sub(coord, graphTouchCoord);
    showStatus('tapmove' + JSON.stringify({
      dpos: dpos,
      x: e.x,
      y: e.y,
      node: node.label
    }));
    relvis.xy.assign(node, relvis.xy.add(node, dpos));
    relvis.xy.assign(node, coord);
    node.px = node.x;
    node.py = node.y;
    graphTouchCoord = relvis.toGraphCoord(e);
    relvis.requestRedraw();
    relvis.layoutGraph();
  });
  relvis.addEventListener('tapend', function(e) { //{{{1
    showStatus('tapend');
    node.fixed = false;
    relvis.fixedViewport = false;
    relvis.requestRedraw();
    relvis.layoutGraph();
  });
  relvis.initUI = function() { //{{{1
    relvis.addEventListener('redraw', redraw);
  };
})(); //{{{1
