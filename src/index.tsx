import '@/asset/css/index.css'
import { render } from 'solid-js/web'
import Popup from './popup/Popup'
import Settings from './settings/Settings'
const root = document.getElementById('root')

if(APP_ENV=='popup'){
    render(Popup, root!)
}else if(APP_ENV=='settings'){
    render(Settings, root!)
}
