import { ComUtils } from "./Com"
import { StrUtils } from "./str"

export namespace BrowserUtils {
    export async function getResources() {
        const res: ResourceInfo[] = []
        //img
        const imgs = document.getElementsByTagName('img')
        const imgsRes: ResourceInfo[] = Array.from(imgs).map((img) => {
            return {
                name: StrUtils.getNameFromUrl(img.src),
                url: img.src,
                type: 'image',
                size: 0
            }
        })
        res.push(...imgsRes)
        //svg
        const svg = document.getElementsByTagName('svg')
        const svgRes: ResourceInfo[] = Array.from(svg).map((item, index) => {
            return {
                name: 'svg-' + index,
                url: URL.createObjectURL(new Blob([item.outerHTML], { type: 'image/svg+xml' })),
                type: 'image',
                size: 0
            }
        })
        res.push(...svgRes)

        //video
        const video = document.getElementsByTagName('video')
        const videoRes: ResourceInfo[] = Array.from(video).map((item) => {
            return {
                name: (item.src ? StrUtils.getNameFromUrl(item.src) : ComUtils.getTranslateText('inactive_video')),
                url: item.src,
                type: 'media',
                size: 0
            }
        })
        res.push(...videoRes)

        //canvas
        const canvas = document.getElementsByTagName('canvas')
        const canvasRes: ResourceInfo[] = Array.from(canvas).map((item, index) => {
            return {
                name: 'canvas-' + index,
                url: item.toDataURL('image/png'),
                type: 'canvas',
                size: 0
            }
        })
        res.push(...canvasRes)

        //audio
        const audio = document.getElementsByTagName('audio')
        const audioRes: ResourceInfo[] = Array.from(audio).map((item) => {
            return {
                name: StrUtils.getNameFromUrl(item.src),
                url: item.src,
                type: 'canvas',
                size: 0
            }
        })
        res.push(...audioRes)

        return res
    }
}