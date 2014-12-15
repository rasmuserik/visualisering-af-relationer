(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.visualObjectRatio = 13 / 8;
  relvis.visualObjectRatio = 3 / 4;
  var images = {};

  var slowCount = 0;
  var shadow = true;

  relvis.drawBackground = function(ctx, _, __, w, h) {//{{{1
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
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.lineCap = 'butt';
  };

  relvis.drawEdge = function drawEdge(ctx, edge, x0, y0, x1, y1) { //{{{1
    if (edge.type === 'collection') {
      ctx.lineWidth = relvis.unit * 10;
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
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

    var cover, coverUrl;
    coverUrl = relvis.getValues(node.value, 'defaultCover')[0];
    if(coverUrl) {
      cover = images[coverUrl];
      if(!cover) {
        window.cover = cover = images[coverUrl] = new Image();
        cover.src = coverUrl;
      }
    }



    // draw image if available
    if (img && img.complete && img.naturalWidth) {
      var iw = img.naturalWidth;
      var ih = img.naturalHeight;
      var is = Math.min(w / iw, h / ih);
      iw *= is;
      ih *= is;
      iw = iw | 0;
      ih = ih | 0;
      var ix = x + (w - iw) / 2 | 0;
      var iy = y + (h - ih) / 2 | 0;
      if (shadow) {
        ctx.shadowBlur = relvis.unit * 2;
        ctx.shadowOffsetX = relvis.unit / 2;
        ctx.shadowOffsetY = relvis.unit / 2;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
      } else {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(ix + 0.1 * iw, iy + 0.1 * iw, iw, ih);
      }
      ctx.drawImage(img, ix, iy, iw, ih);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

    } else {
      if (node.type !== 'category') {
        if (shadow) {
          ctx.shadowBlur = relvis.unit * 2;
          ctx.shadowOffsetX = relvis.unit / 2;
          ctx.shadowOffsetY = relvis.unit / 2;
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
        } else {
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(x + 0.1 * w, y + 0.1 * w, w, h);
        }
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillRect(x, y, w, h);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        if(cover && cover.complete && cover.naturalWidth) {
          ctx.drawImage(cover, x + w * 0.05, y + h * 0.05, w * 0.85, h * 0.85);
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fillRect(x, y, w, h);
        }
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
