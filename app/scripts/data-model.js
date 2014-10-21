(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};
  //{{{1 triple store
  var triples = relvis.triples = {};
  var dataupdate = relvis.throttle(100, function() {
    relvis.dispatchEvent('data-update');
  });
  relvis.addTriple = function(obj, prop, val) { //{{{2
    if (!val) {
      return;
    }
    var arr = relvis.getValues(obj, prop);
    if (!(val in arr)) {
      arr.push(val);
      dataupdate();
    }
  };
  relvis.removeTriple = function(obj, prop, val) { //{{{2
    var arr = relvis.getValues(obj, prop);
    var pos = arr.indexOf(val);
    if (pos !== -1) {
      arr[pos] = arr[arr.length - 1];
      arr.pop();
      dataupdate();
    }
  };
  relvis.getValues = function(obj, prop) { //{{{2
    if (!triples[obj]) {
      triples[obj] = {};
    }
    if (!triples[obj][prop]) {
      triples[obj][prop] = [];
      relvis.dispatchEvent('get-triple', {
        object: obj,
        property: prop
      });
    }
    return triples[obj][prop];
  };

  relvis.initData = function() { //{{{1 
    dataupdate();
  };
  var loadedObjects = {};
  relvis.addEventListener('get-triple', function(obj) {
    if (loadedObjects[obj.object]) {
      return;
    }
    loadedObjects[obj.object] = true;
    var id = obj.object;
    $.ajax(relvis.apiUrl + '/get-ting-object/' + id + '?callback=?', {
      cache: true,
      dataType: 'jsonp',
      success: function(data) {
        data.forEach(function(obj) {
          relvis.addTriple(id, obj.type || obj.property, obj.value);
        });
      },
      error: function() {}
    });
  });
})(); //{{{1
