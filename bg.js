let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        title:'media helper设置',
        id:'media-helper-1',
    },()=>{
        console.log(1)
    })
});