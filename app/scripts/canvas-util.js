(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  var measureCache = {}; // cache text sizes for performance reasons

  relvis.textLayout = function textLayout(ctx, str, width, fontSize) { //{{{1
    window.ctx = ctx;

    var words = str.split(' ');

    // Find the the length all words
    function measure(str) {
      var t = fontSize + ',' + str;
      return (measureCache[t] = (measureCache[t] || ctx.measureText(str).width));
    }
    var spacing = measure(' ');
    var lengths = words.map(measure);

    // Split the text into lines
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

  relvis.writeBox = function writeBox(ctx, str, x, y, w, h, opt) { //{{{1
    var lines, i, maxLen;
    opt = opt || {};

    // repeatedly reduce font-size until text fits within box
    var size = 6 * relvis.unit;
    do {
      size = size * 0.9 | 0;
      ctx.font = size + 'px sans-serif';
      lines = relvis.textLayout(ctx, str, w, size);
      maxLen = 0;
      for (i = 0; i < lines.length; ++i) {
        maxLen = Math.max(maxLen, lines[i].len);
      }
    } while (size > relvis.unit && (maxLen > w || lines.length * size > h));

    if(opt.vcenter) {
      y += (h - size * (lines.length + 0.5)) / 2;
    }
    // draw the lines of text
    for (i = 0; i < lines.length; ++i) {
      if (size * (i + 1) < h) {
        ctx.fillText(lines[i].str, x, y + size * (i + 1));
      }
    }
  };

})(); //{{{1
