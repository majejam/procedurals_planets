import './css/style.styl'
import CameraControls from 'camera-controls';
import * as THREE from 'three'

CameraControls.install( { THREE: THREE } );

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 8000)
camera.position.z = 30
scene.add(camera)


/**
 * Universe
 */
let galaxyArray = new Array()
const universe = new THREE.Object3D()
const ul = 5000
const nb_of_clusters = 20
// Stars 
for(let i = 0; i < nb_of_clusters; i++){
    let cluster_color = parseInt('0x' + (Math.random().toString(16) + "000000").substring(2,8))
    const points = {
        cx : -ul/2 + Math.random() * ul,
        cy : -ul/2 + Math.random() * ul,
        cz : -ul/2 + Math.random() * ul
    }
    const galaxyPoint = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20),
            new THREE.MeshStandardMaterial({ color: cluster_color, metalness: 0.3, roughness: 0.8 })
    )
    galaxyPoint.position.set(points.cx, points.cy, points.cz)
    //universe.add(galaxyPoint)
    galaxyArray.push(points)
    let gvx,gvy,gvz
    const sr = 0.2 + Math.random() * 0.4
    const cluster_size = 100
    //linear cluster generation
    for(let j = 0; j < 200; j++)
    {
        if(true){
            gvx = Math.random() * 1.2
            gvy = Math.random() * 1.2
            gvz = Math.random() * 1
        }
        const tx = galaxyArray[i].cx + ((-(cluster_size * gvx)/2) + Math.random() * (cluster_size * gvx))
        const ty = galaxyArray[i].cy + ((-(cluster_size * gvy)/2) + Math.random() * (cluster_size * gvy))/2
        const tz = galaxyArray[i].cz + ((-(cluster_size * gvz)/2) + Math.random() * (cluster_size * gvz))
        //const starLight = new THREE.PointLight(0xFF69B4)
        const star = new THREE.Mesh(
            new THREE.SphereBufferGeometry(sr),
            new THREE.MeshStandardMaterial({ color: cluster_color, metalness: 0.3, roughness: 0.8 })
    )

    // Set position
    //starLight.position.set(tx, ty, tz)
    star.position.set(tx, ty, tz)

    // Shadows
    //star.castShadow = true
    //star.receiveShadow = true

    // Add Elements
    //universe.add(starLight)
    universe.add(star)
    }
}

scene.add(universe)
/** 
*smoke effect
**/

let geometryS = new THREE.CubeGeometry( 200, 200, 200 );
let materialS = new THREE.MeshLambertMaterial( { color: 0xaa6666, wireframe: false } );
let mesh = new THREE.Mesh( geometryS, materialS );
//scene.add( mesh );
let cubeSineDriver = 0;


THREE.ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS


let smokeTexture = THREE.ImageUtils.loadTexture('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
let smokeMaterial = new THREE.MeshLambertMaterial({color: 0x00dddd, map: smokeTexture, transparent: true});
let smokeGeo = new THREE.PlaneGeometry(300,300);
let smokeParticles = [];


for (let p = 0; p < 150; p++) {
    var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
    particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
    particle.rotation.z = Math.random() * 360;
    scene.add(particle);
    smokeParticles.push(particle);
}
 
 
function evolveSmoke() {
    var sp = smokeParticles.length;
    while(sp--) {
        smokeParticles[sp].rotation.z += (0.002);
    }
}
/**
* Lights
**/


const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xFFFFFF, 1)
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
*Sky box 
**/
  
/*
let uniforms = {  
  texture: { type: 't', value: textureLoader.load(skyboxTexture) }
};

let material = new THREE.ShaderMaterial( {  
    uniforms: uniforms,
    vertexShader:
    `
        varying vec2 vUV;

        void main() {  
          vUV = uv;
          vec4 pos = vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * pos;
        }
    `,
    fragmentShader:
    `
        uniform sampler2D texture;  
        varying vec2 vUV;

        void main() {  
          vec4 sample = texture2D(texture, vUV);
          gl_FragColor = vec4(sample.xyz, sample.w);
        }
    `
});
*/

/*

Do clusters of stars (select a point, build around it), complexité log(n). 

*/
import skyboxTexture from './img/texture/skybox/skybox.png' 
const textureLoader = new THREE.TextureLoader()
let geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
for (var i in geometry.vertices) {
    var vertex = geometry.vertices[i];
    vertex.normalize().multiplyScalar(4000);
}
let materialArray = [];
for (var i = 0; i < 6; i++) {
  var faceMaterial = new THREE.MeshPhongMaterial();
  faceMaterial.map = textureLoader.load(skyboxTexture); // see github for implementation
  materialArray.push(faceMaterial);
}
 
var sphereMaterial = new THREE.MeshFaceMaterial(materialArray);
let material = new THREE.MeshBasicMaterial({map: textureLoader.load(skyboxTexture), side: THREE.BackSide})
const skyBox = new THREE.Mesh(geometry, material) 
skyBox.scale.set(-1, 1, 1)
skyBox.eulerOrder = 'XZY'  
skyBox.renderDepth = 1000.0  
scene.add(skyBox);  

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

/**
* Controller
**/
const clock = new THREE.Clock()
const cameraControls = new CameraControls( camera, renderer.domElement )
cameraControls.maxDistance = 0
cameraControls.maxDistance = 2000
cameraControls.truckSpeed = 0


let nb_gala = 0
window.addEventListener('contextmenu', () =>
{
    if(nb_gala == nb_of_clusters - 1){
        nb_gala = 0
    } 
    nb_gala++
    //cameraControls.setPosition( galaxyArray[rand].cx,galaxyArray[rand].cy,galaxyArray[rand].cz, true)
    cameraControls.setTarget(galaxyArray[nb_gala].cx,galaxyArray[nb_gala].cy,galaxyArray[nb_gala].cz, true)
    cameraControls.dollyTo( 50, true )
})
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
    evolveSmoke()
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update( delta );

    //console.log(camera.position)

    // Renderer
    renderer.render(scene, camera)
}
loop()
