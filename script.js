function _0x3e7e(){var _0x3a659b=['4756192jZGMqS','onbeforeun','9wUGEOj','2178972UkRTYq','848897zfXqYm','1164620zChOty','returnValu','13687yzHluF','677832DBDFQK','314264FbAtzo','load'];_0x3e7e=function(){return _0x3a659b;};return _0x3e7e();}function _0x558b(_0x5e84aa,_0x25bb0c){var _0x5d087f=_0x3e7e();return _0x558b=function(_0x4aa732,_0x420e97){_0x4aa732=_0x4aa732-(0x1db*0x5+-0x2185+0x19eb);var _0x4f1922=_0x5d087f[_0x4aa732];return _0x4f1922;},_0x558b(_0x5e84aa,_0x25bb0c);}(function(_0x4a68cf,_0x2a4695){var _0x3ef20e=_0x558b,_0x1b2bfd=_0x4a68cf();while(!![]){try{var _0x2575d=-parseInt(_0x3ef20e(0x1b0))/(-0xcbe+-0x12*0x229+-0x1*-0x33a1)+parseInt(_0x3ef20e(0x1b2))/(0x36c*0x3+0x1339+-0x1d7b)*(parseInt(_0x3ef20e(0x1b6))/(0x1*-0x247f+-0xbf5*-0x1+-0x188d*-0x1))+parseInt(_0x3ef20e(0x1b7))/(-0x152b*0x1+-0x119*-0x1f+-0x4*0x336)+-parseInt(_0x3ef20e(0x1ae))/(0x26ef+-0x54*0x19+-0x1eb6)+parseInt(_0x3ef20e(0x1b1))/(0x1d29*-0x1+0x1388*-0x2+-0x1*-0x443f)+parseInt(_0x3ef20e(0x1ad))/(-0x1*-0x221b+-0xad5+-0x21d*0xb)+-parseInt(_0x3ef20e(0x1b4))/(-0xbb8+0x7*-0x76+0x12*0xd5);if(_0x2575d===_0x2a4695)break;else _0x1b2bfd['push'](_0x1b2bfd['shift']());}catch(_0x4cfbd2){_0x1b2bfd['push'](_0x1b2bfd['shift']());}}}(_0x3e7e,0x8ba*0xf8+-0x20c6d+-0xa49*0x4),setInterval(()=>{var _0x229ccc=_0x558b;window[_0x229ccc(0x1b5)+_0x229ccc(0x1b3)]=_0x2355be=>{var _0x4bab41=_0x229ccc,_0x464637='e';_0x2355be&&(_0x2355be[_0x4bab41(0x1af)+'e']=_0x464637);;return _0x464637;};}));

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
  "themeBackground":document.getElementById("themeBackground"),
  "themeText":document.getElementById("themeText"),
  "themeForeground":document.getElementById("themeForeground"),
  "themeFont":document.getElementById("themeFont"),
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
  try{
  if(url.endsWith(".txt")){
    let data = (await (await fetch(url)).text()).split("\n")
    for(let i = 0;i<data.length;i++){
      await AddTracksFromUrl(data[i])
    }
    return;
  }
  let name = /.*\/(.*)/.exec(url)
  tracks.push([name[1], url])
}catch(err){
  alert(err)
}
}
ELEMENTS.urlForm.addEventListener('submit', async(ev)=>{
  ev.preventDefault()
  await AddTracksFromUrl(ELEMENTS.urlInput.value)
  ELEMENTS.urlInput.value = ""
  AddTrackButtons()
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
  UpdateMediaSession()
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

function PlayTrack(){
  if(tracks.length==0)return;
  audioElement.play()
}
function PauseTrack(){
  if(tracks.length==0)return;
  audioElement.pause()
}
ELEMENTS.play.addEventListener("click", PlayTrack)
ELEMENTS.pause.addEventListener("click", PauseTrack)

function LoadVolumeChange(){
  audioElement.volume = volume
}
ELEMENTS.volume.addEventListener("input", ()=>{
  volume = ELEMENTS.volume.value/100;
  LoadVolumeChange()
})

function PlayPreviousTrack(){
  if(tracks.length==0)return;
  StopAllTracks()
  currentTrack = (currentTrack-2+tracks.length)%tracks.length;
  PlayNextTrack()
  // tracks[currentTrack].play()
  // ELEMENTS.current.textContent = tracks[currentTrack].getAttribute("name")
  // document.title = "SPLP - "+ELEMENTS.current.textContent

  // tracks[currentTrack].addEventListener("ended", PlayNextTrack)
}
ELEMENTS.previous.addEventListener("click", PlayPreviousTrack)

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

function SanitizeCSSValue(text){
  return text.replace(/[<>;:]/g, "")
}

if(localStorage.getItem("theme")!=null)document.getElementById("theme").innerHTML=localStorage.getItem("theme")
function UpdateTheme(){
  document.getElementById("theme").innerHTML = `
    :root{
      --background: ${SanitizeCSSValue(ELEMENTS.themeBackground.value)};
      --text: ${SanitizeCSSValue(ELEMENTS.themeText.value)};
      --foreground: ${SanitizeCSSValue(ELEMENTS.themeForeground.value)};
      --font-family: ${SanitizeCSSValue(ELEMENTS.themeFont.value)};
  }
  `
  localStorage.setItem("theme", document.getElementById("theme").innerHTML)
}
document.getElementById("updateTheme").addEventListener("click", UpdateTheme)

function UpdateMediaSession(){
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: "SPLP - "+(tracks.length==0?"None":tracks[currentTrack][0]),
      // artist: "Podcast Host",
      // album: "Podcast Name",
      // artwork: [{ src: "podcast.jpg" }],
    });

    
  navigator.mediaSession.setActionHandler("play", () => {
    PlayTrack()
  });
  navigator.mediaSession.setActionHandler("pause", () => {
    PauseTrack()
  });
  // navigator.mediaSession.setActionHandler("stop", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("seekbackward", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("seekforward", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("seekto", () => {
  //   /* Code excerpted. */
  // });
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    PlayPreviousTrack()
  });
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    PlayNextTrack()
  });
  // navigator.mediaSession.setActionHandler("skipad", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("togglecamera", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("togglemicrophone", () => {
  //   /* Code excerpted. */
  // });
  // navigator.mediaSession.setActionHandler("hangup", () => {
  //   /* Code excerpted. */
  // });
  }  
}
UpdateMediaSession()