/* global describe, it, assert, relvis  */

(function() {
  'use strict';
  var ctx;
  describe('graph-model', function() {
    it('should create af graph on the relvis-object', function() {
      relvis.createGraph();
      assert(Array.isArray(relvis.nodes));
      assert(Array.isArray(relvis.edges));
    });
  });
  describe('graph-layout', function() {
    it('should run here few assertions', function() {
      assert(relvis.nodes[0].x === undefined);
      relvis.layoutGraph();
      assert(relvis.nodes[0].x !== undefined);
    });
  });
  describe('canvas-overlay', function() {
    it('should run here few assertions', function() {
      assert(document.getElementsByClassName('CanvasOverlay').length === 0);
      relvis.hideCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 0);
      relvis.showCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 1);
      relvis.hideCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 0);
      relvis.showCanvasOverlay();
      relvis.showCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 1);
      ctx = relvis.canvas.getContext('2d');
      assert(ctx);
      assert(typeof relvis.unit === 'number');
      // updateOverlayPosition - not easily testable
    });
  });
  describe('canvas-util', function() {
    it('should run here few assertions', function() {
      assert(relvis.textLayout(ctx, 'a b c', 1000, 30).length === 1);
      assert(relvis.textLayout(ctx, 'a b c', 1, 30).length === 3);
      // writeBox - not easily testable
    });
  });
  describe('graph-canvas', function() {
    it('should run here few assertions', function() {
      // drawGraph - not easily testable
      // requestRedraw not easily testable
    });
  });
  describe('item-view', function() {
    it('should run here few assertions', function() {
      // drawEdge not easily testable
      // drawNode not easily testable
    });
  });
  describe('util', function() {
    it('should run here few assertions', function() {
      assert(relvis.square(3) === 9);
      var pts = [{
        x: 1,
        y: 1
      }, {
        x: 0,
        y: 1
      }, {
        x: 0,
        y: 0
      }];
      relvis.nearestPoints(pts, 'x', 'y');
      assert(pts[0].nearestNode === pts[1]);
      assert(relvis.findBoundaries(pts, 'x', 'y').range.x === 1);
      assert(relvis.findBoundaries(pts, 'x', 'y').min.x === 0);
      assert(relvis.findBoundaries(pts, 'x', 'y').max.x === 1);
    });
  });
})();
