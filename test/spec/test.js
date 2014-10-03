/* global describe, it, assert, relvis  */

(function() {
  'use strict';
  describe('canvas-overlay', function() {
    it('should run here few assertions', function() {
      // showCanvasOverlay
      // hideCanvasOverlay
      // updateOverlayPosition
    });
  });
  describe('canvas-util', function() {
    it('should run here few assertions', function() {
      // textLayout
      // writeBox
    });
  });
  describe('graph-canvas', function() {
    it('should run here few assertions', function() {
      // drawGraph
      // requestRedraw
    });
  });
  describe('graph-layout', function() {
    it('should run here few assertions', function() {
      // layoutGraph
    });
  });
  describe('graph-model', function() {
    it('should create af traph on the relvis-object', function() {
      relvis.createGraph();
      assert(Array.isArray(relvis.nodes));
      assert(Array.isArray(relvis.edges));

    });
  });
  describe('item-view', function() {
    it('should run here few assertions', function() {
      // drawEdge
      // drawNode
    });
  });
  describe('util', function() {
    it('should run here few assertions', function() {
      assert(relvis.square(3) === 9);
      // square
      // nearestPoints
      // findBoundaries
    });
  });
})();
