export namespace StrUtils {
    export function getNameFromUrl(url: string) {
        return url.split('/').pop()||'---';
    }
}