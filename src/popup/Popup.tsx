import '@/asset/css/index.css'
import '@/asset/css/popup-window.css'
import Player from './Player'
import { createSignal, For, onMount, Show } from 'solid-js'
import { ComUtils } from '@/utils/Com'
import Selector from '@/components/Selector'


export default function () {
    const [currentRes, setCurrentRes] = createSignal<ResourceInfo>()
    const [resources, setResources] = createSignal<ResourceInfo[]>([])
    const [layout, setLayout] = createSignal<ResourceLayout>('grid')
    const [resourceType, setResourceType] = createSignal<ResourceInfoType>('image')
    const ResTypes = [
        '3dmodle',
        'canvas',
        "object", "stylesheet", "script", "image", "font", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "other"
    ]
    const MatchTypes = ['network', 'document']
    const [matchType, setMatchType] = createSignal<MatchType>('network')
    const init = () => {
        //数据监听
        chrome.runtime.onMessage.addListener((m: ChromeMessage) => {
            switch (m.type) {
                case 'setResources':
                    //加载资源到列表
                    setResources(m.data || [])
                    break;
                default:
                    console.log(m.data)
                    break;
            }
        })
    }

    const getLayoutIcon = (lay: ResourceLayout) => {
        return ComUtils.getResourceUrl(`/popup/ic-${lay}${lay === layout() ? '-active' : ''}.svg`)
    }

    const getIcon = (res: ResourceInfo) => {
        if (res.type === 'image' || res.type === 'canvas') {
            return res.url
        } else {
            return ComUtils.getResourceUrl(`/files/ic-${res.type}.svg`)
        }
    }

    const getResourcesWithType = () => {
        return resources().filter(res => res.type === resourceType())
    }

    const loadResource = async () => {
        if (matchType() === 'network') {
            const res = await ComUtils.callChromeMethod<ResourceInfo[]>('getResources', {})
            setResources(res)
        } else {
            ComUtils.callChromeMethod('getResourcesWithClient', {})
        }
    }

    const setMatchAndLoad = (type: any) => {
        setMatchType(type)
        loadResource()
    }

    onMount(async () => {
        init()
        loadResource()
    })
    return <div class='popup px-4 pb-4'>
        <div class=' sticky top-0 bg-[var(--bg-color)] py-4'>
            <h3 class=' text-xl font-bold mb-4'>
                {ComUtils.getTranslateText("popup_title")}
            </h3>
            <div class='flex flex-wrap gap-4'>
                <button onclick={() => setLayout('grid')}>
                    <img class='w-5 h-5' src={getLayoutIcon('grid')} alt="grid" />
                </button>
                <button onclick={() => setLayout('list')}>
                    <img class='w-5 h-5' src={getLayoutIcon('list')} alt="list" />
                </button>
                <Selector value={matchType} setValue={setMatchAndLoad} data={MatchTypes} />
                <Selector value={resourceType} setValue={setResourceType} data={ResTypes} />
            </div>
            <Player data={currentRes} />
        </div>
        <Show when={getResourcesWithType().length == 0}>
            <div class='text-2xl text-center w-full text-slate-400 mt-6'>{ComUtils.getTranslateText("no_resource")}</div>
        </Show>
        <div class={`${layout() === 'grid' ? 'grid grid-cols-4 gap-4' : 'flex flex-col'}`}>
            <For each={getResourcesWithType()}>
                {res => <button class={`${layout() === 'grid' ? '' : 'flex items-center gap-3'} p-2 hover:bg-slate-600`} title={res.name} onclick={() => setCurrentRes(res)}>
                    <img class={`${layout() === 'grid' ? 'w-full aspect-square mb-3' : 'w-6 h-6'}`} src={getIcon(res)} alt={res.type} />
                    <p class={`${layout() === 'grid' ? 'text-center' : 'text-left'} whitespace-nowrap overflow-hidden text-ellipsis`}>
                        {res.name}
                    </p>
                </button>}
            </For>
        </div>
    </div>
}