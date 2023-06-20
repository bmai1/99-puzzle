const board = document.getElementById("board");
const rows = board.getElementsByTagName("tr");

// init is arbitrarily reversed to not set off win-con right away
let init = [[4,3,2,1],[8,7,6,5],[12,11,10,9],[0,15,14,13]];
let goal = [[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,0]];
// location of empty cell [row, col]
let empty = [-1, -1];

// flag indicates when timer is running
let off = true;
// let curr_song = null;
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
    else return; 

    sfx = new Audio(`${sfx_name}`);
    if (sfx_name == "media/s1.mp3") { sfx.volume = 0.7; }
    else { sfx.volume = 0.5; }
    sfx.play();
    ++moves, moveCounter.innerText = "Moves: " + moves;

    // start timer upon first move
    if (off) { startTimer(), off = false; }
    if (flag) {
      loadTrack(track_index);
      playpauseTrack();
      // curr_song  = new Audio("media/bg.mp3");
      // curr_song.loop = true;
      // curr_song.play();
      flag = false;
    }

    if (startTime2 === null) {
      startTrackingAPM();
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
                cells[j].style.backgroundColor = "pink"; //#fce6ea
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
    stopTrackingAPM(), startTime2 = null;
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

// wee APM
let startTime2 = null;
let keyCount = 0;

// Function to start tracking APM
function startTrackingAPM() {
  startTime2 = Date.now();
  keyCount = 0;
  document.getElementById("apm-counter").innerText = "APM: 0";

  // Attach keydown event listener
  document.addEventListener("keydown", countKeyAction);
}

// Function to count key actions
function countKeyAction() {
  keyCount++;
}

// Function to stop tracking APM and calculate APM value
function stopTrackingAPM() {
  // Calculate elapsed time in minutes
  const endTime = Date.now();
  const elapsedTime = (endTime - startTime2) / 1000 / 60;

  // Calculate APM
  const apm = Math.round((keyCount / elapsedTime));

  // Update APM counter
  document.getElementById("apm-counter").innerText = "APM: " + apm;

  // Remove keydown event listener
  document.removeEventListener("keydown", countKeyAction);
}


// check winning state
const check = () => {
    // can't directly compare two array objects
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            if (init[i][j] != goal[i][j]) { return; }
        }
    }
    console.log("Winner")
    let gz = new Audio("media/victory.mp3");
    gz.currentTime = 0.2;
    gz.volume = 0.6; 
    gz.play();
    playAgain.style.display = "block";


    stopTimer(), off = true;
    stopTrackingAPM();
    startTime2 = null;
}


const popup = document.getElementById("playAgain");
const hide = () => {
  playAgain.style.display = "none";
}

// music player 
let player = document.getElementById("player");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
 
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
 
let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
 
// Specify globally used values
let track_index = 0;
let isPlaying = false;
let songTimer;

let curr_track = document.createElement('audio');

let track_list = [
  {
    name: "shinsetsu (親切)",
    artist: "物語シリーズ",
    image: "media/shinsetsu.png",
    path: "media/bg1.mp3",
    bgColor: "rgb(240, 98, 121, 0.9)"
  },
  {
    name: "campo de girassol",
    artist: "shibayan records",
    image: "media/cdgir.png",
    path: "media/bg2.mp3",
    bgColor: "rgb(36, 34, 102, 0.6)"
  },
  {
    name: "garota de ipanema",
    artist: "lisa ono",
    image: "media/lisa.png",
    path: "media/bg3.mp3",
    bgColor: "rgb(71, 68, 64, 0.7)"
  },
];

const loadTrack = (track_index) => {
  // Clear the previous seek timer
  clearInterval(songTimer);
  resetValues();
 
  // Load a new track
  curr_track.src = track_list[track_index].path;
  curr_track.load();
  // curr_track = new Audio(`${track_list[track_index].path}`);
  // curr_track.play();
 
  // Update details of the track
  track_art.style.backgroundImage =
     "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  player.style.backgroundColor = track_list[track_index].bgColor;
 
  // Set an interval of 1000 milliseconds
  // for updating the seek slider
  songTimer = setInterval(seekUpdate, 1000);
 
  // Move to the next track if the current finishes playing
  // using the 'ended' event
  curr_track.addEventListener("ended", nextTrack);
}

resetValues = () => {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

const playpauseTrack = () => {
  // Switch between playing and pausing
  // depending on the current state
  if (!isPlaying) playTrack();
  else pauseTrack();
}
 
const playTrack = () => {
  // Play the loaded track
  curr_track.play();
  isPlaying = true;
 
  // Replace icon with the pause icon
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
 
const pauseTrack = () => {
  // Pause the loaded track
  curr_track.pause();
  isPlaying = false;
 
  // Replace icon with the play icon
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
 
const nextTrack = () => {
  // Go back to the first track if the
  // current one is the last in the track list
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
 
  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}
 
const prevTrack = () => {
  // Go back to the last track if the
  // current one is the first in the track list
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
   
  // Load and play the new track
  loadTrack(track_index);
  playTrack();
}

const seekTo = () => {
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  seekto = curr_track.duration * (seek_slider.value / 100);
 
  // Set the current track position to the calculated seek position
  curr_track.currentTime = seekto;
}
 
const setVolume = () => {
  // Set the volume according to the
  // percentage of the volume slider set
  curr_track.volume = volume_slider.value / 100;
}
 
const seekUpdate = () => {
  let seekPosition = 0;
 
  // Check if the current track duration is a legible number
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;
 
    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);
 
    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
 
    // Display the updated duration
    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}