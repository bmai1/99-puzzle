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
        paused = false;

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
    document.getElementById("apm-counter").innerText = "APM: " + apm;

    // Remove keydown event listener
    document.removeEventListener("keydown", countKeyAction);
}
  
  