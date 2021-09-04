/**
 * media helper
 * v1 后台脚本
 * jh
 */

//公共数据
const data = {
    active_tab:{},
    auto_download:0,
    resource:'media',
    choose:0,
    version:'1.0'
}
chrome.runtime.onInstalled.addListener(() => {
    //右键菜单
    chrome.contextMenus.create({
        title: 'media helper【元素选择】',
        id: 'media-helper-1',
    })
    //菜单事件
    chrome.contextMenus.onClicked.addListener((e,t)=>{
        data.active_tab = t;
        switch(e.menuItemId){
            case 'media-helper-1':
                switchChooseMode(e.menuItemId)
                break
        }
        console.log(1)
    })
});

/**
 * 设置元素选择模式，更新菜单
 * @param {string} mid 
 */
function switchChooseMode(mid=''){
    data.choose = data.choose?0:1;
    let title = 'media helper【元素选择】';
    if(data.choose==1){
        title = 'media helper【停止选择】';
    }
    chrome.contextMenus.update(mid,{
        title
    })
    sendMessageToActive(data.choose,'switchChooseMode')
}

//数据监听
chrome.runtime.onMessage.addListener((m, s) => {
    const tab = s.tab;
    
})

/**
 * 设置缓存数据
 * @param {string} key 
 * @param {object} val 
 */
function cache_set(key,val){
    const obj = {};
    obj[key] = val
    chrome.storage.local.set(obj);
}

/**
 * 获取缓存数据
 * @param {string} key 
 * @param {function} callback 
 */
 function cache_get(key,callback){
    chrome.storage.local.get(['key'], callback);
}


//请求拦截
chrome.webRequest.onResponseStarted.addListener(
    function (details) {
        let temp = details.url.match(/\.(mp3|mp4|wav|ogg|m4a|aac|mpeg|m3u8)/);
        if (details.type == data.resource || temp) {
            sendMessageToActive({
                type: data.resource,
                requestId: details.requestId,
                url: details.url
            },'resource')
        }
        return { cancel: false };
    },
    { urls: ['*://*/*'] }
);
/**
 * 给当前激活窗口发送信息
 * @param {object} msg
 */
function sendMessageToActive(msg = {}, cmd = 'msg') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if(!tabs[0]){
            return
        }
        chrome.tabs.sendMessage(tabs[0].id, {
            data:msg, cmd
        })
    })
}
