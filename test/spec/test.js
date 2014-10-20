/* global describe, it, assert, relvis  */

(function() {
  'use strict';

  function floatEq(a, b) {
    var epsilon = Math.max(Math.abs(a), Math.abs(b)) * 0.0000000001;
    return a <= b + epsilon && b <= a + epsilon;
  }
  var ctx;
  describe('data-model', function() {
    it('have a triple store', function() {
      assert(relvis.getValues('foo', 'bar').length === 0, JSON.stringify(relvis.getValues('foo', 'bar')));
      relvis.addTriple('foo', 'bar', 'baz');
      relvis.addTriple('foo', 'bar', 'quux');
      assert(relvis.getValues('foo', 'bar').length === 2);
      relvis.removeTriple('foo', 'bar', 'baz');
      assert(relvis.getValues('foo', 'bar')[0] === 'quux');
      relvis.removeTriple('foo', 'bar', 'quux');
    });
  });
  describe('graph-model', function() {
    it('should create af graph on the relvis-object', function() {
      assert(Array.isArray(relvis.nodes));
      assert(Array.isArray(relvis.edges));
    });
  });
  describe('graph-layout', function() {
    it('should run here few assertions', function() {
      relvis.layoutGraph();
      setTimeout(function() {
        assert(relvis.nodes[0].x !== undefined);
      }, 100);
    });
  });
  describe('canvas-overlay', function() {
    it('should run here few assertions', function() {
      ctx = relvis.canvas.getContext('2d');
      relvis.hideCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 0, 'no canvas after hide canvas overlay');
      relvis.showCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 1);
      relvis.hideCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 0);
      relvis.showCanvasOverlay();
      relvis.showCanvasOverlay();
      assert(document.getElementsByClassName('CanvasOverlay').length === 1);
      assert(ctx);
      assert(typeof relvis.unit === 'number');
      // updateOverlayPosition - not easily testable
    });
  });
  describe('canvas-util', function() {
    it('should run here few assertions', function() {
      var ctx = relvis.canvas.getContext('2d');
      assert(relvis.textLayout(ctx, 'a b c', 1000, 30).length === 1);
      assert(relvis.textLayout(ctx, 'a b c', 1, 30).length === 3);
      // writeBox - not easily testable
    });
  });
  describe('graph-canvas', function() {
    it('should run here few assertions', function() {
      assert(floatEq(relvis.toGraphCoord(relvis.toCanvasCoord({
          x: 5,
          y: 7
        })).x, 5));
      assert(floatEq(relvis.toGraphCoord(relvis.toCanvasCoord({
        x: 5,
        y: 7
      })).y, 7));
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
