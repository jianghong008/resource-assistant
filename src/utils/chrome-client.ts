import { BrowserUtils } from "./browser"
import { ComUtils } from "./Com"

export class ChromeClient {

    constructor() {
        this.initEvents()
    }
    static init() {
        const worker = new ChromeClient()
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
                sendResponse({ message: 'unknown message type', state: false })
            }
            return true
        })

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
        const ar = await BrowserUtils.getResources()
        ComUtils.callChromeMethod('setResources', ar).catch((err) => console.log(err))
    }
}