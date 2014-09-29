(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};

  relvis.square = function(a) { //{{{1
    return a * a;
  };

  relvis.nearestPoints = function(list) { //{{{1
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
        var dist = Math.sqrt(relvis.square(a.x - b.x) + relvis.square((a.y - b.y) * relvis.visualObjectRatio));
        assignDist(a, b, dist);
        assignDist(b, a, dist);
      }
    }
  };

  relvis.findBoundaries = function findBoundaries(list, keys) { //{{{1
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

})();
