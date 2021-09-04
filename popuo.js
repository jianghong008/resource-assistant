/**
 * media helper
 * v1
 * jh
 */

const config = {
    choose_el: 'media-helper-choose',
    auto_download: 0,
    resource: 'media',
    choose: 0,
    version: '1.0',
    list: [],
}

//数据监听
chrome.runtime.onMessage.addListener((m) => {
    switch (m.cmd) {
        case 'switchChooseMode':
            config.choose = m.data;
            break;
        case 'set_list':
            //加载资源到列表
            config.list = m.data;
            load_list();
            break;
        default:
            console.log(m.data)
            break;
    }
})

function set_list(obj) {
    const o = {...obj}
    o.state = 0;
    o.speed = 0;
    config.list.push(o);
    load_list();
}

//渲染下载列表
function load_list() {
    const list_box = $('#file-list');
    let s = '';
    for (let i = 0; i < config.list.length; i++) {
        s += `
        <li>
            <div class="info">
                <div class="title">${config.list[i].title}</div>
                <span class="btn ${config.list[i].state ? 'btn-no' : 'btn-yes'}" data-index="${i}">${config.list[i].state ? '取消' : '下载'}</span>
            </div>
            <div class="speed" style="width:${config.list[i].speed}%;"></div>
        </li>
        `
    }
    list_box.html(s);
    //事件
    $('#file-list>li').click((e)=>{
        let index = $(e.target).data('index')
        downloads_start(index)
    });
}

/**
 * 下载资源
 * @param {number} index 
 */
function downloads_start(index) {
    chrome.downloads.download({
        url:config.list[index].url,
        filename:config.list[index].title
    },()=>{
        config.list[index].state = 2;
        config.list[index].speed = 100;
    })
}


function open_tabs(url='') {
    if(!url){
        return
    }
    chrome.tabs.create({
        url:url,

    })
}

/**
 * 给当前激活窗口发送信息
 * @param {object} msg
 */
 function sendMessageToActive(msg = {}, cmd = 'msg') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            data:msg, cmd
        })
    })
}

//初始化
!function () {
    sendMessageToActive('获取列表','get_list');
}()