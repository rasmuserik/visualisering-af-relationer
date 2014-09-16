// A canvas-element at device resolution, that fits the entire window
(function() {
  CanvasOverlay = function() { //{{{1constructor
    this.canvas = document.createElement('canvas');
    this.canvas.className = "CanvasOverlay"
    this._visible = false;
  };

  CanvasOverlay.prototype.show = function() { //{{{1 add the element to the dom
    if (this._visible) {
      return;
    }

    // hide scrollbars
    this._originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"

    document.body.appendChild(this.canvas);
    this.updatePosition()
  };

  CanvasOverlay.prototype.hide = function() { //{{{1 remove the element from the dom
    if (!this._visible) {
      return;
    }
    if (this.canvas.parentElement) {
      document.body.removeChild(this.canvas);
    }

    // restore scrollbars
    document.body.style.overflow = this._originalOverflow;

    this._visible = false;
  };
  CanvasOverlay.prototype.requestRedraw = function() { //{{{1 override this function
    var ctx = this.canvas.getContext('2d');
    ctx.fillStyle = "#f00";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.fillRect(5, 5, this.canvas.width - 10, this.canvas.height - 10);
    for (var i = 0; i < 100; ++i) {
      ctx.fillStyle = "#00f";
      ctx.fillRect(i, i, 1, 1);
    }
  }
  CanvasOverlay.prototype.updatePosition = function() { //{{{1 make it fit the window, nb: $(window).scroll(function(){canvasOverlay.updatePosition()})
    var originalWidth = this.canvas.width;
    var originalHeight = this.canvas.height;

    var devicePixelRatio = window.devicePixelRatio || 1;
    var x = window.scrollX;
    var y = window.scrollY;
    var xres = document.documentElement.clientWidth * devicePixelRatio;
    var yres = document.documentElement.clientHeight * devicePixelRatio;
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.canvas.style.position = "absolute";
    this.canvas.style.zIndex = 1000000000;
    this.canvas.style.top = y + "px";
    this.canvas.style.left = x + "px";
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    console.log(x, xres, width, this.canvas)

    if (originalWidth !== xres || originalHeight !== yres) {
      this.canvas.width = xres;
      this.canvas.height = yres;
      this.requestRedraw();
    }
  };
})()
