

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
  "timeSlider":document.getElementById("timeSlider"),
  "autoPlay":document.getElementById("autoPlay"),
  "sleepTimer":document.getElementById("sleepTimer"),
  "themeBackgroundImg":document.getElementById("themeBackgroundImg"),
  "resetTheme":document.getElementById("resetTheme"),
  "estimatedTimeLength":document.getElementById("estimatedTimeLength"),
} 
let tracks = []
let currentTrack = -1;
let audioElement = document.createElement("audio")
let volume = 1;
const compressionEnabled = false

async function CorsProxyFetch(url="https://pastebin.com/raw/K0DUCQNt"){
  return await (await fetch("https://corsproxy.io/?"+encodeURIComponent(url))).text()
}

async function LoadDataUrlFromFile(file){
  const reader = new FileReader();
  reader.readAsDataURL(file)
  return new Promise((r)=>{
    reader.onload = ()=>{
      r(reader.result);
    }
  })
}

const mutag = window.mutag;
let playlistEstimatedLength = 0
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

  let trackName = file.name
  try{
    let tags = await mutag.fetch(file)
    // I can't believe this is the tag name.
    trackName = tags["TIT2"] || file.name
    console.log("b")
  }catch(err){}

  // let tmpAudio = new Audio(audioSrc)
  // console.log(tmpAudio)
  // tmpAudio.load()
  // tmpAudio.preload = true
  // setTimeout(()=>{
  //   if(isNaN(tmpAudio.duration)||!isFinite(tmpAudio.duration))return
  //   tmpAudio.name
  //   console.log(tmpAudio.duration)
  //   playlistEstimatedLength+=tmpAudio.duration
  //   ELEMENTS.estimatedTimeLength.textContent = playlistEstimatedLength/60
  //   tmpAudio.remove()
  // }, 100)

  if(compressionEnabled==true){
    audioSrc = fflate.strToU8(audioSrc)
    audioSrc = fflate.strFromU8(
      fflate.compressSync(buf),
      true
    );
  }
  //audioSrc = LZString.compress(audioSrc)
  // let audio = document.createElement("audio")
  // audio.controls = false
  // audio.setAttribute("name", file.name)

  // audio.src = audioSrc
  // tracks.push(audio)
  tracks.push([trackName, audioSrc])
  // ELEMENTS.playlist.appendChild(audio)
}

// TODO: Find someway to optimize this
function AddTrackButtons(){
  ELEMENTS.playlist.innerHTML = ""
  for(let i = 0;i<tracks.length;i++){
    let a = i
    let e = tracks[a][1]
    let div = document.createElement("div")
    div.classList.add("track")
    
    let nameButton = document.createElement('button')
    nameButton.textContent = tracks[i][0]
    nameButton.onclick = ()=>{
      StopAllTracks()
      currentTrack = a-1
      PlayNextTrack()
    }
    div.appendChild(nameButton)

    let deleteButton = document.createElement("button")
    deleteButton.textContent = "Remove"
    deleteButton.style.color = "red"
    deleteButton.onclick = ()=>{
      if(currentTrack==a){
        // StopAllTracks()
        // currentTrack = currentTrack-1
      }
      tracks.splice(a,1)
      AddTrackButtons()
    }
    div.appendChild(deleteButton)

    ELEMENTS.playlist.appendChild(div)
  }

}

ELEMENTS.fileInput.addEventListener('change', async function selectedFileChanged() {
    if (this.files.length === 0) {
      console.log('No file selected.');
      return;
    }
    

    ELEMENTS.trackCount.textContent = "Loading..."
    let originalCount = tracks.length
    for(let i = 0;i<this.files.length;i++){
        ELEMENTS.trackCount.textContent = `Loading ${i}/${this.files.length} + ${originalCount}`
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
  //audioElement.src = LZString.decompress(tracks[currentTrack][1])
  let audioSrc = tracks[currentTrack][1]
  if(compressionEnabled==true){
    audioSrc = fflate.decompressSync(
      fflate.strToU8(audioSrc, true)
    );
  }
audioElement.src = audioSrc
  audioElement.play()
  LoadVolumeChange()
  ELEMENTS.current.textContent = tracks[currentTrack][0]
  document.title = "SPLP - "+ELEMENTS.current.textContent
  UpdateMediaSession()
}
ELEMENTS.next.addEventListener("click", PlayNextTrack)
audioElement.addEventListener("ended", ()=>{
  if(ELEMENTS.autoPlay.checked==true)PlayNextTrack()
})

let prevTime = 100;
function UpdateStatus(){
  if(tracks.length==0)return;
  if(currentTrack==-1)PlayNextTrack()
  
  // Update time status
  const formatTime = seconds => new Date(seconds * 1000).toISOString().slice(11, 19);
  const timeString = formatTime(audioElement.currentTime);
  const durationString = formatTime(audioElement.duration);
  ELEMENTS.time.textContent = timeString + " / " + durationString;

  ELEMENTS.status.textContent = audioElement.paused?"Paused":"Playing"

  if(ELEMENTS.timeSlider.value!=prevTime)audioElement.currentTime = ELEMENTS.timeSlider.value
  ELEMENTS.timeSlider.max = audioElement.duration
  ELEMENTS.timeSlider.min = 0
  ELEMENTS.timeSlider.value = audioElement.currentTime
  prevTime = ELEMENTS.timeSlider.value
}
setInterval(UpdateStatus, 100)

ELEMENTS.timeSlider.addEventListener("change", function(){

})

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
if(localStorage.getItem("background")!=null)document.body.style.backgroundImage=localStorage.getItem('background')

ELEMENTS.themeBackgroundImg.addEventListener("change", async function(){
  if (this.files.length === 0) {
    console.log('No file selected.');
    return;
  }
  let imgUrl = await LoadDataUrlFromFile(this.files[0])
  document.body.style.backgroundImage = `url(${imgUrl})`
  localStorage.setItem("background", document.body.style.backgroundImage)
})
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
ELEMENTS.resetTheme.addEventListener('click', function(){
  localStorage.removeItem("theme")
  localStorage.removeItem("background")
})

setInterval(function(){
  if(ELEMENTS.sleepTimer.value<=0)PauseTrack()
  if(audioElement.paused==false)ELEMENTS.sleepTimer.value--;
  if(ELEMENTS.sleepTimer.value<=0)PauseTrack()
}, 60000)

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
