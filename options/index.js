const sys_conf = 'sys_conf';
const conf = {
    path:"\.(mp3|mp4|wav|ogg|m4a|aac|mpeg|m3u8)",
    el_selector:'',
    file_type:''
};
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

/**
 * 保存配置
 */
$('#save-btn').on('click',()=>{
    conf.file_type = $('#file_type').val();
    conf.el_selector = $('#el_selector').val();
    conf.path = $('#path').val();
    sendMessage(conf,'conf')
    $('.msg').text(chrome.i18n.getMessage("option_save_msg"));

});

/**
 * 加载配置
 */
cache_get(sys_conf,(res)=>{
    if(res['sys_conf']){
        for (let k in res['sys_conf']){
            let el = $('#'+k);
            if(el.length>0&&res['sys_conf'][k]){
                conf[k] = res['sys_conf'][k];
                el.val(res['sys_conf'][k]);
            }

        }
    }
});

/**
 * 初始化UI
 */
!function() {
    $('.media-options-title').text(chrome.i18n.getMessage("options_title"));

    for (let i = 1; i <= 3; i++) {
        $('.option_name_'+i).text(chrome.i18n.getMessage("option_name_"+i));
    }

    for (let i = 1; i <= 9; i++) {
        $('#file_type option:nth-child('+i+')').text(chrome.i18n.getMessage("file_type_"+i));
    }

    $('#save-btn button').text(chrome.i18n.getMessage("option_save"));

    $('#el_selector').attr('placeholder',chrome.i18n.getMessage("el_selector"));

    $('#path').attr('placeholder',chrome.i18n.getMessage("option_path"));

}()