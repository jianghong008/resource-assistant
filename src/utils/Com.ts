export namespace ComUtils {
    export function getResourceUrl(url: string) {
        return chrome.runtime.getURL(url);
    }

    /**
   * 给当前激活窗口发送信息
   * @param {object} data
   * @param cmd
   */
    export function sendMessageForTabs(message: ChromeMessage) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.id) {
                    chrome.tabs.sendMessage(tab.id, message)
                }
            })
        })
    }

    export function callChromeMethod<T>(method: string, arg: any): Promise<T> {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: method, data: arg }, (result: ChromeResponse) => {
                if (!result) {
                    reject('chrome: unknown error,method:' + method)
                }
                if (result?.state) {
                    resolve(result?.data)
                } else {
                    reject(result?.message)
                }

            })
        })
    }

    export function getTranslateText(txt: string) {
        return chrome.i18n.getMessage(txt);
    }

}