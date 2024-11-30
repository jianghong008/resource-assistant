import '@/asset/css/index.css'
import '@/asset/css/popup-window.css'
import Player from './Player'
import { createEffect, createSignal, For, onMount, Show } from 'solid-js'
import { ComUtils } from '@/utils/Com'
import Selector from '@/components/Selector'

const logo = ComUtils.getResourceUrl('/logo.png')
export default function () {
    const [currentRes, setCurrentRes] = createSignal<ResourceInfo>()
    const [resources, setResources] = createSignal<ResourceInfo[]>([])
    const [layout, setLayout] = createSignal<ResourceLayout>('grid')
    const [resourceType, setResourceType] = createSignal<ResourceInfoType>('image')
    const pageSize = 20
    const [page, setPage] = createSignal(0)
    const [keywords, setKeywords] = createSignal('')
    const ResTypes = [
        "image",
        '3dmodle',
        'canvas', "stylesheet", "script", "font", "xmlhttprequest", "media", "other"
    ]
    const MatchTypes = ['network', 'document']
    const [matchType, setMatchType] = createSignal<MatchType>('document')
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
        } else if (res.type === 'media') {
            const isAudio = /.(mp3|wav|ogg|m4a|aac)/.test(res.url)
            return ComUtils.getResourceUrl(`/files/ic-${isAudio ? 'audio' : 'video'}.svg`)
        } else if (res.type === 'xmlhttprequest') {
            return ComUtils.getResourceUrl(`/files/ic-xmlhttprequest-${res.xhrMethod}.svg`)
        } else {
            return ComUtils.getResourceUrl(`/files/ic-${res.type}.svg`)
        }
    }

    const getResourcesWithType = () => {
        const ar = resources().filter(res => res.type === resourceType() && res.name.includes(keywords()))
        return ar
    }

    const getResourcesWithTypeForPage = () => {
        const ar = resources().filter(res => res.type === resourceType() && res.name.includes(keywords()))
        return ar.slice(0, (page() + 1) * pageSize)
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
    let box: any
    const onscroll = () => {
        const scrollTop = box.scrollTop
        const scrollHeight = box.scrollHeight
        if (scrollTop + box.clientHeight >= scrollHeight) {
            const size = Math.ceil(getResourcesWithType().length / pageSize)
            console.log(page(), size, getResourcesWithType().length)
            if (page() >= size - 1) {
                return
            }
            setPage(page() + 1)
        }
    }

    const setQueryKeywords = (key: string) => {
        setKeywords(key)
        setPage(0)
    }

    createEffect(() => {
        if (resourceType() || matchType()) {
            setPage(0)
        }
    })

    onMount(async () => {
        box?.addEventListener('scroll', onscroll)
        init()
        loadResource()
    })
    return <div ref={box} class='popup px-4 pb-4'>
        <div class=' sticky top-0 bg-[var(--bg-color)] py-4'>
            <h3 class=' mb-4 flex items-center gap-1'>
                <img class='w-6 h-6' src={logo} alt="logo" />
                <span class=' text-xl font-bold'>
                    {ComUtils.getTranslateText("app_name")}
                </span>
                <span class='text-xs'>
                    【{getResourcesWithType().length}】
                </span>
            </h3>
            <div class='flex flex-wrap gap-4'>
                <Selector value={matchType} setValue={setMatchAndLoad} data={MatchTypes} />
                <Selector value={resourceType} setValue={setResourceType} data={ResTypes} />
                <input class='w-20 px-2 py-1 border border-slate-600 bg-slate-800 placeholder:text-slate-500' placeholder={ComUtils.getTranslateText("keywords")} type="text" onchange={e => setQueryKeywords(e.currentTarget.value)} />
            </div>
            <div class='flex flex-wrap gap-4 mt-5'>
                <button onclick={() => setLayout('grid')}>
                    <img class='w-5 h-5' src={getLayoutIcon('grid')} alt="grid" />
                </button>
                <button onclick={() => setLayout('list')}>
                    <img class='w-5 h-5' src={getLayoutIcon('list')} alt="list" />
                </button>

            </div>
            <Player data={currentRes} onclose={() => setCurrentRes(undefined)} />
        </div>
        <Show when={getResourcesWithTypeForPage().length == 0}>
            <div class='text-2xl text-center w-full text-slate-400 mt-6'>{ComUtils.getTranslateText("no_resource")}</div>
        </Show>
        <Show when={layout() === 'grid'}>
            <div class={`grid grid-cols-4 gap-4`}>
                <For each={getResourcesWithTypeForPage()}>
                    {res => <button class={`p-2 hover:bg-slate-600`} title={res.name} onclick={() => setCurrentRes(res)}>
                        <img class={`w-full aspect-square mb-3 object-cover`} src={getIcon(res)} alt={res.type} />
                        <p class={`text-center whitespace-nowrap overflow-hidden text-ellipsis`}>
                            {res.name}
                        </p>
                    </button>}
                </For>
            </div>
        </Show>
        <Show when={layout() === 'list'}>
            <div class={`flex flex-col`}>
                <For each={getResourcesWithTypeForPage()}>
                    {res => <button class={`w-full flex items-center gap-3 p-2 hover:bg-slate-600`} title={res.name} onclick={() => setCurrentRes(res)}>
                        <img class={`w-6 h-6 object-cover`} src={getIcon(res)} alt={res.type} />
                        <span class='bg-[#2196F3] text-xs py-[0.1rem] px-1 rounded'>
                            {res.type}
                        </span>
                        <p class={`text-left whitespace-nowrap overflow-hidden text-ellipsis`}>
                            {res.name}
                        </p>
                    </button>}
                </For>
            </div>
        </Show>
    </div>
}