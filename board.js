let board = null;
let rows = null; 

let currentBoard = "b16";
let boardSize, boardArray, ansArray;

let empty = [-1, -1]; // location of blank cell [row, col] (0 as placeholder)

let b16 = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
let a16 = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];

let b25 = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,0]];
let a25 = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,0]];

let b100 = [[1,2,3,4,5,6,7,8,9,10],[11,12,13,14,15,16,17,18,19,20],[21,22,23,24,25,26,27,28,29,30],[31,32,33,34,35,36,37,38,39,40],[41,42,43,44,45,46,47,48,49,50],[51,52,53,54,55,56,57,58,59,60],[61,62,63,64,65,66,67,68,69,70],[71,72,73,74,75,76,77,78,79,80],[81,82,83,84,85,86,87,88,89,90],[91,92,93,94,95,96,97,98,99,0]];
let a100 = [[1,2,3,4,5,6,7,8,9,10],[11,12,13,14,15,16,17,18,19,20],[21,22,23,24,25,26,27,28,29,30],[31,32,33,34,35,36,37,38,39,40],[41,42,43,44,45,46,47,48,49,50],[51,52,53,54,55,56,57,58,59,60],[61,62,63,64,65,66,67,68,69,70],[71,72,73,74,75,76,77,78,79,80],[81,82,83,84,85,86,87,88,89,90],[91,92,93,94,95,96,97,98,99,0]];

let firstInteraction = true;
let timerFlag = true;
let lockMoves = false;
let moveCounter = document.getElementById("moveCount");
let moveCount = 0;

window.addEventListener("DOMContentLoaded", () => {
    setBoard();
    changeMode("4");
    newGame();
    renderBoard();
    colorBoard();
});

window.onkeydown = e => {
    if (lockMoves) { return; }

    if ((e.key == "ArrowUp" || e.key == "w") && empty[0] != boardSize - 1) { editBoard("up"); }
    else if ((e.key == "ArrowDown" || e.key == "s") && empty[0] != 0) { editBoard("down"); }
    else if ((e.key == "ArrowLeft" || e.key == "a") && empty[1] != boardSize - 1) { editBoard("left"); }
    else if ((e.key == "ArrowRight" || e.key == "d") && empty[1] != 0) { editBoard("right"); }
    else return; 

    if (firstInteraction) {
        firstInteraction = false;
        loadTrack(track_index);
        playpauseTrack();
    }
    if (timerFlag) {
        startTimer();
        startTrackingAPM();
        timerFlag = false; 
        pauseEnabled = true;
    }

    if (!mutedSfx) {
        move_sfx.currentTime = 0;
        move_sfx.play();
    }
    moveCount++; 
    moveCounter.innerText = "Moves: " + moveCount;
    renderBoard();
    colorBoard();
    check();
}

const setBoard = () => {
    switch (currentBoard) {
        case "b16":
            board = document.getElementById("board16");
            rows = board.getElementsByTagName("tr");
            boardArray = b16;
            ansArray = a16;
            break;
        case "b25":
            board = document.getElementById("board25");
            rows = board.getElementsByTagName("tr");
            boardArray = b25;
            ansArray = a25;
            break;
        case "b100":
            board = document.getElementById("board100");
            rows = board.getElementsByTagName("tr");
            boardArray = b100;
            ansArray = a100;
            break;
    }
    boardSize = boardArray.length;
}


// edits the current board array
const editBoard = (direction) => {
    let row = empty[0], col = empty[1];
    if (direction == "up") {
        boardArray[row][col] = boardArray[row+1][col];
        boardArray[row+1][col] = 0; 
        empty[0]++;
    }
    else if (direction == "down") {
        boardArray[row][col] = boardArray[row-1][col];
        boardArray[row-1][col] = 0; 
        empty[0]--;
    }
    else if (direction == "left") {
        boardArray[row][col] = boardArray[row][col+1];
        boardArray[row][col+1] = 0; 
        empty[1]++;
    }
    else if (direction == "right") { 
        boardArray[row][col] = boardArray[row][col-1];
        boardArray[row][col-1] = 0; 
        empty[1]--;
    }
}


// updates html after board array is changed
const renderBoard = () => {
    for (let i = 0; i < boardSize; ++i) {
        let cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < boardSize; ++j) {
            if (boardArray[i][j] == 0) {
                cells[j].innerText = '';
                empty[0] = i, empty[1] = j;
            }
            else { cells[j].innerText = boardArray[i][j]; }
        }
    }
}


// colors board if in correct position
const colorBoard = () => {
    for (let i = 0; i < boardSize; ++i) {
        let cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < boardSize; ++j) {
            if (boardArray[i][j] != 0 && boardArray[i][j] == ansArray[i][j]) {
                // correct
                cells[j].style.backgroundColor = "#ff5e91";
                cells[j].style.opacity = "1";
            }
            else if (boardArray[i][j] == 0) {
                // empty
                cells[j].style.backgroundColor = "white"; 
                cells[j].style.opacity = "0.5";
            }
            else { 
                // incorrect
                cells[j].style.backgroundColor = "#140f14"; 
                cells[j].style.opacity = "0.80";
            }
    
        }
    }
}


const newGame = () => {
    do { shuffleBoard(boardArray); }
    while (!solvable(boardArray.flat()));
    if (!mutedSfx) {
        move_sfx.currentTime = 0;
        move_sfx.play();
    }
    stopTimer();
    stopTrackingAPM();

    if (paused) { 
        paused = false;
        pauseButton.innerText = "pause";
        pauseButton.style.backgroundColor = "#c0dcff";
        pauseButton.style.color = "#5314dc";
        stopTimer();
    }
    pauseEnabled = false; 

    moveCount = 0;
    timerElement.innerText = "00:00:000";
    moveCounter.innerText = "Moves: 0";
    timerFlag = true;
    lockMoves = false;

    hideAgain();
    renderBoard();
    colorBoard();
}

const changeMode = (size) => {
    board.style.display = "none"; 
    switch (size) {
        case "4":
            currentBoard = "b16";
            break;
        case "5":
            currentBoard = "b25";
            break;
        case "10":
            currentBoard = "b100";
            break;
    }
    setBoard();
    newGame();
    renderBoard();
    colorBoard();
    board.style.display = "block";
}

// disable arrow interaction on mode dropdown
const modeSelector = document.getElementById("modeSelector");
modeSelector.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
});

const shuffleBoard = (array) => {
    // Fisher-Yates
    let currentIndex = boardSize * boardSize;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        const currentRow = Math.floor(currentIndex / boardSize);
        const currentColumn = currentIndex % boardSize;
        const randomRow = Math.floor(randomIndex / boardSize);
        const randomColumn = randomIndex % boardSize;
        const temp = array[currentRow][currentColumn];
        array[currentRow][currentColumn] = array[randomRow][randomColumn];
        array[randomRow][randomColumn] = temp;
    }
}


// official repo (Shubham Singh) --> https://github.com/imshubhamsingh/15-puzzle/commit/e016ad30a9560d2450618a99e9e5b218123f50ae#diff-8478a7bac0240dc851826c916a23b44e3e318bf3e480424aea77d533e1d770fe
const solvable = puzzle => {
    let parity = 0;
    let gridWidth = boardSize;
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
    if (gridWidth % 2 == 0) {
        if (blankRow % 2 == 0) {
          return parity % 2 == 0;
        } else {
          return parity % 2 != 0;
        }
      } else {
        return parity % 2 == 0;
    }
};


let hiddenKitty = false;
let kitty = document.getElementById("kitten");
const hideButton = document.getElementById("hideGirls");
const playAgain = document.getElementById("playAgain");
const hideAgain = () => {
    playAgain.style.display = "none";
}
const hideGirls = () => {
    if (hiddenKitty) {
        kitty.style.display = "block";
        player.style.display = "flex";
        hideButton.innerText = "hide";
        hiddenKitty = false;
    }
    else {
        bgColorer.style.display = "none";
        kitty.style.display = "none";
        player.style.display = "none";
        hideButton.innerText = "unhide";
        hiddenKitty = true;
    }
}

const record = document.getElementById("record");
const check = () => {
    for (let i = 0; i < boardSize; ++i) {
        for (let j = 0; j < boardSize; ++j) {
            if (boardArray[i][j] != ansArray[i][j]) { return; }
        }
    }
    // console.log("victory");
    playAgain.style.display = "block";
    if (!mutedSfx) {
        let win = new Audio("media/victory.mp3");
        win.currentTime = 0.3;
        win.play();
    }
    stopTimer();
    stopTrackingAPM();
    bestTimeHandler();
    lockMoves = true;
    pauseEnabled = false;
    // other flags are reset in newGame();
}

