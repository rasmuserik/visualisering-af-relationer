// A canvas-element at device resolution, that fits the entire window
(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  var touching = false;
  var noInteractUntil = 0;

  // taphandling{{{1
  var tapTime = 300;
  var tapStartX;
  var tapStartY;
  var tapPrevX;
  var tapPrevY;
  var tapPrevNode;
  var tapStartTime;
  var tapStartNode;
  var maxDX;
  var maxDY;

  function taphandle(kind) {
    return function(e) {
      var canvas = relvis.canvas;
      e.preventDefault();
      if (Date.now() < noInteractUntil) {
        return;
      }
      var o = {
        orig: e
      };
      o.isTouch = !!e.touches;

      if (e.touches && e.touches[0]) {
        o.x = e.touches[0].clientX;
        o.y = e.touches[0].clientY;
      }

      if (!o.isTouch) {
        o.x = e.clientX;
        o.y = e.clientY;
      }

      if (typeof o.x === 'undefined') {
        o.x = tapPrevX;
        o.y = tapPrevY;
      } else {
        o.x = o.x * canvas.width / canvas.clientWidth;
        o.y = o.y * canvas.height / canvas.clientHeight;
      }

      if (kind === 'start') {
        maxDX = maxDY = 0;
        tapStartTime = Date.now();
        touching = true;
        tapPrevX = tapStartX = o.x;
        tapPrevY = tapStartY = o.y;
      }

      if (typeof o.x === 'number') {
        maxDX = Math.max(maxDX, Math.abs(o.x - tapStartX));
        maxDY = Math.max(maxDY, Math.abs(o.y - tapStartY));
        o.node = relvis.nodeAt(o.x, o.y);
        o.dx = o.x - tapStartX;
        o.dy = o.y - tapStartY;
        o.ddx = o.x - tapPrevX;
        o.ddy = o.y - tapPrevY;
        tapPrevX = o.x;
        tapPrevY = o.y;
        tapPrevNode = o.node;
      }
      if (kind === 'start') {
        tapStartNode = o.node;
      } else {
        o.startNode = tapStartNode;
      }
      if (!o.node) {
        o.node = tapPrevNode;
      }

      if (touching || kind === 'start') {
        relvis.dispatchEvent('tap' + kind, o);
      }

      if (kind === 'end') {
        if (Date.now() - tapStartTime < tapTime &&
          Math.sqrt(maxDX * maxDX + maxDY * maxDY) < relvis.unit) {
          relvis.dispatchEvent('tapclick', o);
        } else {
          relvis.dispatchEvent('drag', o);
        }
        touching = false;
      }
    };
  }


  relvis.initCanvas = function() { //{{{1
    if (relvis.canvas) {
      return;
    }
    var canvas = relvis.canvas = document.createElement('canvas');
    canvas.className = 'CanvasOverlay';

    // keep track of whether the element is shown
    relvis.overlayVisible = false;

    // canvasUint
    relvis.unit = 12 * (window.devicePixelRatio || 1);

    // resize canvas on screen resize
    (window.$ || window.jQuery)(window).scroll(function() {
      relvis.updateOverlayPosition();
    });
    (window.$ || window.jQuery)(window).resize(function() {
      relvis.updateOverlayPosition();
    });

    canvas.addEventListener('touchstart', taphandle('start'));
    canvas.addEventListener('mousedown', taphandle('start'));
    canvas.addEventListener('touchmove', taphandle('move'));
    canvas.addEventListener('mousemove', taphandle('move'));
    canvas.addEventListener('touchend', taphandle('end'));
    canvas.addEventListener('mouseup', taphandle('end'));
    canvas.addEventListener('mouseleave', taphandle('end'));
  };

  relvis.showCanvasOverlay = function() { //{{{1 
    // do nothing if already visible
    if (this.overlayVisible) {
      return;
    }
    this.overlayVisible = true;

    noInteractUntil = Date.now() + tapTime * 3;

    // hide scrollbars
    this._originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // add the element to the dom, and update positions
    document.body.appendChild(this.canvas);
    relvis.updateOverlayPosition();
  };

  relvis.hideCanvasOverlay = function() { //{{{1
    // do nothing if already hidden
    if (!this.overlayVisible) {
      return;
    }
    this.overlayVisible = false;

    // remove the element from the dom
    if (this.canvas.parentElement) {
      document.body.removeChild(this.canvas);
    }

    // restore scrollbars
    document.body.style.overflow = this._originalOverflow;
  };

  relvis.updateOverlayPosition = function() { //{{{1
    if (!this.overlayVisible) {
      return;
    }
    relvis.unit = 12 * (window.devicePixelRatio || 1);

    // find the current size, to see if we need update canvas-size + redraw
    var originalWidth = this.canvas.width;
    var originalHeight = this.canvas.height;

    // calculate desired size/position of canvas to match the view
    var devicePixelRatio = window.devicePixelRatio || 1;
    var x = window.scrollX || window.pageXOffset || 0;
    var y = window.scrollY || window.pageYOffset || 0;
    var xres = document.documentElement.clientWidth * devicePixelRatio;
    var yres = document.documentElement.clientHeight * devicePixelRatio;
    var width = window.innerWidth;
    var height = window.innerHeight;

    // style the canvas to be an overlay filling the entire screen
    this.canvas.style.position = 'absolute';
    this.canvas.style.zIndex = 1000000000;
    this.canvas.style.top = y + 'px';
    this.canvas.style.left = x + 'px';
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    // set the canvas resolution and redraw if needed
    if (originalWidth !== xres || originalHeight !== yres) {
      this.canvas.width = xres;
      this.canvas.height = yres;
      this.requestRedraw();
    }
  };
})();
