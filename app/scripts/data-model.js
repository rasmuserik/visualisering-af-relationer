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
    relvis.nextTick(function() {
      if (relvis.relatedApiUrl) {
        var lid = id.split(/(:|%3A)/)[2];
        $.ajax(relvis.relatedApiUrl + '/related/' + lid + '?callback=?', {
          cache: true,
          dataType: 'jsonp',
          success: function(data) {
            if (Array.isArray(data)) {
              data = data.map(function(obj) {
                obj.id = '870970-basis:' + obj.lid;
                return obj;
              });
              console.log(data);
              relvis.addTriple(id, 'related', data);
            }
          },
          error: function() {}
        });
      } else {
        $.ajax(relvis.apiUrl + '/get-recommendations/' + id + '/30?callback=?', {
          cache: true,
          dataType: 'jsonp',
          success: function(data) {
            data = data.map(function(id) {
              return {
                id: id
              };
            });
            relvis.addTriple(id, 'related', data);
            console.log(data);
          },
          error: function(err) {
            console.log(err);
          }
        });
      }
    });

    function tryGet(count) {
      if (count < 1) {
        return;
      }
      $.ajax(relvis.apiUrl + '/get-ting-object/' + id + '?callback=?', {
        cache: true,
        dataType: 'jsonp',
        success: function(data) {
          data.forEach(function(obj) {
            relvis.addTriple(id, obj.type || obj.property, obj.value);
          });
        },
        error: function(err) {
          console.log(err);
          tryGet(count - 1);
        }
      });
    }
    tryGet(3);
  });
})(); //{{{1
