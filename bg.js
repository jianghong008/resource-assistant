/**
 * media helper
 * v1 后台脚本
 * jh
 */

//公共数据
const sys_conf = 'sys_conf';
const data = {
    active_tab:{},
    auto_download:0,
    path:"\.(mp3|mp4|wav|ogg|m4a|aac|mpeg|m3u8)",
    el_selector:'',
    file_type:'',
    choose:0,
    version:'1.0'
};

chrome.runtime.onInstalled.addListener(() => {
    // //右键菜单
    // chrome.contextMenus.create({
    //     title: 'media helper【设置】',
    //     id: 'media-helper-1'
    // })
    // //菜单事件
    // chrome.contextMenus.onClicked.addListener((e,t)=>{
    //     data.active_tab = t;
    //     // switch(e.menuItemId){
    //     //     case 'media-helper-1':
    //     //         switchChooseMode(e.menuItemId)
    //     //         break
    //     // }
    //
    // })
    chrome.storage.local.clear();
});

/**
 * 设置元素选择模式，更新菜单
 * @param {string} mid 
 */
function switchChooseMode(mid=''){
    data.choose = data.choose?0:1;
    let title = 'media helper【元素选择】';
    if(data.choose===1){
        title = 'media helper【停止选择】';
    }
    chrome.contextMenus.update(mid,{
        title
    });
    sendMessageToActive(data.choose,'switchChooseMode')
}

//数据监听
chrome.runtime.onMessage.addListener((m, s) => {
    const tab = s.tab;
    switch (m.cmd) {
        case "conf":
            cache_set(sys_conf,m.data)
            break
        case "keep":
            console.log('保持连接')
            break
    }
});

/**
 * 设置缓存数据
 * @param {string} key 
 * @param {object} val 
 */
function cache_set(key,val){
    if(!val){
        return
    }
    const obj = {};
    obj[key] = val
    chrome.storage.local.set(obj);
}

/**
 * 获取缓存数据
 * @param {string} key
 * @param {function} callback
 */
function cache_get(key, callback) {
    chrome.storage.local.get([key], callback);
}

/**
 * 请求拦截-捕获资源(此方法有个小问题，已经缓存的资源无法捕获，需要强制刷新浏览器)
 */
chrome.webRequest.onResponseStarted.addListener(
    function (details) {
        let reg = new RegExp(data.path,'ig');
        if (details.type === data.file_type || !data.file_type || data.file_type === 'all') {
            let temp = details.url.match(reg);
            
            if(!temp && data.path){
                return { cancel: false };
            }
            
            sendMessageToActive({
                type: data.file_type?data.file_type:'all',
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
 * @param cmd
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


/**
 * 加载配置
 */
cache_get(sys_conf,(res)=>{
    if(res[sys_conf]){
        for (let k in res[sys_conf]){
            if(typeof res[sys_conf][k] === 'string'){
                data[k] = res[sys_conf][k];
            }

        }
    }

});
