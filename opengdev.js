// alert('b')
// if(localStorage.getItem("dev")==true)OpenGDevTools()
window.addEventListener("keypress", (ev)=>{
    if(ev.ctrlKey==true && ev.shiftKey == true && ev.key=="K"){
        // localStorage.setItem("dev", localStorage.getItem("dev")=="false")
        // if(localStorage.getItem("dev")==true)OpenGDevTools()
        OpenGDevTools()
    }
})