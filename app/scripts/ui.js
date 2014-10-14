(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  relvis.initUI = function() {//{{{1
    var info = "";
    relvis.addEventListener('redraw', function() {
      var ctx = relvis.canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 500, 10);
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#000';
      ctx.fillText(info + ' ' + Date.now(), 10, 10);
    });
    function showStatus(text) {
      info = text;
    }
    relvis.addEventListener('tapstart', function(e) {
      showStatus('tapstart ' + JSON.stringify({
        x: e.x,
        y: e.y,
        node: (e.node || {}).label
      }));
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
      relvis.requestRedraw();
    });
  };
})(); //{{{1
