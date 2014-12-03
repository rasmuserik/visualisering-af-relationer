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
  var relatedLoaded = {};
  relvis.addEventListener('get-triple', function(obj) {

    var id = obj.object; //{{{2
    if (!id) {
      return;
    }

    if(obj.property === 'related') { //{{{2
      if(relatedLoaded[id]) {
        return;
      }
      relatedLoaded[id] = true;
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
                relvis.addTriple(id, 'related', data);
              }
            },
            error: function() {}
          });
        } else {
          var url = relvis.apiUrl + '/get-recommendations/' + id + '/30';
          $.ajax(url + '?callback=?', {
            cache: true,
            dataType: 'jsonp',
            success: function(data) {
              if (Array.isArray(data)) {
                if (data.length === 0) {
                  //relvis.log('warning: empty array from recommendation-service', url);
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
            error: function(err) {
              try {
                relvis.log(err);
              } catch (e) {
                relvis.log('unserilisable error', String(err));
              }
            }
          });
        }
      });
      return;
    }

    if (loadedObjects[obj.object]) { //{{{2
      return;
    }
    loadedObjects[obj.object] = true;

    if (id.slice(0, 7) === 'search:') { //{{{2
      $.ajax(relvis.apiUrl + '/get-search-result/ting-search/' + id.slice(7) + '?callback=?', {
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
        error: function(err) {
          try {
            relvis.log(err);
          } catch (e) {
            relvis.log('unserilisable error', String(err));
          }
        }
      });
      return;
    } 
    if(!id.match(/[0-9]+-[a-zæøå]+:[0-9]*/)) { //{{{2
      //console.log('not ting-object', id);
      return;
    }

    function tryGet(count) { //{{{2
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
          try {
            relvis.log(err);
          } catch (e) {
            relvis.log('unserilisable error', String(err));
          }
          tryGet(count - 1);
        }
      });
    }

      tryGet(3); ///{{{2
  });  //{{{2
})(); //{{{1
