import { ComUtils } from "@/utils/Com"
import { Accessor, createEffect, createSignal, Match, Switch } from "solid-js"
import ThreeDviewer from "./ThreeDviewer"

interface Props {
    data: Accessor<ResourceInfo | undefined>
    onclose?: () => void
}
const icClose = ComUtils.getResourceUrl('/popup/ic-close.svg')
const copyClose = ComUtils.getResourceUrl('/popup/ic-copy.svg')
const downloadClose = ComUtils.getResourceUrl('/popup/ic-download.svg')
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
        } if (res.type === 'media') {
            const isAudio = /.(mp3|wav|ogg|m4a|aac)/.test(res.url)
            return ComUtils.getResourceUrl(`/files/ic-${isAudio ? 'audio' : 'video'}.svg`)
        } else {
            return ComUtils.getResourceUrl(`/files/ic-${res.type}.svg`)
        }
    }
    const closePlayer = () => {
        setShow(false)
        props.onclose?.()
    }

    const copyUrl = () => {

    }

    const download = () => {
        
    }

    const defaultView = <img class="w-full h-full object-contain" src={getIcon()} alt={getIcon()} />
    createEffect(() => {
        if (props.data()) {
            setShow(true)
        }
    })
    return <div class="relative w-2/3 mx-auto h-20 mt-4" style={{ display: show() ? 'block' : 'none' }}>
        <div class="absolute -top-2 right-0 z-50">
            <button onclick={closePlayer}>
                <img class="w-4 h-4" src={icClose} alt="close" />
            </button>
            <button onclick={copyUrl}>
                <img class="w-4 h-4" src={icClose} alt="close" />
            </button>
            <button onclick={download}>
                <img class="w-4 h-4" src={icClose} alt="close" />
            </button>
        </div>
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
            <Match when={props.data()?.type === '3dmodle'}>
                <ThreeDviewer url={() => props.data()?.url} />
            </Match>
        </Switch>
    </div>
}