(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.visualObjectRatio = 13 / 8;
  relvis.visualObjectRatio = 3 / 4;
  var images = {};

  relvis.drawEdge = function drawEdge(ctx, edge, x0, y0, x1, y1) { //{{{1
    if (edge.type === 'collection') {
      ctx.lineWidth = relvis.unit * 10;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineCap = 'round';
    } else {
      ctx.lineWidth = relvis.unit / 5;
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineCap = 'butt';
    }
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  relvis.drawNode = function drawNode(ctx, node, x, y, w, h) { //{{{1
    var boxSize = 1; // scale box up/down
    var x0 = x + w * (1 - boxSize) / 2;
    var y0 = y + h * (1 - boxSize) / 2;

    // load image if available
    var img;
    if (node.imgSrc) {
      img = images[node.imgSrc];
      if (!img) {
        window.img = img = images[node.imgSrc] = new Image();
        img.src = node.imgSrc;
        img.onload = relvis.requestRedraw;
      }
    }

    // draw image if available
    if (img && img.complete && img.naturalWidth) {
      var iw = img.naturalWidth;
      var ih = img.naturalHeight;
      var is = Math.min(w / iw, h / ih);
      iw *= is;
      ih *= is;
      ctx.drawImage(img, x + (w - iw) / 2 | 0, y + (h - ih) / 2 | 0, iw | 0, ih | 0);

    } else {
    if (node.type === 'category') {
      // draw background box with border
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(x, y, w, h);
    } else {
      // draw background box with border
      ctx.fillStyle = '#000';
      ctx.fillRect(x - relvis.unit / 10,
        y - relvis.unit / 10,
        w + relvis.unit / 10 * 2,
        h + relvis.unit / 10 * 2);
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.fillRect(x, y, w, h);
    } 

      // draw text
      var textLeftMargin = 0.02 * w;
      textLeftMargin = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      var u = relvis.unit / 5;
      x += w / 10;
      y += h / 10;
      w *= 0.8;
      h *= 0.8;
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      relvis.writeBox(ctx, node.label, x, y, w, h);
    }
  };
})();
