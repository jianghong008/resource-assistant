import { Accessor, For } from "solid-js"
import '@/asset/css/selector.css'
import { ComUtils } from "@/utils/Com"

interface Props {
    data: any[]
    value: Accessor<any>
    setValue: (value: any) => void
    all?: string
}
export default function (props: Props) {
    const getDefaultValue = () => {
        return props.value() || (props.all || '---')
    }
    return <div class="selector relative px-2 py-1 bg-slate-800 border border-slate-600">
        <span class="whitespace-nowrap">
            {ComUtils.getTranslateText(getDefaultValue()) || getDefaultValue()}
        </span>
        <div class="selector-list absolute z-[1000] top-6 left-0 border border-slate-600 bg-slate-800 flex flex-col max-h-40 overflow-y-auto">
            <For each={props.data}>
                {
                    item => <button class="whitespace-nowrap px-4 py-1 hover:bg-slate-500" onclick={() => props.setValue(item)}>
                        {ComUtils.getTranslateText(item) || item}
                    </button>
                }
            </For>
        </div>
    </div>
}