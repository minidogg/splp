window.addEventListener("beforeunload",confirmExit)
    function confirmExit() {
        return "You have attempted to leave this page. Are you sure?";
    }
//Automated by https://codepen.io/TheRealCrafterboy27/full/GRbPBeb
const ELEMENTS = {
  "fileInput":document.getElementById("fileInput"),
  "controls":document.getElementById("controls"),
  "current":document.getElementById("current"),
  "time":document.getElementById("time"),
  "play":document.getElementById("play"),
  "pause":document.getElementById("pause"),
  "next":document.getElementById("next"),
  "previous":document.getElementById("previous"),
  "shuffle":document.getElementById("shuffle"),
  "status":document.getElementById("status"),
  "volume":document.getElementById("volume"),
  "playlist":document.getElementById("playlist"),
  "playlistHeader":document.getElementById("playlistHeader"),
  "trackCount":document.getElementById("trackCount"),
  "urlForm":document.getElementById("urlForm"),
  "urlInput":document.getElementById("urlInput"),
}
let tracks = []
let currentTrack = -1;
let audioElement = document.createElement("audio")
let volume = 1;

async function LoadDataUrlFromFile(file){
  const reader = new FileReader();
  reader.readAsDataURL(file)
  return new Promise((r)=>{
    reader.onload = ()=>{
      r(reader.result);
    }
  })
}

async function AddAudio(file, dataUrl=undefined){

  if(typeof(file)!="undefined" && file.type == "application/x-zip-compressed"){
    alert("ZIP Support hasn't been implemented")
    return;
    var new_zip = new JSZip();

    let zip = await new_zip.loadAsync(file)
    let files = await zip.files
    for(let file of Object.keys(files)){
      if(!files[file].dir){
        let dataUrl = await files[file].async('text');
        AddAudio(await files[file], dataUrl);
      }
    }
    return;
  }

  let audioSrc = dataUrl==undefined?await LoadDataUrlFromFile(file):dataUrl
  // let audio = document.createElement("audio")
  // audio.controls = false
  // audio.setAttribute("name", file.name)

  // audio.src = audioSrc
  // tracks.push(audio)
  tracks.push([file.name, audioSrc])
  // ELEMENTS.playlist.appendChild(audio)
}

function AddTrackButtons(){
  for(let i = 0;i<tracks.length;i++){
    let e = tracks[i][1]
    let button = document.createElement('button')
    button.textContent = tracks[i][0]
    button.style.display = "block"
    button.onclick = ()=>{
      StopAllTracks()
      currentTrack = i-1
      PlayNextTrack()
    }
    ELEMENTS.playlist.appendChild(button)
  }

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
    ELEMENTS.trackCount.textContent = tracks.length
    AddTrackButtons()
});

async function AddTracksFromUrl(url){
  if(url.endsWith(".txt")){
    let data = (await (await fetch(url)).text()).split("\n")
    for(let i = 0;i<data.length;i++){
      AddTracksFromUrl(data[i])
    }
    return;
  }
  tracks.push([/.*\/(.*)/.exec(url)[1], url])
}
ELEMENTS.urlForm.addEventListener('submit', async(ev)=>{
  ev.preventDefault()
  ELEMENTS.urlInput.value = ""
  await AddTracksFromUrl(ELEMENTS.urlInput.value)
})

function StopAllTracks(){
  audioElement.pause()
  audioElement.currentTime = 0;
  // tracks.forEach(e=>{
  //   e.pause()
  //   e.currentTime = 0;
  // })
}

function PlayNextTrack(){
  if(tracks.length==0)return;
  StopAllTracks()

  currentTrack = (currentTrack+1)%tracks.length;
  audioElement.src = tracks[currentTrack][1]

  audioElement.play()
  LoadVolumeChange()
  ELEMENTS.current.textContent = tracks[currentTrack][0]
  document.title = "SPLP - "+ELEMENTS.current.textContent

}
ELEMENTS.next.addEventListener("click", PlayNextTrack)
audioElement.addEventListener("ended", PlayNextTrack)


function UpdateStatus(){
  if(tracks.length==0)return;
  if(currentTrack==-1)PlayNextTrack()
  
  // Update time status
  const timeString = new Date(audioElement.currentTime * 1000).toISOString().substr(11, 8);
  const durationString = new Date(audioElement.duration * 1000).toISOString().substr(11, 8);
  ELEMENTS.time.textContent = timeString + " / " + durationString;

  ELEMENTS.status.textContent = audioElement.paused?"Paused":"Playing"

}
setInterval(UpdateStatus, 100)

ELEMENTS.play.addEventListener("click", ()=>{
  if(tracks.length==0)return;
  audioElement.play()
})
ELEMENTS.pause.addEventListener("click", ()=>{
  if(tracks.length==0)return;
  audioElement.pause()
})
function LoadVolumeChange(){
  audioElement.volume = volume
}
ELEMENTS.volume.addEventListener("input", ()=>{
  volume = ELEMENTS.volume.value/100;
  LoadVolumeChange()
})
ELEMENTS.previous.addEventListener("click", ()=>{
  if(tracks.length==0)return;
  StopAllTracks()
  currentTrack = (currentTrack-2+tracks.length)%tracks.length;
  PlayNextTrack()
  // tracks[currentTrack].play()
  // ELEMENTS.current.textContent = tracks[currentTrack].getAttribute("name")
  // document.title = "SPLP - "+ELEMENTS.current.textContent

  // tracks[currentTrack].addEventListener("ended", PlayNextTrack)
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
  AddTrackButtons()

  currentTrack = -1;
  PlayNextTrack();
})
