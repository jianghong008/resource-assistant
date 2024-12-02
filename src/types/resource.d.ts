type ResourceInfoType = chrome.webRequest.ResourceType | '3dmodle' | 'canvas';
type ResourceLayout = 'grid' | 'list'
interface ResourceInfo {
    name: string;
    url: string;
    type: ResourceInfoType;
    size: number;
    xhrMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

type MatchType = 'document' | 'network'