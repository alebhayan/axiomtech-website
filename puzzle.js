// The tile puzzle on the home page.
// Rule: pressing a tile flips it and the tiles directly above, below, left and right.
// Goal: turn every tile yellow. Every puzzle is built by pressing tiles from the
// solved state, so it can always be solved.

(function () {
  "use strict";

  var SIZE = 4;
  var board = document.getElementById("board");
  var status = document.getElementById("puzzle-status");
  var reset = document.getElementById("puzzle-new");
  if (!board || !status || !reset) return;

  var lit = [];
  var moves = 0;
  var solved = false;
  var tiles = [];

  function index(row, col) {
    return row * SIZE + col;
  }

  function flip(row, col) {
    if (row < 0 || col < 0 || row >= SIZE || col >= SIZE) return;
    lit[index(row, col)] = !lit[index(row, col)];
  }

  function press(row, col) {
    flip(row, col);
    flip(row - 1, col);
    flip(row + 1, col);
    flip(row, col - 1);
    flip(row, col + 1);
  }

  function isSolved() {
    return lit.every(Boolean);
  }

  function render() {
    tiles.forEach(function (tile, i) {
      var row = Math.floor(i / SIZE) + 1;
      var col = (i % SIZE) + 1;
      tile.setAttribute("aria-pressed", lit[i] ? "true" : "false");
      tile.setAttribute(
        "aria-label",
        "Row " + row + ", column " + col + ", " + (lit[i] ? "yellow" : "dark")
      );
    });
    board.classList.toggle("is-solved", solved);
    if (solved) {
      status.textContent = "Solved in " + moves + (moves === 1 ? " move." : " moves.");
    } else if (moves === 0) {
      status.textContent = "Press a tile. It flips, and so do its neighbours. Make them all yellow.";
    } else {
      status.textContent = moves + (moves === 1 ? " move" : " moves");
    }
  }

  function newPuzzle() {
    lit = [];
    for (var i = 0; i < SIZE * SIZE; i++) lit.push(true);
    do {
      for (var n = 0; n < 6; n++) {
        press(Math.floor(Math.random() * SIZE), Math.floor(Math.random() * SIZE));
      }
    } while (isSolved());
    moves = 0;
    solved = false;
    render();
  }

  for (var i = 0; i < SIZE * SIZE; i++) {
    (function (i) {
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "tile";
      tile.addEventListener("click", function () {
        if (solved) return;
        press(Math.floor(i / SIZE), i % SIZE);
        moves += 1;
        solved = isSolved();
        render();
      });
      board.appendChild(tile);
      tiles.push(tile);
    })(i);
  }

  reset.addEventListener("click", newPuzzle);
  newPuzzle();
})();
