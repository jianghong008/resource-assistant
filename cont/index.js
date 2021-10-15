/**
 * media helper
 * v1
 * jh
 */
const sys_conf = 'sys_conf';
const config = {
    choose_el: 'media-helper-choose',
    el_selector: 'title',
    auto_download: 0,
    choose: 0,
    last_el_path: [],
    list: [],
    version: '1.0',
    active_el_border:'border: dashed 1px #e91e63',
    path:"\.(mp3|mp4|wav|ogg|m4a|aac|mpeg|m3u8)",
    file_type:'media'
};

/**
 * 加载配置
 */
cache_get(sys_conf,(res)=>{
    if(res['sys_conf']){
        for (let k in res['sys_conf']){
            if(typeof res['sys_conf'][k] === 'string'){
                config[k] = res['sys_conf'][k];
            }

        }
    }
});

/**
 * 设置缓存数据
 * @param {string} key 
 * @param {object} val 
 */
function cache_set(key, val) {
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
            // config.choose = m.data;
            break;
        case 'resource':
            //转发资源到列表
            set_list(m.data);
            break;
        case 'get_list':
            //发生列表到弹出
            sendMessage(config.list, 'set_list')
            break;
        default:
            console.log(m.data, m.cmd)
            break;
    }
});

//添加资源列表
function set_list(obj) {
    const data = { ...obj };
    let title = $(config.el_selector).text();
    if(!title){
        title = $('title').text();
    }
    //过滤特殊字符，并限制18个字符
    title = title.replace(/[\.\:\s\<\>\\\[\]\^\`\`\'\"\;\*\$\@\~]/ig,'').substr(0,18);
    //获取文件后缀
    let temp = data.url.match(/\.[\w]{1,6}\??$/);
    if(!temp){
        temp = data.url.match(/\.[\w]{1,6}\?/)
    }
    temp = temp && temp[0] ? temp[0] : '';
    
    if(temp===''){
        switch (data.data.type) {
            case "media":
                temp = '.mp4';
                break;
            case "stylesheet":
                temp = '.css';
                break;
            case "script":
                temp = '.js';
                break;
            case "image":
                temp = '.png';
                break;
            case "xmlhttprequest":
                temp = '.temp';
                break;
            case "other":
                temp = '.temp';
                break;
            case "websocket":
                temp = '.temp';
                break;
        }
    }

    let f_type = temp.replace('?', '');
    data['title'] = title + f_type;
    data['s_name'] = f_type.replace('.','');
    if (!data.url) {
        return
    }
    if (!data.title) {
        data.title = chrome.i18n.getMessage("file_type_none")
    }
    //媒体分类
    if(/(mp3|m4a|ogg|wav)/.test(f_type)){
        //音频
        data['media_type'] = 'audio'
    }else if(/(mp4|flv|avi|ts)/.test(f_type)){
        //视频
        data['media_type'] = 'video'
    }else if(/(png|jpg|gif|ico|jpeg|svg)/.test(f_type)){
        //图片
        data['media_type'] = 'image'
    }else{
        //其它
        data['media_type'] = 'other'
    }
    
    data.state = 0;
    data.speed = 0;
    //去重处理
    for (let i = 0; i < config.list.length; i++) {
        if (config.list[i].url === data.url) {
            config.list[i] = data;
            return;
        }
    }
    
    config.list.push(data);
}

//选择元素路径
window.onmousemove = (e) => {
    if (config.choose === 0) {
        return;
    }
    if (e.path.length > 4) {
        $('.media-helper-choose').removeClass(config.choose_el);
        $(e.path[0]).addClass(config.choose_el);
        
        config.last_el_path = e.path;
    }
}

//按下 Ins 键进入元素选择
window.document.onkeyup = (e) => {

    if (e.keyCode !== 45) {
        return
    }
    
    if (config.choose == 0) {
        config.choose = 1;
        return;
    }
    $('.media-helper-choose').removeClass(config.choose_el);
    let ar = config.last_el_path;
    if (ar.length <= 4) {
        return
    }
    let selector = '';
    for (let i = ar.length - 4; i >= 0; i--) {
        if(!ar[i]){
            break
        }
        let id = ar[i].id;
        let cn = ar[i].className.replace(config.choose_el, '');
        let name = ar[i].localName;

        let s = '';

        if (id) {
            //优先选择ID
            s = '#' + id;
        } else {
            //没有ID选择class
            if (cn) {
                s = name + '[class="' + cn + '"]';
            } else {
                s = name;
            }
        }

        selector += ' ' + s;

    }
    config.choose = 0;
    if (!selector) {
        return
    }
    selector = selector.replace(config.choose_el, '');
    config.el_selector = selector;

    const conf = {...config};
    delete conf['last_el_path'];
    delete conf['list'];
    sendMessage(conf,'conf');
};

/**
 * 向后台发送数据指令
 * @param {object} data 
 * @param {string} cmd 
 */
 function sendMessage(data = {}, cmd = 'msg') {
    try {
        chrome.runtime.sendMessage({
            data,
            cmd
        })
    } catch (error) {
        console.log(error)
    }
}

/**
 * 当窗口被激活时重新连接后台
 */
window.document.addEventListener('visibilitychange',()=>{
    if(window.document.hidden){
        sendMessage(null,'keep')
    }
})

//初始化
!function () {
    sendMessage(null,'init');
    console.log(chrome.i18n.getMessage("welcome")+'%c【'+chrome.i18n.getMessage("app_name")+'】！%cjianghong','color: #e91e63;font-weight: bold;','color:green;')
}();



