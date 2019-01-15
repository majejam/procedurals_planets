import './css/style.styl'
import grassTextureSource from './img/texture/house/grass.jpg' 

import * as THREE from 'three'

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const grassTexture = textureLoader.load(grassTextureSource)
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping
grassTexture.repeat.x = 4
grassTexture.repeat.y = 4

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (_event) =>
{
    cursor.x = _event.clientX / sizes.width - 0.5
    cursor.y = _event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * House
 */
const house = new THREE.Object3D()
//scene.add(house)

// Wall
const wall = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1, 1.5),
    new THREE.MeshStandardMaterial({ color: 0xffcc99, metalness: 0.3, roughness: 0.8 })
)
wall.castShadow = true
wall.receiveShadow = true
house.add(wall)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(4, 4),
    new THREE.MeshStandardMaterial({ color: 0x66bb66, metalness: 0.3, roughness: 0.8, map: grassTexture })
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = - 0.5
floor.receiveShadow = true
house.add(floor)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.25, 0.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x885522, metalness: 0.3, roughness: 0.8 })
)
roof.position.y = 0.5 + 0.25
roof.rotation.y = Math.PI * 0.25
roof.castShadow = true
house.add(roof)

// Bushes
for(let i = 0; i < 300; i++)
{
    const radius = Math.random() * 0.2

    const bush = new THREE.Mesh(
        new THREE.SphereGeometry(radius),
        new THREE.MeshStandardMaterial({ color: 0x228833, metalness: 0.3, roughness: 0.8 })
    )
    bush.position.set((Math.random() - 0.5) * 4,- 0.5 + radius * 0.5,(Math.random() - 0.5) * 4)
    //bush.position.x = (Math.random() - 0.5) * 4
    //bush.position.z = (Math.random() - 0.5) * 4
    //bush.position.y = - 0.5 + radius * 0.5
    bush.castShadow = true
	bush.receiveShadow = true
    house.add(bush)
}
scene.add(house)
/**
* Lights
**/
const doorLight = new THREE.PointLight(0xFF69B4)
doorLight.position.x = - 1.02
doorLight.castShadow = true
house.add(doorLight)

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.6)
sunLight.position.x = 1
sunLight.position.y = 1
sunLight.position.z = 1
sunLight.castShadow = true
sunLight.shadow.camera.top = 1.20
sunLight.shadow.camera.right = 1.20
sunLight.shadow.camera.bottom = -1.20
sunLight.shadow.camera.left = -1.20
scene.add(sunLight)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

/**
 * Resize
 */
window.addEventListener('resize', () =>
{
    // Save width and height
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Loop
 */
const loop = () =>
{
    window.requestAnimationFrame(loop)

    // Update house
    house.rotation.y += 0.003

    // Update camera
    camera.position.x = cursor.x * 3
    camera.position.y = - cursor.y * 3
    camera.lookAt(new THREE.Vector3())

    // Renderer
    renderer.render(scene, camera)
}
loop()

// // Hot reload
// if(module.hot)
// {
//     module.hot.accept()

//     module.hot.dispose(() =>
//     {
//         document.body.removeChild($image)
//     })
// }