$(function() {
  'use strict';
  var relvis = window.relvis = window.relvis || {};


  function unsupportedPlatform() { //{{{1
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
  }

  function showGraph() { //{{{1
    if (relvis.overlayVisible) {
      return;
    }
    if (unsupportedPlatform()) {
      window.alert('Warning unsupported platform.\n' + unsupportedPlatform());
    }
    relvis.createGraph();
    relvis.layoutGraph();
    relvis.showCanvasOverlay();

    relvis.addEventListener("tapstart", function(e) {
      console.log(e);
    });
    relvis.addEventListener("tapmove", function(e) {
      console.log(e);
    });
    relvis.addEventListener("tapdone", function(e) {
      console.log(e);
    });
  }

  relvis.init = function() { //{{{1
    // button on sample page pops up visualisation
    $('#relvis-button').click(showGraph);
    var elems = document.getElementsByClassName('relvis-request');

    function makeHandler(elem) {
      return function() {
        var id = elem.getAttribute('data-relvis-id');
        console.log('external view for', id);
        showGraph();
      };
    }
    for (var i = 0; i < elems.length; ++i) {
      var elem = elems[i];
      if (unsupportedPlatform()) {
        elem.className = elem.className.replace('relvis-request', 'relvis-disabled');
      } else {
        var handler = makeHandler(elem);
        elem.className = elem.className.replace('relvis-request', 'relvis-enabled');
        elem.addEventListener('mousedown', handler);
        elem.addEventListener('click', handler);
        elem.addEventListener('touchstart', handler);
      }
    }

    // show visualisation on load if we have #relvis hash
    if (location.hash.slice(0, 7) === '#relvis' && !unsupportedPlatform()) {
      showGraph();
    }
  };
});
