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
  relvis.getProperties = function(obj) { //{{{2
    var result = {};
    if (!triples[obj]) {
      triples[obj] = {};
    }
    Object.keys(triples[obj]).forEach(function(key) {
      if (triples[obj][key].length) {
        result[key] = JSON.parse(JSON.stringify(triples[obj][key]));
      }
    });
    return result;
  };

  relvis.initData = function() { //{{{1 
    dataupdate();
  };
  var loadedObjects = {};
  var relatedLoaded = {};
  relvis.addEventListener('get-triple', function(obj) {

    var id = obj.object; //{{{2
    if (!id) {
      return;
    }
    var lid = id.split(/(:|%3A)/)[2];

    if (obj.property === 'related') { //{{{2
      if (!relatedLoaded[id]) {
        relatedLoaded[id] = true;
        relvis.nextTick(function() {
          if (relvis.relatedApiUrl) {
            (window.$ || window.jQuery).ajax(relvis.relatedApiUrl + '/related/' + lid + '?callback=?', {
              cache: true,
              dataType: 'jsonp',
              success: function(data) {
                if (Array.isArray(data)) {
                  data = data.map(function(obj) {
                    obj.id = '870970-basis:' + obj.lid;
                    return obj;
                  });
                  relvis.addTriple(id, 'related', data);
                }
              },
              error: function() {
                relvis.log('apierr', 'related-' + id);
              }
            });
          } else {
            var url = relvis.apiUrl + '/get-recommendations/' + id + '/30';
            (window.$ || window.jQuery).ajax(url + '?callback=?', {
              cache: true,
              dataType: 'jsonp',
              success: function(data) {
                if (Array.isArray(data)) {
                  if (data.length === 0) {
                    data = [];
                  }
                  data = data.map(function(id) {
                    return {
                      id: id
                    };
                  });
                  relvis.addTriple(id, 'related', data);
                }
              },
              error: function() {
                relvis.log('apierr', 'related-' + id);
              }
            });
          }
        });
      }
    }

    if (!id.match(/[0-9]+-[a-zæøå]+:[0-9]*/)) { //{{{2
      //console.log('not ting-object', id);
      return;
    }

    if (loadedObjects[id]) { //{{{2
      return;
    }
    loadedObjects[id] = true;

    if (id.slice(0, 7) === 'search:') { //{{{2
      (window.$ || window.jQuery).ajax(relvis.apiUrl + '/get-search-result/ting-search/' + id.slice(7) + '?callback=?', {
        cache: true,
        dataType: 'jsonp',
        success: function(data) {
          var results = [];
          var cols = data.collections;
          for (var i = 0; i < cols.length; ++i) {
            var entities = cols[i].entities;
            for (var j = 0; j < entities.length; ++j) {
              results.push(entities[j]);
            }
          }
          relvis.addTriple(id, 'results', results);
        },
        error: function() {
          relvis.log('apierr', id);
        }
      });
      return;
    }

    function tryGet(count) { //{{{2
      if (count < 1) {
        relvis.log('apierr', id);
        return;
      }
      (window.$ || window.jQuery).ajax(relvis.apiUrl + '/get-ting-object/' + id + '?callback=?', {
        cache: true,
        dataType: 'jsonp',
        success: function(data) {
          data.forEach(function(obj) {
            relvis.addTriple(id, obj.type || obj.property, obj.value);
          });
        },
        error: function() {
          tryGet(count - 1);
        }
      });
    }

    tryGet(3); ///{{{2
    if (relvis.relatedApiUrl) {
      (window.$ || window.jQuery).ajax(relvis.relatedApiUrl + '/info/' + lid + '?callback=?', {
        cache: true,
        dataType: 'jsonp',
        success: function(data) {
          if (data.title) {
            relvis.addTriple(id, 'title', data.title);
          }
        },
        error: function() {
          relvis.log('apierr', 'info-' + id);
        }
      });
    }

  }); //{{{2
})(); //{{{1
