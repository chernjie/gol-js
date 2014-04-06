(function () {
  "use strict";

  var us = require('underscore');
  var cellModule = require('./cell.js');
  var liveCell = cellModule.liveCell;
  var deadCell = cellModule.deadCell;
  var coordinates = cellModule.coordinates;

  function createCoordinates(hasALiveCell, x, y) {
    var cell = hasALiveCell ? liveCell() : deadCell();
    return coordinates(x, y, cell);
  }

  function parseRowPattern(rowPattern, rowIndex) {
    var rowCellStates = rowPattern.split('');
    return us.map(rowCellStates, function (cellState, columnIndex) {
      return createCoordinates(cellState === "1", columnIndex, rowIndex);
    });
  }

  function parseBoardPattern(boardPattern) {
    return us.chain(boardPattern.split('\n'))
      .map(parseRowPattern).flatten().value();
  }

  module.exports = function (boardPattern) {
    var board = parseBoardPattern(boardPattern);

    function find(x, y) {
      return us.find(board, function (cell) {
        return cell.x === x && cell.y === y;
      }) || createCoordinates(false, x, y);
    }

    function highest(dimension) {
      return us.reduce(board, function (highest, compareTo) {
        if (!highest) {
          return compareTo;
        }
        if (highest[dimension] > compareTo[dimension]) {
          return highest;
        }
        return compareTo;
      })[dimension] + 2;
    }

    function lowest(dimension) {
      return us.reduce(board, function (lowest, compareTo) {
        if (!lowest) {
          return compareTo;
        }
        if (lowest[dimension] < compareTo[dimension]) {
          return lowest;
        }
        return compareTo;
      })[dimension] - 1;
    }

    return {
      nextLife: function () {
        var nextBoard = [];
        us.each(us.range(lowest('y'), highest('y')), function (yIndex) {
          us.each(us.range(lowest('x'), highest('x')), function (xIndex) {
            find(xIndex, yIndex).nextLife(board, function (livesInNextLife) {
              if (livesInNextLife) {
                nextBoard.push(createCoordinates(livesInNextLife, xIndex, yIndex));
              }
            });
          });
        });
        board = nextBoard;
      },
      patternFor: function (startCell, endCell, alive, dead) {
        alive = alive || "1";
        dead = dead || "0";
        var xRange = us.range(startCell.x, endCell.x + 1);
        var yRange = us.range(startCell.y, endCell.y + 1);
        var pattern = us.reduce(yRange, function (pattern, yIndex) {
          return us.reduce(xRange, function (pattern, xIndex) {
            var coordinates = find(xIndex, yIndex);
            coordinates.cell.isAlive(function (isAlive) {
              pattern += isAlive ? alive : dead;
            });
            return pattern;
          }, pattern) + "\n";
        }, "");
        return pattern.substr(0, pattern.length - 1);
      }
    };
  };
})();