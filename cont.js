/**
 * media helper
 * v1
 * jh
 */

const config = {
    choose_el: 'media-helper-choose',
    el_selector: 'title',
    auto_download: 0,
    resource: 'media',
    choose: 0,
    last_el_path: [],
    list: [],
    version: '1.0'
}

/**
 * 设置缓存数据
 * @param {string} key 
 * @param {object} val 
 */
function cache_set(key, val) {
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
            const data = { ...m.data };
            let title = $(config.el_selector).text();
            if(!title){
                title = $('title').text();
            }
            let temp = data.url.match(/\.[\w]{1,6}\?/);
            temp = temp && temp[0] ? temp[0] : '.mp3';
            let f_type = temp.replace('?', '');
            data['title'] = title + f_type;
            set_list(data)
            break;
        case 'get_list':
            //发生列表到弹出
            sendMessage(config.list, 'set_list')
            break;
        default:
            console.log(m.data, m.cmd)
            break;
    }
})

//添加资源列表
function set_list(obj) {
    const o = { ...obj }
    if (!o.url) {
        return
    }
    if (!o.title) {
        o.title = '未知资源'
    }
    //去重处理
    for (let i = 0; i < config.list.length; i++) {
        if (config.list[i].url === o.url) {
            return;
        }
    }
    o.state = 0;
    o.speed = 0;
    config.list.push(o);
}

//获取默认标题
cache_get('el_selector', (res) => {
    if (res['el_selector']) {
        config.el_selector = res.el_selector;
    }
})

//选择元素路径
window.onmousemove = (e) => {
    if (config.choose == 0) {
        return;
    }
    if (e.path.length > 4) {
        $('.media-helper-choose').removeClass(config.choose_el);
        $(e.path[0]).addClass(config.choose_el);
        config.last_el_path = e.path;
    }
}

//按下空格进入元素选择
window.onkeypress = (e) => {
    if (e.keyCode != 113) {
        return
    }
    if (config.choose == 0) {
        config.choose = 1;
        return;
    }
    $('.media-helper-choose').removeClass(config.choose_el);
    let ar = config.last_el_path;
    if (ar.length <= 4) {
        console.log('请重新选择媒体标题')
        return
    }
    let selector = '';
    for (let i = ar.length - 4; i >= 0; i--) {
        ;
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
    cache_set('el_selector', selector)
}

//初始化
!function () {
    sendMessage('加载完成')
}()

/**
 * 向后台发送数据指令
 * @param {object} data 
 * @param {string} cmd 
 */
function sendMessage(data = {}, cmd = 'msg') {
    chrome.runtime.sendMessage({
        data,
        cmd
    })
}

