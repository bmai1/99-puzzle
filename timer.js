const timerElement = document.getElementById("timer");
let startTime, endTime, elapsedTime, timerInterval;

const startTimer = () => {
    startTime = new Date().getTime();
    // startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 10); // Update timer every 10 milliseconds
}

const stopTimer = () => {
    clearInterval(timerInterval);
}

const pauseButton = document.getElementById("pauseButton")
let paused = false;
let pauseEnabled = false; 
const pauseHandler = () => {
    if (!pauseEnabled) { return; }
    if (paused) {
        pauseButton.innerText = "pause";
        pauseButton.style.backgroundColor = "#c0dcff";
        pauseButton.style.color = "#5314dc";
        lockMoves = false;

        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 10);
        paused = false;
    }
    else { 
        pauseButton.innerText = "resume";
        pauseButton.style.backgroundColor = "#b0ebd2";
        pauseButton.style.color = "#042416";
        lockMoves = true;

        clearInterval(timerInterval);
        elapsedTime = Date.now() - startTime;
        paused = true;
    }
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

// APM tracker
let keyCount = 0;

const startTrackingAPM = () => {
    keyCount = 0;
    document.addEventListener("keydown", countKeyAction);
}

const countKeyAction = () => {
    keyCount++;
}

const stopTrackingAPM = () => {
    // Calculate elapsed time in minutes
    const elapsedMinutes = elapsedTime / 1000 / 60;
  
    // Calculate APM
    const apm = Math.round((keyCount / elapsedMinutes));
  
    // Update APM counter
    document.getElementById("apm-counter").innerText = "apm: " + apm;

    // Remove keydown event listener
    document.removeEventListener("keydown", countKeyAction);
}


// changes bestTime in localStorage corresponsding to current board
const bestTimeHandler = () => {
    if (currentBoard == "b16") {
        let bestTime16 = localStorage.getItem("bestTime16");
        if (bestTime16 == null || elapsedTime < bestTime16) {
            localStorage.setItem("bestTime16", elapsedTime);
        }
        bestTime16 = localStorage.getItem("bestTime16");
        record.innerText = "best time: " + bestTime16 + " ms";
    }
    else if (currentBoard == "b25") {
        let bestTime25 = localStorage.getItem("bestTime25");
        if (bestTime25 == null || elapsedTime < bestTime25) {
            localStorage.setItem("bestTime25", elapsedTime);
        }
        bestTime25 = localStorage.getItem("bestTime25");
        record.innerText = "best time: " + bestTime25 + " ms";
    }
    else if (currentBoard == "b100") {
        let bestTime100 = localStorage.getItem("bestTime100");
        if (bestTime100 == null || elapsedTime < bestTime100) {
            localStorage.setItem("bestTime100", elapsedTime);
        }
        bestTime100 = localStorage.getItem("bestTime100");
        record.innerText = "best time: " + bestTime100 + " ms";
    }
}