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
    $('.msg').text('保存成功');

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