interface ChromeMessage {
    type: string
    data: any
}

interface ChromeResponse {
    state: boolean
    message?: string
    data: any
}