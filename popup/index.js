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
};

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
                <i>${config.list[i].s_name}</i>
                <div class="title">${(i+1)+'、'+config.list[i].title}</div>
                <span class="btn btn-def" data-index="${i}" style="display:${config.list[i].media_type=='other' ? 'none' : 'inline'}">查看</span>
                <span class="btn ${config.list[i].state ? 'btn-no' : 'btn-yes'}" data-index="${i}">${config.list[i].state ? '取消' : '下载'}</span>
            </div>
            <div class="speed" style="width:${config.list[i].speed}%;"></div>
        </li>
        `
    }
    list_box.html(s);
    
    //播放事件
    $('#file-list>li span:nth-of-type(1)').click((e)=>{
        let index = $(e.target).data('index')
        media_play(index)
    });
    //下载事件
    $('#file-list>li span:nth-of-type(2)').click((e)=>{
        let index = $(e.target).data('index')
        downloads_start(index)
    });
}

/**
 * 播放媒体
 * @param {number} index 
 * @returns 
 */
function media_play(index){
    if(!config.list[index]){
        return
    }
    $('.preview').css('display','block')
    // open_tabs(config.list[index].url)
    if(config.list[index].media_type=='audio'){
        $('#audio-play').attr('src',config.list[index].url)
        $('#audio-play').css('display','inline-block')

        $('#audio-play').siblings().attr('src','')
        $('#audio-play').siblings().css('display','none')
    }else if(config.list[index].media_type=='video'){
        $('#video-play').attr('src',config.list[index].url)
        $('#video-play').css('display','inline-block')

        $('#video-play').siblings().attr('src','')
        $('#video-play').siblings().css('display','none')
    }else if(config.list[index].media_type=='image'){
        $('#image-play').attr('src',config.list[index].url)
        $('#image-play').css('display','inline-block')

        $('#image-play').siblings().attr('src','')
        $('#image-play').siblings().css('display','none')
    }
    
}

/**
 * 下载资源
 * @param {number} index 
 */
function downloads_start(index) {
    if(!config.list[index]){
        return
    }
    chrome.downloads.download({
        url:config.list[index].url,
        filename:(index+1)+'、'+config.list[index].title
    },()=>{
        config.list[index].state = 2;
        config.list[index].speed = 100;
    })
}

/**
 * 打开新窗口
 * @param {string} url 
 * @returns 
 */
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
 * @param cmd
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
    let popup_title = chrome.i18n.getMessage("popup_title");
    $('#popup_title').text(popup_title);

    sendMessageToActive(null,'get_list');
}()