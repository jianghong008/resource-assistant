import { Accessor, For } from "solid-js"
import '@/asset/css/selector.css'

interface Props {
    data: any[]
    value: Accessor<any>
    setValue: (value: any) => void
    all?: string
}
export default function (props: Props) {

    return <div class="selector relative px-2 py-1 bg-slate-800 border border-slate-600">
        <span>
            {props.value() || (props.all || '---')}
        </span>
        <div class="selector-list absolute top-6 left-0 bg-slate-800 flex flex-col max-h-40 overflow-y-auto">
            <For each={props.data}>
                {
                    item => <button class="px-4 py-1 hover:bg-slate-500" onclick={() => props.setValue(item)}>
                        {item}
                    </button>
                }
            </For>
        </div>
    </div>
}