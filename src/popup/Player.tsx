import { ComUtils } from "@/utils/Com"
import { Accessor, createEffect, createSignal, Match, Show, Switch } from "solid-js"

interface Props {
    data: Accessor<ResourceInfo | undefined>
    onclose?: () => void
}
const icClose = ComUtils.getResourceUrl('/popup/ic-close.svg')
const copyIC = ComUtils.getResourceUrl('/popup/ic-copy.svg')
const downloadIce = ComUtils.getResourceUrl('/popup/ic-download.svg')
export default function (props: Props) {
    const [show, setShow] = createSignal(false)
    const isAudio = () => {
        return /.(mp3|wav|ogg|m4a|aac)/.test(props.data()?.url || '')
    }
    const getIcon = () => {
        const res = props.data()
        if (!res) {
            return ComUtils.getResourceUrl(`/files/ic-other.svg`)
        }
        if (res.type === 'image' || res.type === 'canvas') {
            return res.url
        }else if (res.type === 'media') {
            const isAudio = /.(mp3|wav|ogg|m4a|aac)/.test(res.url)
            return ComUtils.getResourceUrl(`/files/ic-${isAudio ? 'audio' : 'video'}.svg`)
        }else if (res.type === 'xmlhttprequest') {
            return ComUtils.getResourceUrl(`/files/ic-xmlhttprequest-${res.xhrMethod}.svg`)
        } else {
            return ComUtils.getResourceUrl(`/files/ic-${res.type}.svg`)
        }
    }
    const closePlayer = () => {
        setShow(false)
        props.onclose?.()
    }

    const copyUrl = () => {
        navigator.clipboard.writeText(props.data()?.url || '')
    }

    const download = () => {
        chrome.downloads.download({
            url: props.data()?.url || '',
            filename: props.data()?.name || '',
            saveAs: true
        });
    }

    const defaultView = <img class="w-full h-full object-contain" src={getIcon()} alt={getIcon()} />
    createEffect(() => {
        if (props.data()) {
            setShow(true)
        }else{
            setShow(false)
        }
    })
    return <div class="relative w-full h-24 mt-4" style={{ display: show() ? 'block' : 'none' }}>
        <div class="absolute -top-2 right-0 z-50 flex flex-col gap-5">
            <button onclick={closePlayer} title={ComUtils.getTranslateText("close")}>
                <img class="w-4 h-4" src={icClose} alt="close" />
            </button>
            <Show when={props.data()?.url}>
                <button onclick={copyUrl} title={ComUtils.getTranslateText("copy")}>
                    <img class="w-4 h-4" src={copyIC} alt="copyIC" />
                </button>
            </Show>

            <Show when={props.data()?.url}>
                <button onclick={download} title={ComUtils.getTranslateText("download")}>
                    <img class="w-4 h-4" src={downloadIce} alt="downloadIce" />
                </button>
            </Show>
        </div>
        <div class="w-2/3 h-full mx-auto">
            <Switch fallback={defaultView}>
                <Match when={props.data()?.type === 'image' || props.data()?.type === 'canvas'}>
                    <img class="w-full h-full object-contain" src={props.data()?.url} alt={props.data()?.name} />
                </Match>
                <Match when={props.data()?.type === 'media' && isAudio()}>
                    <audio class="w-full h-full" src={props.data()?.url} autoplay controls />
                </Match>
                <Match when={props.data()?.type === 'media' && !isAudio()}>
                    <video class="w-full h-full object-contain" src={props.data()?.url} autoplay muted controls />
                </Match>
            </Switch>
        </div>
    </div>
}