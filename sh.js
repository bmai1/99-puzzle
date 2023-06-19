const board = document.getElementById("board");
const rows = board.getElementsByTagName("tr");

// init is arbitrarily reversed to not set off win-con right away
let init = [[4,3,2,1],[8,7,6,5],[12,11,10,9],[0,15,14,13]];
let goal = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
// location of empty cell [row, col]
let empty = [-1, -1];

// flag indicates when timer is running
let off = true;
let flag = true;

window.addEventListener("DOMContentLoaded", (event) => {
    shuffle();
    renderBoard();
    colorBoard();

    // const bug = [
    //     [1,2,3,4],
    //     [5,6,7,8],
    //     [9,10,11,12],
    //     [13,15,14,0]
    // ];
    // const bug2 = [
    //     [1, 14, 13, 6],
    //     [2, 0, 10, 9],
    //     [5, 4, 3, 12],
    //     [7, 8, 15, 11]
    // ];
    // const bug3 = [
    //     [1, 14, 0, 11],
    //     [15, 7, 5, 4],
    //     [10, 3, 2, 13],
    //     [8, 9, 6, 12]
    // ];
    // console.log(solvable(bug));
    // console.log(solvable(bug2));
    // console.log(solvable(bug3));
});

// disable arrow interaction on dropdown
const selector = document.getElementById("sfx");
selector.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
});


// audio

let sfx_name = "media/s1.mp3"
const sfxSelect = (sfx) => {
    sfx_name = sfx;
}

let moves = 0;
moveCounter = document.getElementById("moves");
window.onkeydown = e => {
    sfx = new Audio(`${sfx_name}`);
    if (sfx_name == "media/s1.mp3") { sfx.volume = 1; }
    else { sfx.volume = 0.5; }
    sfx.play();
    ++moves, moveCounter.innerText = "Moves: " + moves;
    
    // start timer upon first move
    if (off) { startTimer(), off = false; }
    if (flag) {
      let bg = new Audio("media/bg.mp3");
      bg.volume = 0.3;
      bg.loop = true;
      bg.play();
      flag = false;
    }
    let i = empty[0], j = empty[1];
    if ((e.key == "ArrowUp" || e.key == "w") && empty[0] != 3) {
        // empty cell = cell below
        init[i][j] = init[i+1][j];
        init[i+1][j] = 0; 
        empty[0]++;
    }
    else if ((e.key == "ArrowDown" || e.key == "s") && empty[0] != 0) {
        init[i][j] = init[i-1][j];
        init[i-1][j] = 0; 
        empty[0]--;

    }
    else if ((e.key == "ArrowLeft" || e.key == "a") && empty[1] != 3) {
        init[i][j] = init[i][j+1];
        init[i][j+1] = 0; 
        empty[1]++;
    }
    else if ((e.key == "ArrowRight" || e.key == "d") && empty[1] != 0) {
        init[i][j] = init[i][j-1];
        init[i][j-1] = 0; 
        empty[1]--;
    }
    else if (e.key == "c") {
        // console.log(solvable(init));
        console.log(solvable(init.flat()));
    }
    else if (e.key == "p") {
        console.log(init);
    }
    renderBoard();
    colorBoard();
    check();
}

// updates html after board array is changed
const renderBoard = () => {
    for (let i = 0; i < 4; ++i) {
        let cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < 4; ++j) {
            if (init[i][j] == 0) {
                cells[j].innerText = '';
                empty[0] = i, empty[1] = j;
            }
            else { cells[j].innerText = init[i][j]; }
        }
    }
}

const colorBoard = () => {
    for (let i = 0; i < 4; ++i) {
        let cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < 4; ++j) {
            if (init[i][j] != 0 && init[i][j] == goal[i][j]) {
                cells[j].style.backgroundColor = "#f55b7f";
            }
            else if (init[i][j] == 0) {
                cells[j].style.backgroundColor = "pink";
            }
            else { cells[j].style.backgroundColor = "#66555f"; }
    
        }
    }

}

// timer
const timerElement = document.getElementById("timer");
let startTime, endTime, elapsedTime, timerInterval;

const startTimer = () => {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 10); // Update timer every 10 milliseconds
}

const stopTimer = () => {
  clearInterval(timerInterval);
}

const updateTimer = () => {
  endTime = new Date().getTime();
  elapsedTime = endTime - startTime;

  let minutes = Math.floor(elapsedTime / 60000);
  let seconds = Math.floor((elapsedTime % 60000) / 1000);
  let milliseconds = elapsedTime % 1000;

  // Format the timer display
  let timerDisplay = String(minutes).padStart(2, '0') + ':' +
                     String(seconds).padStart(2, '0') + ':' +
                     String(milliseconds).padStart(3, '0');

  timerElement.innerHTML = timerDisplay;
}

// new game
const shuffle = () => {
    do { shuffleArray(init); }
    while (!solvable(init.flat())); // holy motherfucker fucking fuck shit holy fuck i wanna die
    // console.log(init);
    stopTimer(), timerElement.innerHTML = "00:00:000", off = true;
    moves = 0, moveCounter.innerText = "Moves: 0";
    renderBoard();
    colorBoard();
    // console.log("I beg you to be solvable.");
}

const shuffleArray = (array) => {
    // console.log("Shuffling...");
    // Fisher-Yates
    let currentIndex = 16;
    while (currentIndex !== 0) {
        // Generate a random index within the range of the remaining elements
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Calculate the row and column indices for the current and random elements
        const currentRow = Math.floor(currentIndex / 4);
        const currentColumn = currentIndex % 4;
        const randomRow = Math.floor(randomIndex / 4);
        const randomColumn = randomIndex % 4;

        // Swap the current element with the randomly selected element
        const temp = array[currentRow][currentColumn];
        array[currentRow][currentColumn] = array[randomRow][randomColumn];
        array[randomRow][randomColumn] = temp;
    }
    // make sure that the puzzle is solvable ughhh
    // if (!solvable2(init)) { shuffleArray(init); }
    // console.log(array);
}

// need to use inversions to check if 15 puzzle is solvable

// let n = 4; // dimensions
// const inversionCount = (arr) => {
//     let count = 0; 
//     for (let i = 0; i < n * n - 1; ++i) {
//         for (let j = i + 1; j < n * n; ++j) {
//             if (arr[j] && arr[i] && arr[i] > arr[j]) { count++; }
//         }
//     }
//     return count;
// }

// const findXPos = (arr) => {
//     for (let i = n - 1; i >= 0; --i) {
//         for (let j = n - 1; j >= 0; --j) {
//             if (arr[i][j] == 0) { return n - i; }
//         }
//     }
// }

// const solvable = (arr) => {
//     let inv = inversionCount(arr.flat());
//     // console.log(inv);
//     if (arr.length % 2 == 0) {
//         return (inv + empty[0]) % 2 == 1;
//     }
//     else return inv % 2 == 0;
// }

// official repo 

const solvable = puzzle => {
    let parity = 0;
    let gridWidth = 4;
    let row = 0;
    let blankRow = 0;
    for (let i = 0; i < puzzle.length; i++) {
      if (i % gridWidth == 0) {
        // advance to next row
        row++;
      }
      if (puzzle[i] == 0) {
        blankRow = row;
        continue;
      }
      for (var j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] > puzzle[j] && puzzle[j] != 0) {
          parity++;
        }
      }
    }
    // console.log(blankRow);
    // console.log(parity);
    if (gridWidth % 2 == 0) {
      if (blankRow % 2 == 0) {
        return parity % 2 == 0;
      } else {
        return parity % 2 != 0;
      }
    }
  };



// https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/

// int getInvCount(int arr[])
// {
//     int inv_count = 0;
//     for (int i = 0; i < N * N - 1; i++)
//     {
//         for (int j = i + 1; j < N * N; j++)
//         {
//             // count pairs(arr[i], arr[j]) such that
//               // i < j but arr[i] > arr[j]
//             if (arr[j] && arr[i] && arr[i] > arr[j])
//                 inv_count++;
//         }
//     }
//     return inv_count;
// }
 
// // find Position of blank from bottom
// int findXPosition(int puzzle[N][N])
// {
//     // start from bottom-right corner of matrix
//     for (int i = N - 1; i >= 0; i--)
//         for (int j = N - 1; j >= 0; j--)
//             if (puzzle[i][j] == 0)
//                 return N - i;
// }
 
// // This function returns true if given
// // instance of N*N - 1 puzzle is solvable
// bool isSolvable(int puzzle[N][N])
// {
//     // Count inversions in given puzzle
//     int invCount = getInvCount((int*)puzzle);
 
//     // If grid is odd, return true if inversion
//     // count is even.
//     if (N & 1)
//         return !(invCount & 1);
 
//     else     // grid is even
//     {
//         int pos = findXPosition(puzzle);
//         if (pos & 1)
//             return !(invCount & 1);
//         else
//             return invCount & 1;
//     }
// }


// check winning state
const check = () => {
    // can't directly compare two array objects
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            if (init[i][j] != goal[i][j]) { return; }
        }
    }
    console.log("Winner")
    stopTimer(), off = true;
}
