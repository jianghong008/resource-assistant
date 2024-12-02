import JSZip from "jszip";

export namespace ComUtils {
    export function getResourceUrl(url: string) {
        return chrome.runtime.getURL(url);
    }

    /**
   * 给当前激活窗口发送信息
   * @param {ChromeMessage} message
   */
    export function sendMessageForTabs(message: ChromeMessage) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.id) {
                    chrome.tabs.sendMessage(tab.id, message).catch(console.log)
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

    export async function downloadAll(ar: ResourceInfo[], onProgress?: (progress: number) => void) {
        if (!ar.length) {
            onProgress?.(1)
            return
        }
        const zip = new JSZip();
        for (let i = 0; i < ar.length; i++) {
            try {
                const res = ar[i];
                const data = await fetch(res.url).then(res => res.blob())
                zip.file(res.name, data)
                onProgress?.(i / ar.length)
            } catch (error) {
                console.log(error)
            }
        }
        const blob = await zip.generateAsync({ type: "blob" })
        const file = new File([blob], "resources.zip", { type: "application/zip" })
        const url = URL.createObjectURL(file)
        onProgress?.(1)
        chrome.downloads.download({
            url,
            filename: "resources.zip",
            saveAs: true
        });
    }
}