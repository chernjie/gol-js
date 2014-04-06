"use strict";
var assert = require("assert");
var should = require('should');
var cell = require("../cell.js").cell;
var coordinates = require("../cell.js").coordinates;

describe("coordinate system", function() {
  it('should have coordinates', function () {
    var coordinate0_0 = coordinates(0, 1);
    coordinate0_0.x.should.equal(0);
    coordinate0_0.y.should.equal(1);
  });
});

describe("neighbors", function(){
  it("should have no alive neighbors for a cell in a dead board", function() {
    var deadBoard = [];
    var myCell = cell(false, 0, 0);
    myCell.neighbors(deadBoard).numberAlive().should.equal(0);
  });

  it("should have live neighbors in same row for a cell", function() {
    var board = [cell(true, 0, 0), cell(false, 1, 0), cell(true, 2, 0)];
    var myCell = cell(false, 1, 0);
    myCell.neighbors(board).numberAlive().should.equal(2);
  });

  it("should have live neighbors in different row for a cell", function() {
    var board = [cell(true, 0, 0), cell(false, 1, 0), cell(true, 1, 1)];
    var myCell = cell(false, 1, 0);
    myCell.neighbors(board).numberAlive().should.equal(2);
  });

  it("should not count self as alive", function() {
    var board = [cell(true, 0, 0), cell(true, 1, 0), cell(true, 2, 0)];
    var myCell = cell(true, 1, 0);
    myCell.neighbors(board).numberAlive().should.equal(2);
  });

  it("should not count non-x neighbor as my live neighbor", function() {
    var board = [ cell(true, 0, 0), cell(true, 1, 0), cell(true, 2, 0) ];
    var myCell = cell(true, 0, 0);
    myCell.neighbors(board).numberAlive().should.equal(1);
  });

  it("should not count non-y neighbor as my live neighbor", function() {
    var board = [ cell(true, 0, 0), cell(true, 1, 0), cell(true, 1, 3) ];
    var myCell = cell(true, 0, 0);
    myCell.neighbors(board).numberAlive().should.equal(1);
  });
});