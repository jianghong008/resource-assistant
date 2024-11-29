import { loadModel } from '@/utils/three';
import { Accessor, createEffect, onCleanup, onMount } from 'solid-js';
import * as THREE from 'three';
interface Props {
    url: Accessor<string | undefined>
}
export default function (props: Props) {
    let elBox: any
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    const camera = new THREE.PerspectiveCamera(75, 320 / 80, 0.1, 1000);
    const state = {
        stop: false
    }
    const init = () => {
        elBox.appendChild(renderer.domElement);
        animate()
    }

    const animate = () => {
        if (state.stop) {
            return
        }
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    const reSize = async () => {
        const url = props.url()
        if (!url) {
            return
        }
        const rect = elBox.getBoundingClientRect()
        renderer.setSize(rect.width, rect.height);
        const obj = await loadModel(url)
        if (!obj) {
            return
        }
        scene.add(obj)
        const box = new THREE.Box3().setFromObject(obj);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxSize = Math.max(size.x, size.y, size.z);
        const fov = camera.fov;
        
        const target = new THREE.Vector3();
        center.add(new THREE.Vector3(0, 0, maxSize));
        
        const direction = new THREE.Vector3().subVectors(target, camera.position).normalize();
        
        const distance = (maxSize / 2) / Math.tan(fov * Math.PI / 360);
        
        camera.position.copy(target.clone().add(new THREE.Vector3().copy(direction).multiplyScalar(distance)));
        camera.lookAt(target);
        
        camera.updateProjectionMatrix();
    }

    createEffect(() => {
        if (props.url()) {
            setTimeout(reSize, 500)
        }
    })

    onMount(() => {
        state.stop = false
        init()
    })

    onCleanup(() => {
        state.stop = true
    })
    return <div class="w-full h-full" ref={elBox} />
}