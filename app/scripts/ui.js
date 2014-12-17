(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  var info = window.navigator.userAgent;
  var graphTouchCoord = {};
  var node;

  function redraw() { //{{{1
    /*
    var ctx = relvis.canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 20, 500, 20);
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#000';
    ctx.fillText(info + ' ' + relvis.renderTime, 10, 35);
    */
  }

  function showStatus(text) { //{{{1
    info = text;
  }

  relvis.initUI = function() { //{{{1
    relvis.addEventListener('tapstart', function(e) { //{{{2
      node = (e.node || {});
      graphTouchCoord = relvis.toGraphCoord(e);
      showStatus('tapstart ' + JSON.stringify({
        pos: graphTouchCoord,
        x: e.x,
        y: e.y,
        node: node.label
      }));
      node.fixed = true;
      node.highlight = true;
      relvis.fixedViewport = true;
      relvis.requestRedraw();
    });
    relvis.addEventListener('tapmove', function(e) { //{{{2
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
    relvis.addEventListener('tapend', function(e) { //{{{2
      showStatus('tapend' + JSON.stringify({
        x: e.x,
        y: e.y,
        node: node.label
      }));
      node.fixed = false;
      node.highlight = false;
      relvis.fixedViewport = false;
      relvis.requestRedraw();
      relvis.layoutGraph();
    });
    relvis.addEventListener('drag', function(e) { //{{{2
      var h, w, x, y, px, py;
      showStatus('drag' + JSON.stringify({
        x: e.x,
        y: e.y,
        w: relvis.canvas.width,
        h: relvis.canvas.height
      }));
      relvis.log('drag ', node && node.id);
      if (relvis.getType() === 'cir' && node) {
        var ids = relvis.getIds();
        var pos = ids.indexOf(node.id);
        px = e.x / relvis.canvas.width * 2 - 1;
        py = e.y / relvis.canvas.height * 2 - 1;
        if (px * px + py * py < 0.2) {
          if (pos === -1) {
            relvis.log('add-node', node.id);
            ids.push(node.id);
            relvis.setIds(ids);
          }
        } else {
          if (pos !== -1 && ids.length > 1) {
            relvis.log('remove-node', node.id);
            ids.splice(pos, 1);
            relvis.setIds(ids);
          }
        }

      }
    });
    relvis.addEventListener('tapclick', function(e) { //{{{2
      showStatus('tapclick' + JSON.stringify({
        x: e.x,
        y: e.y,
        node: node.label
      }));
      if (!node.id) {
        relvis.log('click');
        relvis.closeHandle();
      } else {
        relvis.log('click', node.id);
        relvis.clickHandle({
          visualisation: relvis.getType(),
          id: node.id
        });
      }
    });
    relvis.addEventListener('redraw', redraw); //{{{2
  };
})(); //{{{1
