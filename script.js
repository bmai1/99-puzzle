const board = document.getElementById("board");
const rows = board.getElementsByTagName("tr");

// where the empty tile initially is
let empty_col = 0, empty_row = 0;
let base = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
let ans = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];

// player movement
window.onkeydown = e => {
    if (e.key == "ArrowRight") {
        if (empty_col != 0) {
            change(empty_row, empty_col, "right");
            let tmp = base[empty_row][empty_col - 1];
            base[empty_row][empty_col - 1] = 0;
            base[empty_row][empty_col] = tmp;
            empty_col--; 
        }
    }
    else if (e.key == "ArrowLeft") {
        if (empty_col != 3) {
            change(empty_row, empty_col, "left");
            let tmp = base[empty_row][empty_col + 1];
            base[empty_row][empty_col + 1] = 0;
            base[empty_row][empty_col] = tmp;
            empty_col++; 

        }
    }
    else if (e.key == "ArrowUp") {
        if (empty_row != 3) {
            change(empty_row, empty_col, "up");
            let tmp = base[empty_row + 1][empty_col];
            base[empty_row + 1][empty_col] = 0;
            base[empty_row][empty_col] = tmp;
            empty_row++; 
        }
    }
    else if (e.key == "ArrowDown") {
        if (empty_row != 0) {
            change(empty_row, empty_col, "down");
            let tmp = base[empty_row - 1][empty_col];
            base[empty_row - 1][empty_col] = 0;
            base[empty_row][empty_col] = tmp;
            empty_row--; 
        }
    }
    load();
    check();
}

const change = (row, col, direction) => {
    let cells = rows[row].getElementsByTagName("td"); 

    if (direction == "right") {
        let tmp = cells[col - 1].innerText;
        cells[col - 1].innerText = '';
        cells[col].innerText = tmp;
    }
    else if (direction == "left") {
        let tmp = cells[col + 1].innerText;
        cells[col + 1].innerText = '';
        cells[col].innerText = tmp;
    }
    else if (direction == "up") {
        let rowBelow = rows[row + 1].getElementsByTagName("td");
        let tmp = rowBelow[col].innerText;
        rowBelow[col].innerText = '';
        cells[col].innerText = tmp;
    }
    else if (direction == "down") {
        let rowAbove = rows[row - 1].getElementsByTagName("td");
        let tmp = rowAbove[col].innerText;
        rowAbove[col].innerText = '';
        cells[col].innerText = tmp;
    }
}


// load current board into array
const load = () => {
    for (let i = 0; i < 4; ++i) {
        let cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < 4; ++j) {
            if (cells[j].innerText == '') { 
                empty_row = i, empty_col = j; 
                base[i][j] = 0;
            }
            else { base[i][j] = parseInt(cells[j].innerText); }
        }
    }
}
// initial load
load();

const shuffle = () => {
    shuffleArray(base);
    // reverse of load to update html
    for (let i = 0; i < 4; ++i) {
        let cells = rows[i].getElementsByTagName("td");
        for (let j = 0; j < 4; ++j) {
            if (base[i][j] == 0) {
                empty_row = i, empty_col = j; 
                cells[j].innerText == '';
            }
            else { cells[j].innerText = base[i][j]; }
        }
    }
}


const shuffleArray = (array) => {
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
}
//initial shuffle 

shuffle();

// check winning state
const check = () => {
    // cant compare objects with ==
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            if (base[i][j] != ans[i][j]) { return; }
        }
    }
    console.log("You win!");
}

