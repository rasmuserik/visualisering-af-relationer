(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  relvis.textLayout = function textLayout(ctx, str, width) { //{{{1
    window.ctx = ctx;
    var spacing = ctx.measureText(' ').width;
    var words = str.split(' ');
    var lengths = words.map(function(word) {
      return ctx.measureText(word).width;
    });
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

  relvis.writeBox = function writeBox(ctx, str, x, y, w, h) { //{{{1
    var size = 60;
    var lines, i, maxLen;
    do {
      size = size * 0.9 | 0;
      ctx.font = size + 'px sans-serif';
      lines = relvis.textLayout(ctx, str, w);
      maxLen = 0;
      for (i = 0; i < lines.length; ++i) {
        maxLen = Math.max(maxLen, lines[i].len);
      }
    } while (size > 13 && (maxLen > w || lines.length * size > h));

    for (i = 0; i < lines.length; ++i) {
      if (size * (i + 1) < h) {
        ctx.fillText(lines[i].str, x, y + size * (i + 1));
      }
    }
  };
})();
