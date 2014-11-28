(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.visualObjectRatio = 13 / 8;
  relvis.visualObjectRatio = 3 / 4;
  var images = {};

  relvis.drawBackground = function(ctx, _, __, w, h) {
    ctx.fillStyle = 'rgba(200,200,200,0.9)';
    ctx.fillRect(0, 0, w, h);
    if (relvis.getType() === 'ext') {
      ctx.shadowBlur = relvis.unit / 2;
      ctx.shadowColor = '#fff';
      ctx.fillStyle = '#000';
      ctx.font = relvis.unit * 3 + 'px sans-serif';
      ctx.fillText('Forfatter', 2 * relvis.unit, 4 * relvis.unit);
      var width = ctx.measureText('Anmeldelser').width;
      ctx.fillText('Anmeldelser', w - width - 2 * relvis.unit, 4 * relvis.unit);

      ctx.fillText('Emner', 2 * relvis.unit, h - 2 * relvis.unit);
      width = ctx.measureText('Struktur').width;
      ctx.fillText('Struktur', w - width - 2 * relvis.unit, h - 2 * relvis.unit);
      ctx.shadowBlur = 0;
    }
  };

  relvis.drawEdge = function drawEdge(ctx, edge, x0, y0, x1, y1) { //{{{1
    if (edge.type === 'collection') {
      ctx.lineWidth = relvis.unit * 10;
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineCap = 'round';
    } else {
      ctx.shadowBlur = relvis.unit / 8;
      ctx.shadowBlur = 0;
      ctx.shadowColor = '#000';
      ctx.lineWidth = relvis.unit / 4;
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.lineCap = 'butt';
    }
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.shadowBlur = 0;
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
      ctx.shadowBlur = relvis.unit * 2;
      ctx.shadowOffsetX = relvis.unit / 2;
      ctx.shadowOffsetY = relvis.unit / 2;
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      var iw = img.naturalWidth;
      var ih = img.naturalHeight;
      var is = Math.min(w / iw, h / ih);
      iw *= is;
      ih *= is;
      ctx.drawImage(img, x + (w - iw) / 2 | 0, y + (h - ih) / 2 | 0, iw | 0, ih | 0);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

    } else {
      if (node.type !== 'category') {
        ctx.shadowBlur = relvis.unit * 2;
        ctx.shadowOffsetX = relvis.unit / 2;
        ctx.shadowOffsetY = relvis.unit / 2;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillRect(x, y, w, h);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // draw text
      if (node.type === 'category') {
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
        ctx.shadowBlur = 0;
      } else {
        ctx.shadowBlur = 0;
        x += w / 10;
        y += h / 10;
        w *= 0.8;
        h *= 0.8;
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        relvis.writeBox(ctx, node.label, x, y, w, h);
      }
    }
    ctx.shadowBlur = 0;
  };
})();
