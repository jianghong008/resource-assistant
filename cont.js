// window.document.body.style.background = 'gray';
alert('注入成功')

chrome.runtime.onMessage = (e)=>{
    console.log(e)
}
