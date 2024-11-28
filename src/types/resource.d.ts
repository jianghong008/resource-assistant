type ResourceInfoType = chrome.webRequest.ResourceType | '3dmodle' | 'canvas';
type ResourceLayout = 'grid' | 'list'
interface ResourceInfo {
    name: string;
    url: string;
    type: ResourceInfoType;
    size: number;
}

type MatchType = 'document' | 'network'