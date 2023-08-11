let startGrid = 
[
    
[ 5,  1,  2,  3  ],
[ 9,  7,  8,  4  ],
[ 6,  14, 10, 12 ],
[ 13, 0, 11,  15  ]  

];

const solvedState = 
[

[ 1,  2,  3,  4  ],
[ 5,  6,  7,  8  ],
[ 9,  10, 11, 12 ],
[ 13, 14, 15, 0  ]

];

// ------------------------- //
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(item) {
    this.queue.push(item);
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    if (!this.empty()) {
      return this.queue.shift();
    }
    return null;
  }

  empty() {
    return this.queue.length === 0;
  }
}
// ------------------------- //


class SolverState {
  constructor(grid, steps) {
    this.grid = grid;
    this.steps = steps;
    this.solved = this.isSolved();
  }

  locate() {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.grid[i][j] == 0) {
          return [i, j];
        }
      }
    }
  }

  isSolved() {
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        if (this.grid[i][j] != solvedState[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  validMoves() {
    let emptyCell = this.locate();
    let moves = [];
    if (emptyCell[0] != 3) moves.push('u');
    if (emptyCell[0] != 0) moves.push('d');
    if (emptyCell[1] != 3) moves.push('l');
    if (emptyCell[1] != 0) moves.push('r');
    return moves;
  }

  applyMove(move) {
    let copy = this.grid.map(row => [...row]);
    let emptyCell = this.locate();
    let i = emptyCell[0], j = emptyCell[1];
    if (move == 'u') {
      copy[i][j] = copy[i + 1][j];
      copy[i + 1][j] = 0;
    }
    else if (move == 'd') {
      copy[i][j] = copy[i - 1][j];
      copy[i - 1][j] = 0;
    }
    else if (move == 'l') {
      copy[i][j] = copy[i][j + 1];
      copy[i][j + 1] = 0;
    }
    else if (move == 'r') {
      copy[i][j] = copy[i][j - 1];
      copy[i][j - 1] = 0;
    }
    return copy;
  }
}

function manhattanDistance(grid) {
  let distance = 0;
    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        const value = grid[i][j];
        if (value !== 0) {
          const targetX = Math.floor((value - 1) / 4);
          const targetY = (value - 1) % 4;
          distance += Math.abs(i - targetX) + Math.abs(j - targetY);
        }
      }
    }
    return distance;
  }
  
function solve(startGrid) {
  const startState = new SolverState(startGrid, []);
  const frontier = new PriorityQueue();
  frontier.enqueue(startState, 0);

  const gScore = new Map();
  gScore.set(JSON.stringify(startGrid), 0);

  const fScore = new Map();
  fScore.set(JSON.stringify(startGrid), manhattanDistance(startGrid));

  while (!frontier.empty()) {
    const curState = frontier.dequeue();
    const curGridString = JSON.stringify(curState.grid);

    if (curState.isSolved()) {
      return curState.steps;
    }

    const candidateMoves = curState.validMoves();

    for (const move of candidateMoves) {
      const nextGrid = curState.applyMove(move);
      const tentativeGScore = gScore.get(curGridString) + 1;
      const nextGridString = JSON.stringify(nextGrid);

      if (!gScore.has(nextGridString) || tentativeGScore < gScore.get(nextGridString)) {
        const nextSteps = curState.steps.concat([move]);
        const nextState = new SolverState(nextGrid, nextSteps);

        gScore.set(nextGridString, tentativeGScore);
        fScore.set(nextGridString, tentativeGScore + manhattanDistance(nextGrid));
        frontier.enqueue(nextState, fScore.get(nextGridString));
      }
    }
  }

  return null; // No solution found
}

const solution = solve(startGrid);
console.log(solution);

// --------------------------------------------- //

