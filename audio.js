let move_sfx_path = "media/s1.mp3";

const sfxSelect = (path) => {
    move_sfx_path = path;
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
    bgColor: "rgb(240, 98, 121, 0.45)"
  },
  {
    name: "campo de girassol",
    artist: "shibayan records",
    image: "media/cdgir.png",
    path: "media/bg2.mp3",
    bgColor: "rgb(36, 34, 102, 0.5)"
  },
  {
    name: "garota de ipanema",
    artist: "lisa ono",
    image: "media/lisa.png",
    path: "media/bg3.mp3",
    bgColor: "rgb(28, 27, 27, 0.9)"
  },
  {
    name: "don't go breaking my heart",
    artist: "roger nichols & the small circle of friends",
    image: "media/breaking.png",
    path: "media/bg4.mp3",
    bgColor: "rgb(252, 82, 3, 0.5)"
  },
  {
    name: "maiden's longing",
    artist: "yu-peng chen",
    image: "media/maidens.png",
    path: "media/bg5.mp3",
    bgColor: "rgb(86, 155, 176, 0.7)"
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
  if (firstInteraction) { return; }
  // Play the loaded track
  curr_track.play();
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