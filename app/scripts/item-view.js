(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.visualObjectRatio = 13 / 8;
  relvis.visualObjectRatio = 3 / 4;
  var images = {};

  var slowCount = 0;
  var shadow = true;

  function noShadow(ctx) { //{{{1
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  function getImage(url) { //{{{1
    if (!url) {
      return undefined;
    }

    var img = images[url];
    if (!img) {
      img = images[url] = new Image();
      img.src = url;
      img.onload = relvis.requestRedraw;
    }
    return img;
  }

  //{{{1 Draw background
  function externalRelationLabels(ctx, w, h) { //{{{2
    ctx.shadowBlur = relvis.unit / 2;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#000';
    ctx.font = relvis.unit * 3 + 'px sans-serif';
    ctx.fillText('Forfatter', 4 * relvis.unit, 4 * relvis.unit);
    var width = ctx.measureText('Anmeldelser').width;
    ctx.fillText('Anmeldelser', w - width - 4 * relvis.unit, 4 * relvis.unit);

    ctx.fillText('Emner', 4 * relvis.unit, h - 2 * relvis.unit);
    width = ctx.measureText('Struktur').width;
    ctx.fillText('Struktur', w - width - 4 * relvis.unit, h - 2 * relvis.unit);
    ctx.shadowBlur = 0;
  }

  function drawCloseIcon(ctx, w) { //{{{2
    ctx.shadowBlur = relvis.unit * 2;
    ctx.shadowOffsetX = relvis.unit / 2;
    ctx.shadowOffsetY = relvis.unit / 2;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.fillStyle = 'rgba(255,255,255,1.0)';
    ctx.strokeStyle = 'rgba(255,255,255,1.0)';
    ctx.lineWidth = relvis.unit / 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(w - relvis.unit * 3, relvis.unit);
    ctx.lineTo(w - relvis.unit * 1, relvis.unit * 3);
    ctx.moveTo(w - relvis.unit * 3, relvis.unit * 3);
    ctx.lineTo(w - relvis.unit * 1, relvis.unit * 1);
    ctx.stroke();
    noShadow(ctx);
    ctx.lineCap = 'butt';
  }

  relvis.drawBackground = function(ctx, _, __, w, h) { //{{{2
    ctx.fillStyle = 'rgba(200,200,200,0.9)';
    ctx.fillRect(0, 0, w, h);

    if (relvis.renderTime > 150) {
      ++slowCount;
      if (slowCount > 5) {
        shadow = false;
      }
    } else {
      slowCount = 0;
    }

    if (relvis.getType() === 'ext' && relvis.nodes.length >= 15) {
      externalRelationLabels(ctx, w, h);
    }

    drawCloseIcon(ctx, w);
  };

  relvis.drawEdge = function drawEdge(ctx, edge, x0, y0, x1, y1) { //{{{1
    if (edge.type === 'collection') {
      ctx.lineWidth = relvis.unit * 10;
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineCap = 'round';
    } else {
      ctx.lineWidth = relvis.unit / 4;
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.lineCap = 'butt';
      if (edge.source.highlight || edge.target.highlight) {
        ctx.strokeStyle = 'rgba(30,40,20,1)';
      }
    }

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    noShadow(ctx);
  };


  //{{{1 draw node

  function drawCover(ctx, img, x, y, w, h) { //{{{2
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var is = Math.min(w / iw, h / ih);
    iw = iw * is | 0;
    ih = ih * is | 0;
    var ix = x + (w - iw) / 2 | 0;
    var iy = y + (h - ih) / 2 | 0;
    if (shadow) {
      ctx.shadowBlur = relvis.unit * 2;
    }
    ctx.shadowOffsetX = relvis.unit / 2;
    ctx.shadowOffsetY = relvis.unit / 2;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.drawImage(img, ix, iy, iw, ih);
  }

  function drawCategory(ctx, node, x, y, w, h) { //{{{2
    ctx.shadowBlur = relvis.unit / 2;
    var color = ({
      'creator': '#f88',
      'type': '#88f',
      'subject': '#8f8'
    })[node.subtype] || '#fff';
    ctx.fillStyle = '#000';
    ctx.shadowColor = color;
    relvis.writeBox(ctx, node.label, x, y, w, h, {
      vcenter: true
    });
    noShadow(ctx);
  }

  function drawTitle(ctx, node, x, y, w, h) { //{{{2
    if (shadow) {
      ctx.shadowBlur = relvis.unit * 2;
    }
    ctx.shadowOffsetX = relvis.unit / 2;
    ctx.shadowOffsetY = relvis.unit / 2;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(x, y, w, h);

    noShadow(ctx);

    var defaultCover = getImage(relvis.getValues(node.value, 'defaultCover')[0]);
    if (defaultCover && defaultCover.complete && defaultCover.naturalWidth) {
      ctx.drawImage(defaultCover, x + w * 0.1, y + h * 0.1, w * 0.8, h * 0.8);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillRect(x, y, w, h);
    }

    x += w / 10;
    y += h / 10;
    w *= 0.8;
    h *= 0.8;
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    relvis.writeBox(ctx, node.label, x, y, w, h);
  }

  relvis.drawNode = function drawNode(ctx, node, x, y, w, h) { //{{{2
    var img = getImage(node.imgSrc);

    // draw image if available
    if (img && img.complete && img.naturalWidth) {
      drawCover(ctx, img, x, y, w, h);
    } else if (node.type === 'category') {
      drawCategory(ctx, node, x, y, w, h);
    } else {
      drawTitle(ctx, node, x, y, w, h);
    }
  };

})();
