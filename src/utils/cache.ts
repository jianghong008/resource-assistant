/**
 * cache utils for chrome and web
 */
export class CacheUtils {

    static async uniSet(key: string, value: any) {
        let cacheValue = ''
        if (typeof value === 'object') {
            cacheValue = JSON.stringify(value)
        } else {
            cacheValue = String(value)
        }
        
        if (typeof window === 'undefined') {
            return await chrome.storage.local.set({ [key]: cacheValue })
        } else {
            return localStorage.setItem(key, cacheValue)
        }
    }

    static async uniGet(key: string) {
        let value: any = ''
        if (typeof window === 'undefined') {
            const result = await chrome.storage.local.get()
            value = result[key]
        } else {
            value = localStorage.getItem(key)
        }

        try {
            return JSON.parse(value)
        } catch (_error) {
            return value
        }
    }

    static async uniRemove(key: string) {
        if (typeof window === 'undefined') {
            return await chrome.storage.local.remove(key)
        } else {
            return localStorage.removeItem(key)
        }
    }

    static async clear() {
        if (typeof window === 'undefined') {
            return await chrome.storage.local.clear()
        } else {
            return localStorage.clear()
        }
    }

    static async remove(key: string) {
        await CacheUtils.uniRemove(key)
    }

    static async set(key: string, value: any, expiresTime: number = 0) {
        const obj = {
            value,
            expiresTime
        }
        if (expiresTime === 0) {
            obj.expiresTime = Date.now() + 1000 * 60 * 60 * 24 * 30
        }
        
        await CacheUtils.uniSet(key, obj)
    }

    static async get(key: string) {
        const obj = await CacheUtils.uniGet(key)

        if (!obj) {
            return null
        }

        if (obj.expiresTime < Date.now()) {
            return null
        }

        return obj.value
    }
}