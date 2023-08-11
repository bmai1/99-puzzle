const slider = document.getElementById('slider');
const board = document.getElementById('solve');

let solved = false, solving = false;
let timerInterval; 
let speed = 1000;
let moveIndex = 0; 
slider.addEventListener('input', () => {
    if (!solved) {
      clearInterval(timerInterval);
      timerInterval = setInterval(update, speed);
      solving = true;
      speed = slider.value;
    }
}); 

function startSolve() {
    if (!solved) {
      if (!solving) {
          solving = true;
          timerInterval = setInterval(update, speed);
      }
      else {
          solving = false;
          clearInterval(timerInterval);
      }
    }
}

function update() {
    board.innerText = moveIndex + solution[moveIndex];
    ++moveIndex;
    if (moveIndex > solution.length - 1) {
      solved = true;
      clearInterval(timerInterval);
    }
}