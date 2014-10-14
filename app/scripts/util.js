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

  relvis.findBoundaries = function findBoundaries(list, keys) { //{{{1
    // given a list of objects and keys to look at, this function
    // returns an object telling the min/max/range of each of the keys
    // and a function to normalise another object to the range
    var i, j, item, key;
    var min = {};
    var max = {};
    var range = {};
    for (i = 0; i < keys.length; ++i) {
      min[keys[i]] = Number.POSITIVE_INFINITY;
      max[keys[i]] = Number.NEGATIVE_INFINITY;
    }
    for (i = 0; i < list.length; ++i) {
      item = list[i];
      for (j = 0; j < keys.length; ++j) {
        key = keys[j];
        if (typeof item[key] === 'number') {
          min[key] = Math.min(item[key], min[key]);
          max[key] = Math.max(item[key], max[key]);
        }
      }
    }
    for (i = 0; i < keys.length; ++i) {
      range[keys[i]] = max[keys[i]] - min[keys[i]];
    }
    return {
      min: min,
      max: max,
      range: range,
      zeroOne: function(item) {
        var result = {};
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          result[key] = (item[key] - this.min[key]) / this.range[key];
        }
        return result;
      }
    };
  };
  relvis.nextTick = function(fn) { //{{{1
    setTimeout(fn, 0);
  };
  relvis.throttle = function(fn, timeout) { //{{{1
    var needRun = false;
    var throttled = false;
    function exec() {
      if(needRun)  {
        fn();
        needRun = false;
      }
      throttled = false;
    }
    return function() {
      needRun = true;
      if(!throttled) {
        exec();
        throttled = true;
        setTimeout(timeout || 100, exec);
      }
    };
  };

})();
