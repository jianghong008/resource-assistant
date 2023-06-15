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
    resources:[],
    list: [],
    types:[],
    choose_list:[],
};

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

//数据监听
chrome.runtime.onMessage.addListener((m) => {
    switch (m.cmd) {
        case 'switchChooseMode':
            config.choose = m.data;
            break;
        case 'set_list':
            //加载资源到列表
            config.list = [...m.data];
            config.resources = [... m.data];
            load_list(true);
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
    load_list(true);
}

//渲染下载列表
function load_list(first=false) {
    const list_box = $('#file-list');
    let type_s = $('#select_type').val();
    
    let s = '';
    config.types = []
    
    for (let i = 0; i < config.list.length; i++) {
        //文件列表
        if(config.list[i].media_type==type_s || type_s==='all' || type_s===null){
            config.choose_list.push(config.list[i])
            let resource_type = `<i>${config.list[i].s_name}</i>`
            if(config.list[i].media_type=='image'){
                resource_type = `<img src="${config.list[i].url}"/>`
            }
            
            s += `
            <li>
                <div class="info" title="${config.list[i].title}">
                    ${resource_type}
                    <div class="title">${config.list[i].title}</div>
                    <span class="btn btn-def" data-index="${i}" style="display:${config.list[i].media_type=='other' ? 'none' : 'inline'}">查看</span>
                    <span class="btn ${config.list[i].state ? 'btn-no' : 'btn-yes'}" data-index="${i}">${config.list[i].state ? '取消' : '下载'}</span>
                </div>
                <div class="speed" style="width:${config.list[i].speed}%;"></div>
            </li>
            `
        }
        
        //文件类型列表
        if(config.types.indexOf(config.list[i].media_type)<0){
            config.types.push(config.list[i].media_type)
        }else{
            console.log(config.list[i].media_type)
        }
        
    }
    list_box.html(s);
    load_types();
    //数量
    let popup_title = chrome.i18n.getMessage("popup_title");
    $('#popup_title').text(popup_title+`(${config.list.length})`);
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
 * 一键下载
 */
function save_all(){
    cache_get('save_all_message',(val)=>{
        if(val.save_all_message){
            //已经确认过了
            batch_download();
        }else{
            //提示信息
            let save_all_message = chrome.i18n.getMessage("save_all_message");
            let yes = confirm(save_all_message);
            
            if(yes){
                cache_set('save_all_message',yes?1:0);
                batch_download();
            }
        }
    })
    
}

/**
 * 批量下载
 */
function batch_download(){
    for (let i = 0; i < config.choose_list.length; i++) {
        if(!config.choose_list[i]){
            return
        }
        chrome.downloads.download({
            url:config.choose_list[i].url,
            filename:(i+1)+'、'+config.choose_list[i].title,
            saveAs:false,
            conflictAction:'overwrite'
        },()=>{
            // config.choose_list[i].state = 2;
            config.choose_list[i].speed = 100;
        })
    }
}

/**
 * 加载类型列表
 */
function load_types(){
    const list_box = $('#select_type');
    let s = '<option value="all">all</option>';
    for (let i = 0; i < config.types.length; i++) {
        s += `<option value="${config.types[i]}">${config.types[i]}</option>`
    }
    
    list_box.html(s);
}

/**
 * 筛选类型
 */
function choose_types(){
    load_list()
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

function search_resures(){
    sendMessageToActive(null,'search')
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
        filename:(index+1)+'、'+config.list[index].title,
        saveAs:false,
        conflictAction:'overwrite'
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
    //UI
    let popup_title = chrome.i18n.getMessage("popup_title");
    $('#popup_title').text(popup_title);
    $('#select_type_text').text(chrome.i18n.getMessage("select_type"));
    $('.contr .save-all').text(chrome.i18n.getMessage("select_type_btn"));
    $('.contr .search-resures').text(chrome.i18n.getMessage("search_resures"));
    //筛选
    $('#select_type').on('click',choose_types);
    //批量下载
    $('.contr .save-all').on('click',save_all);

    $('.contr .search-resures').on('click',search_resures);
    //加载列表
    sendMessageToActive(null,'get_list');
}()