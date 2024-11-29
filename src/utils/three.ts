import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export async function loadModel(url: string) {
    const type = url.split('.').pop()
    if(type === 'gltf' || type === 'glb') {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(url);
        return gltf.scene
    }
}