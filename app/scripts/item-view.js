(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  relvis.visualObjectRatio = 13 / 8;
  var images = {};

  relvis.drawEdge = function drawEdge(ctx, node0, node1, x0, y0, x1, y1, unit) { //{{{1
    ctx.lineWidth = unit * 1;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = unit * 2;
    ctx.stroke();
  };

  relvis.drawNode = function drawNode(ctx, node, x, y, w, h, unit) { //{{{1
    var img;
    if (node.imgSrc) {
      img = images[node.imgSrc];
      if (!img) {
        window.img = img = images[node.imgSrc] = new Image();
        img.src = node.imgSrc;
      }
    }
    var boxSize = 1;
    var x0 = x + w * (1 - boxSize) / 2;
    var y0 = y + h * (1 - boxSize) / 2;

    /*
    ctx.lineWidth = unit * 1;
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.beginPath();
    ctx.moveTo(x, y + h / 2);
    ctx.quadraticCurveTo(x, y, x + w / 2, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + h / 2);
    ctx.quadraticCurveTo(x + w, y + h, x + w / 2, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h / 2);
    ctx.fill();
    ctx.stroke();
    */

    ctx.fillStyle = '#000';
    ctx.fillRect(x - unit, y - unit, w + unit * 2, h + unit * 2);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(x, y, w, h);

    var imgWidth = 0;
    if (img && img.complete) {
      var imgRatio = img.naturalWidth / img.naturalHeight;
      var imgHeight = boxSize * h;
      imgWidth = imgHeight * Math.min(imgRatio, 0.8);
      imgHeight = imgWidth / imgRatio;
      ctx.drawImage(img, x0, y0, imgWidth, imgHeight);
    }
    imgWidth += w * 0.02;

    ctx.fillStyle = '#000';
    relvis.writeBox(ctx, node.label,
      x + w * (1 - boxSize) / 2 + imgWidth,
      y + h * (1 - boxSize) / 2,
      w * boxSize - imgWidth,
      h * boxSize);
  };
})();
