//Automated by https://codepen.io/TheRealCrafterboy27/full/GRbPBeb
const ELEMENTS = {
  "fileInput":document.getElementById("fileInput"),
  "controls":document.getElementById("controls"),
  "current":document.getElementById("current"),
  "time":document.getElementById("time"),
  "play":document.getElementById("play"),
  "pause":document.getElementById("pause"),
  "next":document.getElementById("next"),
  "shuffle":document.getElementById("shuffle"),
  "status":document.getElementById("status"),
  "volume":document.getElementById("volume"),
  "playlist":document.getElementById("playlist"),
}
let tracks = []
let currentTrack = -1;

async function LoadDataUrlFromFile(file){
  const reader = new FileReader();
  reader.readAsDataURL(file)
  return new Promise((r)=>{
    reader.onload = ()=>{
      r(reader.result);
    }
  })
}

async function AddAudio(file){

  if(typeof(file)!="undefined" && file.type == "application/x-zip-compressed"){
    alert("No zip support yet :(")
    return;
    var new_zip = new JSZip();

    let zip = await new_zip.loadAsync(file)
    let files = await zip.files
    for(let file of Object.keys(files)){
      if(!files[file].dir){
        AddAudio(await files[file].async('blob'));
      }
    }
    return;
  }

  let label = document.createElement('p')
  label.textContent = file.name
  ELEMENTS.playlist.appendChild(label)

  let audioSrc = await LoadDataUrlFromFile(file)
  let audio = document.createElement("audio")
  audio.controls = false
  audio.setAttribute("name", file.name)

  audio.src = audioSrc
  tracks.push(audio)
  ELEMENTS.playlist.appendChild(audio)
}

ELEMENTS.fileInput.addEventListener('change', async function selectedFileChanged() {
    if (this.files.length === 0) {
      console.log('No file selected.');
      return;
    }
    

    for(let i = 0;i<this.files.length;i++){
        let file = this.files[i]
        await AddAudio(file);
    }
    
});

function PlayNextTrack(){
  if(tracks.length==0)return;
  if(tracks[currentTrack]){
    tracks[currentTrack].pause()
    tracks[currentTrack].currentTime = 0;
  };
  currentTrack = (currentTrack+1)%tracks.length;
  tracks[currentTrack].play()
  ELEMENTS.current.textContent = tracks[currentTrack].getAttribute("name")

  tracks[currentTrack].addEventListener("ended", PlayNextTrack)
}
ELEMENTS.next.addEventListener("click", PlayNextTrack)

function UpdateStatus(){
  if(tracks.length==0)return;
  if(currentTrack==-1)PlayNextTrack()
  
  // Update time status
  const date = new Date(null);
  date.setSeconds(tracks[currentTrack].currentTime);
  const timeString = date.toISOString().substr(11, 8);
  date.setSeconds(tracks[currentTrack].duration);
  const durationString = date.toISOString().substr(11, 8);
  ELEMENTS.time.textContent = timeString + " / " + durationString;

  ELEMENTS.status.textContent = tracks[currentTrack].paused?"Paused":"Playing"
}
setInterval(UpdateStatus, 100)

ELEMENTS.play.addEventListener("click", ()=>{
  if(tracks.length==0)return;
  tracks[currentTrack].play()
})
ELEMENTS.pause.addEventListener("click", ()=>{
  if(tracks.length==0)return;
  tracks[currentTrack].pause()
})
ELEMENTS.volume.addEventListener("input", ()=>{
  for(let track of tracks){
    track.volume = ELEMENTS.volume.value/100;
  }
})

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}
ELEMENTS.shuffle.addEventListener("click", ()=>{
  if(tracks.length==0)return;
  shuffle(tracks);
  ELEMENTS.playlist.innerHTML = ""
  tracks.forEach(e=>{
    let label = document.createElement('p')
    label.textContent = e.getAttribute("name")
    ELEMENTS.playlist.appendChild(label)
  })

  currentTrack = -1;
  PlayNextTrack();
})
