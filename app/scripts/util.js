(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  var xy = relvis.xy = {}; // vector math {{{1

  xy.mul = function(p1, p2) {
    return {
      x: p1.x * p2.x,
      y: p1.y * p2.y,
    };
  };
  xy.add = function(p1, p2) {
    return {
      x: p1.x + p2.x,
      y: p1.y + p2.y,
    };
  };
  xy.sub = function(p1, p2) {
    return {
      x: p1.x - p2.x,
      y: p1.y - p2.y,
    };
  };
  xy.scale = function(p, a) {
    return {
      x: p.x * a,
      y: p.y * a,
    };
  };
  xy.inv = function(p) {
    return {
      x: 1 / p.x,
      y: 1 / p.y
    };
  };
  xy.assign = function(p1, p2) {
    p1.x = p2.x;
    p1.y = p2.y;
  };

  relvis.eventListeners = {}; //{{{1
  relvis.addEventListener = function addEventListener(name, handler) { //{{{2
    var listeners = relvis.eventListeners[name] || [];
    relvis.eventListeners[name] = listeners;
    for (var i = 0; i < listeners.length; ++i) {
      if (listeners[i] === handler) {
        return;
      }
    }
    listeners.push(handler);
  };
  relvis.dispatchEvent = function dispatchEvent(name, value) {
    var listeners = relvis.eventListeners[name] || [];
    if (!listeners) {
      return;
    }
    for (var i = 0; i < listeners.length; ++i) {
      listeners[i].call(this, value);
    }
  };

  relvis.square = function(a) { //{{{1
    return a * a;
  };

  relvis.nearestPoints = function(list, x, y) { //{{{1
    // this is a function that finds the neares points for a list of nodes
    //
    // the x and y parameters is the property-names of the x and y
    // in each of the objecrs in the list
    //
    // the axis are weighted by the relvis visualObjectRatio

    function assignDist(a, b, dist) {
      if (a.nearestDist > dist) {
        a.nearestDist = dist;
        a.nearestNode = b;
      }
    }
    for (var i = 0; i < list.length; ++i) {
      list[i].nearestDist = Number.POSITIVE_INFINITY;
    }
    for (i = 0; i < list.length; ++i) {
      var a = list[i];
      for (var j = 0; j < i; ++j) {
        var b = list[j];
        var dist = Math.sqrt(relvis.square(a[x] - b[x]) + relvis.square((a[y] - b[y]) * relvis.visualObjectRatio));
        assignDist(a, b, dist);
        assignDist(b, a, dist);
      }
    }
  };

  relvis.findBoundaries = function findBoundaries(list) { //{{{1
    // returns an object telling the min/max/range of each of the keys
    // and a function to normalise another object to the range
    var i, j, item;
    var min = {};
    var max = {};
    var range = {};

    min.x = Number.POSITIVE_INFINITY;
    max.x = Number.NEGATIVE_INFINITY;
    min.y = Number.POSITIVE_INFINITY;
    max.y = Number.NEGATIVE_INFINITY;

    for (i = 0; i < list.length; ++i) {
      item = list[i];
        if (typeof item.x === 'number') {
          min.x = Math.min(item.x, min.x);
          max.x = Math.max(item.x, max.x);
        }
        if (typeof item.y === 'number') {
          min.y = Math.min(item.y, min.y);
          max.y = Math.max(item.y, max.y);
        }
    }

    range.x = max.x - min.x;
    range.y = max.y - min.y;

    return {
      min: min,
      max: max,
      range: range,
      zeroOne: function(item) {
        var result = {};
        result.y = (item.y - this.min.y) / this.range.y;
        result.x = (item.x - this.min.x) / this.range.x;
        return result;
      }
    };
  };
  relvis.nextTick = function(fn) { //{{{1
    setTimeout(fn, 0);
  };
  relvis.throttle = function(timeout, fn) { //{{{1
    var needRun = false;
    var throttled = false;

    function exec() {
      if (needRun) {
        fn();
        needRun = false;
      }
      throttled = false;
    }
    return function() {
      needRun = true;
      if (!throttled) {
        exec();
        throttled = true;
        window.setTimeout(exec, timeout);
      }
    };
  };
})(); //{{{1
