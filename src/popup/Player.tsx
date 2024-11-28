import { ComUtils } from "@/utils/Com"
import { Accessor, createEffect, createSignal, Match, Switch } from "solid-js"

interface Props {
    data: Accessor<ResourceInfo | undefined>
}
const icClose = ComUtils.getResourceUrl('/popup/ic-close.svg')
export default function (props: Props) {
    const [show, setShow] = createSignal(false)
    const isAudio = ()=>{
        return /.(mp3|wav|ogg|m4a|aac)/.test(props.data()?.url||'')
    }
    createEffect(() => {
        if (props.data()) {
            setShow(true)
        }
    })
    return <div class="relative w-full h-20 mt-4" style={{ display: show() ? 'block' : 'none' }}>
        <button class="absolute top-2 right-2" onclick={() => setShow(false)}>
            <img class="w-4 h-4" src={icClose} alt="close" />
        </button>
        <Switch>
            <Match when={props.data()?.type === 'image'}>
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
}