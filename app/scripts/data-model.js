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

  function addSampleItem() { //{{{1 sampleItem
    var sampleId = '870970-basis:23243431'; //{{{2
    var sampleItem = [{
      property: 'Cover',
      // as forside from vejlebib expires, we temporarily use a link for the frontpage of goodreads during development
      value: 'http://d.gr-assets.com/books/1394861337l/52036.jpg'
    }, {
      property: 'title',
      value: 'Siddhartha - en indisk legende'
    }, {
      property: 'Collection',
      value: '870970-basis:22331892'
    }, {
      property: 'creator',
      value: 'Hermann Hesse (2012)'
    }, {
      property: 'Description',
      value: 'Om en from brahmanersøn, der i sin søgen efter sandheden forkaster sine fædres tro. Hans vej går gennem askese, møde med Buddha, kærlighedsoplevelser og et verdsligt liv, før han falder til ro'
    }, {
      property: 'Serie',
      value: 'Gyldendals paperbacks'
    }, {
      property: 'Id',
      value: sampleId
    }, {
      property: 'Type',
      value: 'Bog'
    }, {
      property: 'Sprog',
      value: 'Dansk'
    }, {
      property: 'subject',
      value: 'religiøse bøger'
    }, {
      property: 'subject',
      value: 'siddhartha'
    }, {
      property: 'Bidrag af',
      value: 'Karl Hornelund'
    }, {
      property: 'Original title',
      value: 'Siddhartha'
    }, {
      property: 'ISBN-nummer',
      value: '9788702142570'
    }, {
      property: 'Udgave',
      value: '6. udgave'
    }, {
      property: 'Omfang',
      value: '126 sider'
    }, {
      property: 'Udgiver',
      value: 'Gyldendal'
    }, {
      property: 'Publikum',
      value: 'voksenmaterialer'
    }, {
      property: 'Opstilling',
      value: '0/1 eksemplar hjemme på Vejle > Voksen > Magasin > Skøn > > Hesse'
    }, {
      property: 'Opstilling',
      value: '1/1 eksemplar hjemme på Jelling > Voksen > Magasin > Skøn > > Hesse'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:12543431',
      title: 'Hermann Hesse : Leben und Werk im Bild : mit dem Kurzgefassten Lebenslauf von Hermann Hesse'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:85143431',
      title: 'Hermann Hesse : pilgrim of crisis : a biography'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:14943431',
      title: 'Hermann Hesse : life and art'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:91483431',
      title: 'Hermann Hesse'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:19898431',
      title: 'Hermann Hesse : sein Leben und sein Werk (Ved Anni Carlsson, Otto Basler)\nAf indholdet: Anni Carlsson: Vom Steppenwolf zur Morgenlandfahrt ; Otto Basler: Der Weg zum Glasperlenspiel'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:87875131',
      title: 'Hermann Hesse : sein Leben und sein Werk'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:91431241',
      title: 'Hermann Hesse : a pictorial biography'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:57873431',
      title: 'Hermann Hesse : sein Leben und sein Werk (Ved Anni Carlsson)\nSide 236-256: Anni Carlsson: Vom Steppenwolf zur Morgenlandfahrt ; Side 257-300: Anni Carlsson: Hermann Hesses \'Glasperlenspiel\' in seinen Wesensgesetzen'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:48143431',
      title: 'Hermann Hesse : die Bilderwelt seines Lebens'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:48178431',
      title: 'Hermann Hesse : Werk und Leben : ein Dichterbildnis'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:14787431',
      title: 'Hermann Hesse : Leben und Werk (Ved Hermann Hesse ...)'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:95145731',
      title: 'Hermann Hesse : eine Chronik in Bildern'
    }, {
      property: 'Om forfatteren',
      value: '870970-basis:41573431',
      title: 'Hermann Hesse : biography and bibliography. Volume 1'
    }, {
      property: 'Anmeldelse',
      value: '870970-basis:14853431',
      title: 'Berlingske tidende, 2013-01-24'
    }, {
      property: 'Anmeldelse',
      value: '870970-basis:14878731',
      title: 'Politiken, 2013-02-09'
    }, {
      property: 'Anmeldelse',
      value: '870970-basis:48588431',
      title: 'Weekendavisen, 2013-01-25'
    }, {
      property: 'Lektørudtalelse',
      value: '870970-basis:15153431',
      title: 'Skønt Siddhartha, med skiftende tider har mistet sin kultstatus, er temaet: jeg\'ets søgen efter meningen med tilværelsen, dog evigt aktuelt, og Hesses kendte roman skal selvfølgelig også fremover være at finde på biblioteket. Den egner sig godt til læsning i studiekredse'
    }];

    // Move data into triple store {{{2
    for (var i = 0; i < sampleItem.length; ++i) {
      var obj = sampleItem[i];
      relvis.addTriple(sampleId, obj.property, obj.value);
      if (obj.title) {
        relvis.addTriple(obj.value, 'title', obj.title);
      }
    }
  }

  relvis.initData = function() { //{{{1 
    addSampleItem();
    dataupdate();
  };
  var loadedObjects = {};
  relvis.addEventListener('get-triple', function(obj) {
    if (loadedObjects[obj.object]) {
      return;
    }
    loadedObjects[obj.object] = true;
    var id = obj.object;
    $.ajax('https://dev.vejlebib.dk/ting-visual-relation/get-ting-object/' + id + '?callback=?', {
      cache: true,
      dataType: 'jsonp',
      success: function(data) {
        data.forEach(function(obj) {
          relvis.addTriple(id, obj.property, obj.value);
        });
      },
      error: function() {}
    });
  });
})(); //{{{1
