let move_sfx = new Audio("media/s1.mp3");

const sfxSelect = (path) => {
    move_sfx = new Audio(`${path}`);
    move_sfx.volume = 0.6;
}

const sfxSelector = document.getElementById("sfxSelector");
sfxSelector.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
  }
});

// music player by sayantanm19 --> https://www.geeksforgeeks.org/create-a-music-player-using-javascript/

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
    bgColor: "rgb(240, 98, 121, 0.45)",
    bodyColor: "pink"
  },
  {
    name: "campo de girassol",
    artist: "shibayan records",
    image: "media/cdgir.png",
    path: "media/bg2.mp3",
    bgColor: "rgb(80, 70, 183, 0.4)",
    bodyColor: "#e1deff"
  },
  {
    name: "garota de ipanema",
    artist: "lisa ono",
    image: "media/lisa.png",
    path: "media/bg3.mp3",
    bgColor: "rgb(3, 1, 2, 0.6)",
    bodyColor: "#707070"
  },
  {
    name: "don't go breaking my heart",
    artist: "roger nichols & the small circle of friends",
    image: "media/breaking.png",
    path: "media/bg4.mp3",
    bgColor: "rgb(196, 64, 2, 0.5)",
    bodyColor: "#ffdec7"
  },
  {
    name: "misty mauve (1991 remix)",
    artist: "masayuki suzuki",
    image: "media/martini.png",
    path: "media/bg5.mp3",
    bgColor: "rgb(3, 5, 150, 0.5)",
    bodyColor: "#c3a9f5"
  },
  {
    name: "two cents party",
    artist: "erikson jayanto",
    image: "media/twocent.png",
    path: "media/bg6.mp3",
    bgColor: "rgb(97, 97, 97, 0.6)",
    bodyColor: "#c7c7c7"
  },
  {
    name: "romantico",
    artist: "800 cherries",
    image: "media/cherry.png",
    path: "media/bg7.mp3",
    bgColor: "rgb(0, 135, 25, 0.6)",
    bodyColor: "#e3ffe3"
  },
  {
    name: "maiden's longing",
    artist: "yu-peng chen",
    image: "media/maidens.png",
    path: "media/bg8.mp3",
    bgColor: "rgb(86, 155, 176, 0.5)",
    bodyColor: "#d9f3ff"
  },
  {
    name: "shangri-la",
    artist: "denki groove",
    image: "media/shangri.jpg",
    path: "media/bg9.mp3",
    bgColor: "rgb(199, 6, 80, 0.6)",
    bodyColor: "#fca7ae"
  }
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

  document.body.style.backgroundColor = track_list[track_index].bodyColor;
 
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
 
function checkMobile() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isMobile;
}

const playTrack = () => {
  if (firstInteraction) { return; }
  // Play the loaded track
  if (!checkMobile()) {
    curr_track.play();
  }
  isPlaying = true;
 
  // Replace icon with the pause icon
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
 
const pauseTrack = () => {
  if (firstInteraction) { return; }
  // Pause the loaded track
  curr_track.pause();
  isPlaying = false;
 
  // Replace icon with the play icon
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
 
const nextTrack = () => {
  if (firstInteraction) { return; }
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
  if (firstInteraction) { return; }
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
  let seekto = curr_track.duration * (seek_slider.value / 100);
 
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

const sfxB = document.getElementById("muteSfx");
let mutedSfx = false
const muteSfx = () => {
  console.log('sfx muted');
  if (!mutedSfx)  {
    mutedSfx = true;
    sfxB.innerHTML = 'unmute sfx';
    sfxB.style.color = "#f7d2f3";
    sfxB.style.backgroundColor = "#75386e";
  }
  else {
    mutedSfx = false;
    sfxB.innerHTML = 'mute sfx';
    sfxB.style.color = "#10301a";
    sfxB.style.backgroundColor = "rgb(176, 255, 188, 0.9)";
  }
}
