(function() {
  'use strict';
  //{{{1 dummy data set for sample visualisation

  var sampleRelations = [{
    type: 'Cover',
    large: 'http://dev.vejlebib.dk/sites/default/files/styles/ding_primary_large/public/ting/covers/object/796e550251e19f9e2deeb270d0d80670.jpg?itok=jAqN8JPD',
    small: 'http://dev.vejlebib.dk/sites/default/files/styles/ding_list_medium/public/ting/covers/object/796e550251e19f9e2deeb270d0d80670.jpg?itok=AckPhF2k'
  }, {
    type: 'Titel',
    value: 'Siddhartha - en indisk legende'
  }, {
    type: 'Creator',
    value: 'Hermann Hesse (2012)'
  }, {
    type: 'Description',
    value: 'Om en from brahmanersøn, der i sin søgen efter sandheden forkaster sine fædres tro. Hans vej går gennem askese, møde med Buddha, kærlighedsoplevelser og et verdsligt liv, før han falder til ro'
  }, {
    type: 'Serie',
    value: 'Gyldendals paperbacks'
  }, {
    type: 'Emne',
    value: 'religiøse bøger'
  }, {
    type: 'Id',
    value: 'ting:870970-basis%3A23243431'
  }, {
    type: 'Type',
    value: 'Bog'
  }, {
    type: 'Sprog',
    value: 'Dansk'
  }, {
    type: 'Emne',
    value: 'religiøse bøger'
  }, {
    type: 'Emne',
    value: 'siddhartha'
  }, {
    type: 'Bidrag af',
    value: 'Karl Hornelund'
  }, {
    type: 'Original title',
    value: 'Siddhartha'
  }, {
    type: 'ISBN-nummer',
    value: '9788702142570'
  }, {
    type: 'Udgave',
    value: '6. udgave'
  }, {
    type: 'Omfang',
    value: '126 sider'
  }, {
    type: 'Udgiver',
    value: 'Gyldendal'
  }, {
    type: 'Publikum',
    value: 'voksenmaterialer'
  }, {
    type: 'Opstilling',
    value: 'Intet eksemplar hjemme på Vejle Bibliotek',
    placement: 'Vejle > Voksen > Magasin > Skøn > > Hesse',
    antal: 1,
    available: 0
  }, {
    type: 'Opstilling',
    value: '1 eksemplar hjemme på Jelling Bibliotek',
    placement: 'Jelling > Voksen > Magasin > Skøn > > Hesse',
    antal: 1,
    available: 1
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : Leben und Werk im Bild : mit dem Kurzgefassten Lebenslauf von Hermann Hesse'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : pilgrim of crisis : a biography'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : life and art'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : sein Leben und sein Werk (Ved Anni Carlsson, Otto Basler)',
    details: 'Af indholdet: Anni Carlsson: Vom Steppenwolf zur Morgenlandfahrt ; Otto Basler: Der Weg zum Glasperlenspiel'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : sein Leben und sein Werk'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : a pictorial biography'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : sein Leben und sein Werk (Ved Anni Carlsson)',
    details: 'Side 236-256: Anni Carlsson: Vom Steppenwolf zur Morgenlandfahrt ; Side 257-300: Anni Carlsson: Hermann Hesses \'Glasperlenspiel\' in seinen Wesensgesetzen'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : die Bilderwelt seines Lebens'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : Werk und Leben : ein Dichterbildnis'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : Leben und Werk (Ved Hermann Hesse ...)'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : eine Chronik in Bildern'
  }, {
    type: 'Om forfatteren',
    value: 'ting:870970-basis%3A23243431',
    text: 'Hermann Hesse : biography and bibliography. Volume 1'
  }, {
    type: 'Anmeldelse',
    value: 'ting:870970-basis%3A23243431',
    text: 'Berlingske tidende, 2013-01-24'
  }, {
    type: 'Anmeldelse',
    value: 'ting:870970-basis%3A23243431',
    text: 'Politiken, 2013-02-09'
  }, {
    type: 'Anmeldelse',
    value: 'ting:870970-basis%3A23243431',
    text: 'Weekendavisen, 2013-01-25'
  }, {
    type: 'Lektørudtalelse',
    value: 'ting:870970-basis%3A23243431',
    text: 'Skønt Siddhartha, med skiftende tider har mistet sin kultstatus, er temaet: jeg\'ets søgen efter meningen med tilværelsen, dog evigt aktuelt, og Hesses kendte roman skal selvfølgelig også fremover være at finde på biblioteket. Den egner sig godt til læsning i studiekredse'
  }];


  //{{{1 code for testing/demo

  // button on sample page pops up visualisation
  $('#visres-button').click(function() {
    var canvasOverlay = new window.CanvasOverlay();
    canvasOverlay.show();
  });

  // show visualisation on load if we have #relvis hash
  $(function() {
    if (location.hash === '#relvis') {
      var canvasOverlay = new window.CanvasOverlay();
      canvasOverlay.show();
    }
  });
})();
