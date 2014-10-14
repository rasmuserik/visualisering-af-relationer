(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  var x0, y0;

  var info = '';


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

  relvis.addEventListener('tapstart', function(e) {
    var node = (e.node || {});
    showStatus('tapstart ' + JSON.stringify({
      x: e.x,
      y: e.y,
      node: node.label
    }));
    node.fixed = true;
    relvis.fixedViewport = true;
    relvis.requestRedraw();
  });
  relvis.addEventListener('tapmove', function(e) {
    showStatus('tapmove' + JSON.stringify({
      x: e.x,
      y: e.y,
      node: (e.node || {}).label
    }));
    relvis.requestRedraw();
  });
  relvis.addEventListener('tapend', function(e) {
    showStatus('tapend');
    relvis.fixedViewport = false;
    relvis.requestRedraw();
    relvis.layoutGraph();
  });
  relvis.initUI = function() { //{{{1
    relvis.addEventListener('redraw', redraw);
  };
})(); //{{{1
