import { ComUtils } from "./Com";
import { StrUtils } from "./str";

export class ChromeWorker {
    private data = {
        resources: Array<ResourceInfo>(),
    }
    private config = {
        active_tab: {},
        auto_download: 0,
        path: "\.(mp3|mp4|wav|ogg|m4a|aac|mpeg|m3u8)",
        el_selector: '',
        fileType: undefined as ResourceInfoType | undefined,
        choose: 0,
        version: '1.0'
    };
    constructor() {
        this.initEvents()
    }
    static init() {
        const worker = new ChromeWorker()
        worker.insertScripts()
        return worker
    }
    private insertScripts() {

    }
    private initEvents() {
        chrome.runtime.onMessage.addListener((message: ChromeMessage, _sender, sendResponse) => {
            const func: any = Reflect.get(this, `_${message.type}`)
            if (func && typeof func === 'function') {
                func.call(this, message).then(sendResponse)
            } else {
                sendResponse('unknown message type')
            }

            return true
        })

        chrome.webRequest.onResponseStarted.addListener(
            (details) => {
                const reg = new RegExp(this.config.path, 'ig');
                if (details.type === this.config.fileType || !this.config.fileType) {
                    let temp = details.url.match(reg);

                    if (!temp && !this.config.path) {
                        return { cancel: false };
                    }
                    const size = details.responseHeaders?.find((item) => item.name === 'Content-Length');
                    const has = this.data.resources.find((item) => item.url === details.url);
                    if (has || details.type.includes('frame')) {
                        return { cancel: false };
                    }
                    let type:ResourceInfoType = details.type;
                    if(/\.(glb|gltf|obj|stl|ply|dae|fbx|glb|gltf|obj|stl|ply|dae)/.test(details.url)){
                        type = '3dmodle'
                    }
                    this.data.resources.push({
                        type,
                        url: details.url,
                        name: StrUtils.getNameFromUrl(details.url),
                        size: Number(size?.value || 0)
                    })

                }
                return { cancel: false };
            },
            { urls: ['*://*/*'] }
        );
    }

    async _showExtPopup() {
        try {
            await chrome.action.openPopup()
            return ChromeWorker.getChromeResponse(true, undefined)
        } catch (error) {
            return ChromeWorker.getChromeResponse(false, undefined, error)
        }
    }

    async _createWindow(url: string, width: number, height: number) {
        const win = await chrome.windows.create({
            url,
            type: 'popup',
            height,
            width
        })
        return win
    }

    async _openTab(msg: ChromeMessage) {
        try {
            if (!msg.data.url) {
                return ChromeWorker.getChromeResponse(false, undefined, 'open tab error,url not null')
            }
            if (msg.data.new === false) {

                chrome.tabs.update({
                    url: msg.data.url
                })
                return ChromeWorker.getChromeResponse(true, undefined)
            }

            await chrome.tabs.create({
                url: msg.data.url
            })
            return ChromeWorker.getChromeResponse(true, undefined)
        } catch (error) {
            console.error(error)
            return ChromeWorker.getChromeResponse(false, undefined, 'open tab error')
        }
    }

    static getChromeResponse(state: boolean, data: any, message?: any) {
        const res: ChromeResponse = {
            state,
            data,
            message
        }

        return res
    }

    async _getResources() {
        console.log(this.data.resources)
        return ChromeWorker.getChromeResponse(true, this.data.resources)
    }

    async _getResourcesWithClient() {
        ComUtils.sendMessageForTabs({ type: 'getResources', data: undefined })
        return ChromeWorker.getChromeResponse(true, this.data.resources)
    }

    async _setResources(res: ChromeMessage) {
        chrome.runtime.sendMessage({ type: 'setResources', data: res.data })
    }
}