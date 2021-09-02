let cur_tab = {}
chrome.windows.getCurrent().then((t)=>{
    cur_tab = t;
    // chrome.scripting.executeScript(t.id, {code:"document.body.bgColor='red'"})
})
//
const btn = document.querySelector('.btn')
btn.onclick = ()=>{
    chrome.tabs.sendMessage(cur_tab.id,'hello')
    console.log(cur_tab.id)
}