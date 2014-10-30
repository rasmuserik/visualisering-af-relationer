(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};


  relvis.show = function() { //{{{1
    if (relvis.overlayVisible) {
      return;
    }
    relvis.initData();
    relvis.initCanvas();
    relvis.showCanvasOverlay();
    relvis.initUI();
  };
  relvis.init = function(obj) { //{{{1
    relvis.apiUrl = obj.apiUrl;
    relvis.relatedApiUrl = obj.relatedUrl || obj.apiUrl + '/related';
    var unsupportedPlatform = (function unsupportedPlatform() { //{{{2
      // check that canvas is supported
      var elem = document.createElement('canvas');
      if (!elem.getContext) {
        return 'Missing canvas support';
      }

      // check that android version > 2.1 due to canvas bugs in version 2.1 and earlier 
      var android = navigator.userAgent.match(/android.*?([12]\.[0-9])/i);
      if (android && (+android[1] < 2.2) &&
        !navigator.userAgent.match(/(firefox|chrome|opera)/i)) {
        return 'Buggy android version:\n' + navigator.userAgent;
      }

      // everything is ok
      return false;
    })();
    // button on sample page pops up visualisation //{{{2
    $('#relvis-button').click(relvis.show);
    var elemsSel = document.getElementsByClassName('relvis-request');
    var elems = [];
    for (var i = 0; i < elemsSel.length; ++i) {
      elems.push(elemsSel[i]);
    }


    function makeHandler(elem) {
      return function() {
        var id = elem.getAttribute('data-relvis-id').replace(/%3[aA]/g, ':');
        var type = (elem.getAttribute('data-relvis-type') || 'ext').slice(0, 3);
        relvis.visualisation = type + id;
        location.hash = '#relvis' + relvis.visualisation;
        relvis.show();
      };
    }
    for (i = 0; i < elems.length; ++i) {
      var elem = elems[i];
      if (unsupportedPlatform) {
        elem.className = elem.className.replace('relvis-request', 'relvis-disabled');
      } else {
        var handler = makeHandler(elem);
        elem.className = elem.className.replace('relvis-request', 'relvis-enabled');
        elem.addEventListener('mousedown', handler);
        elem.addEventListener('click', handler);
        elem.addEventListener('touchstart', handler);
      }
    }

    // show visualisation on load if we have #relvis hash //{{{2
    if (location.hash.slice(0, 7) === '#relvis' && !unsupportedPlatform) {
      relvis.visualisation = location.hash.slice(7);
      relvis.show();
    }
    $(window).on('hashchange', function() {
      if (location.hash.slice(0, 7) === '#relvis' && !unsupportedPlatform) {
        relvis.visualisation = location.hash.slice(7);
        relvis.show();
      } else {
        relvis.hideCanvasOverlay();
      }
    });
  };
})(); //{{{1
