import './css/style.styl'
import CameraControls from 'camera-controls'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import skybox_texture from './img/texture/skybox/skybox.png'
let seedrandom = require('seedrandom')

const textureLoader = new THREE.TextureLoader()
CameraControls.install({
	THREE: THREE
}) 


let camera_centered = false
let array_texture = new Array()
let globe_image = {}
let x_pos = 0
let nb_planets = 6
let d = 6000
let spacing = d / nb_planets
let lock_camera = false
let planet_array = new Array()

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

window.addEventListener('mousemove', (_event) => {
	cursor.x = _event.clientX / sizes.width - 0.5
	cursor.y = _event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100000)
camera.position.z = 30
scene.add(camera)

const galaxyPoint = new THREE.Mesh(
	new THREE.SphereBufferGeometry(20, 50, 50),
	new THREE.MeshStandardMaterial({
		color: 0xffffff,
		metalness: 0.3,
		roughness: 0.8,
		opacity: 0.5
	})
)
scene.add(galaxyPoint)
const sunLight = new THREE.PointLight(0xffffff, 1, 0) 
sunLight.position.set(0, 0, 0) 
sunLight.castShadow = true
sunLight.shadow.camera.top = 1.20
sunLight.shadow.camera.right = 1.20
sunLight.shadow.camera.bottom = -1.20
sunLight.shadow.camera.left = -1.20
scene.add(sunLight) 

const light1 = new THREE.PointLight(0xffffff, 10, 200) 
light1.position.set(100, 0, 0) 
light1.castShadow = false
scene.add(light1) 

const light2 = new THREE.PointLight(0xffffff, 10, 200) 
light2.position.set(-100, 0, 0) 
light2.castShadow = false
scene.add(light2) 

const light3 = new THREE.PointLight(0xffffff, 10, 200) 
light3.position.set(0, 0, 100) 
light3.castShadow = false
scene.add(light3) 

const light4 = new THREE.PointLight(0xffffff, 10, 200) 
light4.position.set(0, 0, -100) 
light4.castShadow = false
scene.add(light4) 

const light5 = new THREE.PointLight(0xffffff, 10, 200) 
light5.position.set(0, 100, 0) 
light5.castShadow = false
scene.add(light5) 

const light6 = new THREE.PointLight(0xffffff, 10, 200) 
light6.position.set(0, -100, 0) 
light6.castShadow = false
scene.add(light6) 

let geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32) 
for (let i in geometry.vertices) {
	let vertex = geometry.vertices[i] 
	vertex.normalize().multiplyScalar(50000) 
}
let material_array = [] 
for (let i = 0;  i < 6;  i++) {
	let face_material = new THREE.MeshPhongMaterial() 
	face_material.map = textureLoader.load(skybox_texture) 
	material_array.push(face_material) 
}

let material = new THREE.MeshBasicMaterial({
	map: textureLoader.load(skybox_texture),
	side: THREE.BackSide
})
const skybox_mesh = new THREE.Mesh(geometry, material)
skybox_mesh.scale.set(-1, 1, 1)
skybox_mesh.rotation.order = 'XZY'
skybox_mesh.renderDepth = 1000.0
scene.add(skybox_mesh) 

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
const cameraControls = new CameraControls(camera, renderer.domElement)
cameraControls.maxDistance = 0
cameraControls.maxDistance = 2000
cameraControls.truckSpeed = 0



/**
 * Resize
 */
window.addEventListener('resize', () => {
	// Save width and height
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
}) 
let Terrain = function (options) {

	let self = this 


	this.size = 9 

	this.noise = 0.1 

	this.deviation = 5 

	this.roughness = 13 


	for (let i in options) this[i] = options[i] 


	if (typeof this.map === 'undefined') {

		this.map = this.createMap() 

	}


	this.generate() 


	this.map.EDGE_TOP = 0x0 

	this.map.EDGE_RIGHT = 0x1 

	this.map.EDGE_BOTTOM = 0x2 

	this.map.EDGE_LEFT = 0x3 


	this.map.FLIP_NONE = 0x0 

	this.map.FLIP_VERT = 0x1 

	this.map.FLIP_HORZ = 0x2 


	this.map.size = this.size 

	this.map.eachNode = this.eachNode 

	this.map.getEdge = function (edge) {

		return self.getEdge(edge) 

	}


	return this.map 

}


Terrain.prototype = {


	getEdge: function (edge, flip) {

		let node, x, y,

			chunk = this.createMap() 


		for (x = 0; x < this.size; ++x) {

			for (y = 0; y < this.size; ++y) {

				node = this.map[x] && this.map[x][y] 


				if (edge === this.map.EDGE_TOP && y === 0) {

					chunk[x][y] = this.map[x][y] 

				} else if (edge === this.map.EDGE_BOTTOM && y === this.size - 1) {

					chunk[x][y] = this.map[x][y] 

				} else if (edge === this.map.EDGE_LEFT && x === 0) {

					chunk[x][y] = this.map[x][y] 

				} else if (edge === this.map.EDGE_RIGHT && x === this.size - 1) {

					chunk[x][y] = this.map[x][y] 

				}

			}

		}


		if (flip === this.FLIP_VERT) {

			for (x = 0; x < this.size; ++x) {

				chunk[x].reverse() 

			}

			chunk.reverse() 

		}


		if (flip === this.FLIP_HORZ) {

			chunk.reverse() 

		}


		return chunk 

	},


	createMap: function () {

		let map = [] 

		let w = this.size 

		while (w--) {

			let h = this.size 

			if (typeof map[w] == 'undefined')

				map[w] = [] 

			while (h--) {

				map[w][h] = null 

			}

		}

		return map 

	},


	// Iterates through each node and 

	// executes the given function (fn) 

	// with three arguments:

	//  - value of the node (from 0 to 1)

	//  - x index

	//  - y index

	eachNode: function (fn) {

		for (let x = 0; x < this.size; ++x) {

			for (let y = 0; y < this.size; ++y) {

				fn(this[x][y], x, y) 

			}

		}

	},


	// Generates the terrain

	generate: function () {

		this.set(0, 0, Math.random() * 1) 

		this.set(this.size - 1, 0, Math.random() * 1) 

		this.set(this.size - 1, this.size - 1, Math.random() * 1) 

		this.set(0, this.size - 1, Math.random() * 1) 


		this.set(Math.floor(this.size / 2), Math.floor(this.size / 2), Math.random() * 1) 


		this.subdivide(0, 0, this.size - 1, 1) 

	},


	// Sets the value of a node

	set: function (x, y, value) {

		if (this.map[x][y] == null) {

			this.map[x][y] = value 

		}

	},


	// Gets the value of a node

	get: function (x, y) {

		return this.map[x][y] 

	},


	// Returns the average value of given numbers (arguments)

	average: function () {

		let sum = 0 

		for (let i = 0, l = arguments.length; i < l; ++i) {

			sum += arguments[i] 

		}

		return (sum / arguments.length) // + ( Math.random() - 0.5 ) / deviation * 15  

	},


	// Fits the given number between 0 - 1 range.

	constrain: function (num) {

		return num < 0 ? 0 : num > 1 ? 1 : num 

	},



	// Returns a displacement value.

	displace: function (num, roughness) {

		let max = num / (this.size + this.size) * roughness 

		return (Math.random() - 0.5) * max 

	},


	// Subdivides the terrain recursively.

	subdivide: function (x, y, s, level) {

		if (s > 1) {

			let half_size = Math.floor(s / 2) 


			let midpoint_x = x + half_size,

				midpoint_y = y + half_size 


			let roughness = this.noise / level 


			// Diamond stage

			let tp_lf = this.get(x, y),

				tp_rg = this.get(x + s, y),

				bt_lf = this.get(x, y + s),

				bt_rg = this.get(x + s, y + s) 


			let midpoint_value = this.average(tp_lf, tp_rg, bt_rg, bt_lf) 

			midpoint_value += this.displace(half_size + half_size, roughness) 

			midpoint_value = this.constrain(midpoint_value)


			this.set(midpoint_x, midpoint_y, midpoint_value) 


			// Square stage

			let tp_x = x + half_size,

				tp_y = y 


			let rg_x = x + s,

				rg_y = y + half_size 


			let bt_x = x + half_size,

				bt_y = y + s 


			let lf_x = x,

				lf_y = y + half_size 


			let t_val = this.average(tp_lf, tp_rg) + this.displace(half_size + half_size, roughness),

				r_val = this.average(tp_rg, bt_rg) + this.displace(half_size + half_size, roughness),

				b_val = this.average(bt_lf, bt_rg) + this.displace(half_size + half_size, roughness),

				l_val = this.average(tp_lf, bt_lf) + this.displace(half_size + half_size, roughness) 


			t_val = this.constrain(t_val) 

			r_val = this.constrain(r_val) 

			b_val = this.constrain(b_val) 

			l_val = this.constrain(l_val) 


			this.set(tp_x, tp_y, t_val) 

			this.set(rg_x, rg_y, r_val) 

			this.set(bt_x, bt_y, b_val) 

			this.set(lf_x, lf_y, l_val) 


			this.subdivide(x, y, half_size, level + 1) 

			this.subdivide(x, midpoint_y, half_size, level + 1) 

			this.subdivide(midpoint_x, midpoint_y, half_size, level + 1) 

			this.subdivide(midpoint_x, y, half_size, level + 1) 

		}

	}

}


function generate(map_size, noise, pixel_size) {
	let canvas = document.createElement('canvas'),
		ctx = canvas.getContext('2d') 

	if (text.show_log) {
		console.log('Generatin first planet : Using Diamond square algorithm..')
		console.log('___________________')
		console.log('')
		console.log('The parameters are the following: ')
		console.log('-- Map size: ', map_size)
		console.log('-- Noise: ', noise)
		console.log('-- Pixel size: ', pixel_size)
		console.log('___________________')
	}

	let terrain = new Terrain({
		size: map_size + 1,
		noise: noise
	}) 

	let type = Math.ceil(Math.random() * 4)
	if (text.show_log) {
		console.log('___________________')
		console.log('')
		console.log('Determining colors with following parameter: ', type)
		console.log('-- 1 is earth like')
		console.log('-- 2 is mars like')
		console.log('-- 3 is random color')
		console.log('-- 4 is toned down random color')
		console.log('___________________')
	}
	canvas.width = terrain.size * pixel_size 
	canvas.height = terrain.size * pixel_size 
	let c1 = Math.floor(Math.random() * 255)
	let c2 = Math.floor(Math.random() * 255)
	let c3 = Math.floor(Math.random() * 255)
	terrain.eachNode(function (value, x, y) {
		ctx.beginPath() 
		let c = Math.floor(value * 255) 
		// 1 : habitable (earth like) 2 : Mars Like 
		if (c > 170) { //water
			if (type == 1) {
				ctx.fillStyle = 'rgb(' + 64 + ', ' + 164 + ',' + 223 + ')' 
			}
			if (type == 2) {
				ctx.fillStyle = 'rgb(' + 231 + ', ' + 125 + ',' + 17 + ')' 
			}
			if (type == 3 || type == 4) {
				ctx.fillStyle = 'rgb(' + c1 + ', ' + c2 + ',' + c3 + ')' 
			}

		} else {
			if (type == 1) {
				ctx.fillStyle = 'rgb(' + 124 + ', ' + 252 + ',' + 0 + ')' 
			}
			if (type == 2) {
				ctx.fillStyle = 'rgb(' + 193 + ', ' + 68 + ',' + 14 + ')' 
			}
			if (type == 3) {
				ctx.fillStyle = 'rgb(' + c1 / 2 + ', ' + c2 / 2 + ',' + c3 / 2 + ')' 
			}
			if (type == 4) {
				ctx.fillStyle = 'rgb(' + c1 / 1.2 + ', ' + c2 / 1.2 + ',' + c3 / 1.2 + ')' 
			}

		}

		ctx.rect(x * pixel_size, y * pixel_size, pixel_size, pixel_size) 
		ctx.fill() 
		ctx.closePath() 
	}) 
	return [ctx, canvas]
}


var MyVar = function () {
	this.seed = 'hello.' 
	this.orbit_speed = 0.0004 
	this.pause_orbit = false
	this.pause_rotation = false
	this.rotation_speed = 0.002 
	this.lock = false 
	this.lock_distance = 15
	this.camera_centered = false 
	this.random_generation = false
	this.nb_planets = 6 
	this.resolution = 256 
	this.noise_min = 10 
	this.noise_interval = 500 
	this.show_log = false 
	this.atmosphere_max_height = 0.5 
	this.controls = 'right click to change planet'
	this.generate = function () {} 
} 
let text = new MyVar() 

window.onload = function () {
	var gui = new dat.GUI() 
	gui.add(text, 'seed').listen()
	var f1 = gui.addFolder('Camera options') 
	f1.add(text, 'lock')
	f1.add(text,'lock_distance', 0, 100)
	f1.add(text, 'camera_centered').onChange(() => {
		if (!camera_centered) {
			camera_centered = true
		} else {
			camera_centered = false
		}
	}) 
	var f2 = gui.addFolder('Texture options') 
	f2.add(text, 'resolution', {
		very_low: 17,
		low: 64,
		mid: 256,
		high: 512,
		very_high: 1024
	}).setValue(256) 
	f2.add(text, 'noise_min', 1, 1000) 
	f2.add(text, 'noise_interval', 1, 1000) 
	var f3 = gui.addFolder('Mouvement options') 
	f3.add(text, 'orbit_speed', -0.01, 0.01) 
	f3.add(text, 'rotation_speed', -0.1, 0.1) 
	f3.add(text, 'pause_orbit')
	f3.add(text, 'pause_rotation')
	var f4 = gui.addFolder('Generation options') 
	f4.add(text, 'nb_planets', 1, 20).step(1).onChange(getEl) 
	f4.add(text, 'atmosphere_max_height', 0, 1).step(0.1)
	f4.add(text, 'show_log')
	f4.add(text, 'random_generation')
	var f5 = gui.addFolder('controls') 
	f5.add(text, 'controls')
	gui.add(text, 'generate').onChange(generateNew) 
}

function getEl() {
	x_pos = 0
}


function init(size, px_size) {
	let random_noise = text.noise_min + Math.floor(Math.random() * text.noise_interval)
	//Generate planet
	let context = generate(size, random_noise, px_size) 
	if (text.show_log) {
		console.log('Finished generating planet')
		console.log('Starting generating texture...')
	}
	//get base texture
	let data = context[0].getImageData(0, 0, 2050, 2050) 
	let base_data = context[0].getImageData(0, 0, 2050, 2050) 
	//save texture
	globe_image.texture = context[1].toDataURL("image/jpg")
	//make roughness texture
	for (let i = 0; i < data.data.length; i += 4) {
		let brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2] 
		// red
		data.data[i] = brightness 
		// green
		data.data[i + 1] = brightness 
		// blue
		data.data[i + 2] = brightness 
	}
	context[0].putImageData(data, 0, 0)
	globe_image.BW = context[1].toDataURL("image/jpg")
	//Makes specular texture
	for (let i = 0; i < data.data.length; i += 4) {
		// red
		data.data[i] = 255 - data.data[i] 
		// green
		data.data[i + 1] = 255 - data.data[i + 1] 
		// blue
		data.data[i + 2] = 255 - data.data[i + 2] 
	}
	globe_image.spec = context[1].toDataURL("image/jpg")
	context[0].putImageData(data, 0, 0)
	context[0].fillStyle = 'rgba(255,255,255,0.9)'
	context[0].fillRect(0, 0, 2050, 2050)
	data = context[0].getImageData(0, 0, 2050, 2050) 
	//makes bump map texture
	for (let i = 0; i < data.data.length; i += 4) {
		// red
		data.data[i] = 255 - data.data[i] 
		// green
		data.data[i + 1] = 255 - data.data[i + 1] 
		// blue
		data.data[i + 2] = 255 - data.data[i + 2] 
	}
	context[0].putImageData(data, 0, 0)
	globe_image.bump = context[1].toDataURL("image/jpg")
	context[0].putImageData(base_data, 0, 0)
	if (text.show_log)
		console.log('Finished generating texture')
	return globe_image

}

function generateNew() {
	nb_planets = text.nb_planets
	if(text.random_generation){
		text.seed = Math.random().toString(36).substring(7);
	}
	if (text.show_log) {
		console.log('___________________')
		console.log('')
		console.log('Generating planets with seed: ', text.seed)
		console.log('___________________')
	}
	Math.seedrandom(text.seed)
	for (let i = 0; i < planet_array.length; i++) {
		scene.remove(planet_array[i]) 
	}
	planet_array.splice(0, planet_array.length)
	for (let j = 0; j < nb_planets; j++) {
		if (text.show_log) {
			console.log('________________')
			console.log('*******', j, j, j, j, j, j, j, '*********')
			console.log('________________')
		}
		array_texture.push(init(parseInt(text.resolution), 1))
		planet_array.push(createGlobe(-d / 2 + j * spacing, 0, Math.random() * 3000, j))
	}
	for (let i = 0; i < planet_array.length; i++) {
		scene.add(planet_array[i])
	}
}
generateNew()
window.addEventListener('contextmenu', () => {
	if (x_pos >= nb_planets - 1)
		x_pos = 0

	cameraControls.setTarget(planet_array[x_pos].position.x, 0, planet_array[x_pos].position.z, false)
	cameraControls.dollyTo(10, true)

	x_pos++

})

function createGlobe(x, y, z, texture_nm) {
	let container = new THREE.Object3D()
	let globe_size = 0.2 + Math.random() * 8
	let atmo_size = Math.random() * text.atmosphere_max_height
	let rand_color = '0x' + (Math.random().toString(16) + "000000").substring(2, 8)
	let texture = {}
	rand_color = parseInt(rand_color)
	texture.map = textureLoader.load(array_texture[texture_nm].texture)
	texture.rough = textureLoader.load(array_texture[texture_nm].BW)
	texture.spec = textureLoader.load(array_texture[texture_nm].spec)
	texture.bump = textureLoader.load(array_texture[texture_nm].bump)
	texture.map.anisotropy = 0 
	texture.map.magFilter = THREE.NearestFilter 
	texture.map.minFilter = THREE.NearestFilter 
	if (text.show_log) {
		console.log('___________________')
		console.log('')
		console.log('Determining size of planet with parameter: ', globe_size)
		console.log('___________________')
	}
	let globe = {}
	globe.geometry = new THREE.SphereBufferGeometry(globe_size, 45, 45)
	globe.material = new THREE.MeshStandardMaterial({
		map: texture.map,
		bumpMap: texture.bump,
		roughnessMap: texture.rough,
		roughness: 0.8,
		metalness: 0.3,
		metalnessMap: texture.spec,
	})
	globe.mesh = new THREE.Mesh(globe.geometry, globe.material)

	container.add(globe.mesh)

	let atmosphereGeometry = new THREE.SphereBufferGeometry(globe_size + atmo_size, 45, 45)
	let atmosphereMaterial = new THREE.MeshStandardMaterial({
		side: THREE.DoubleSide,
		transparent: true,
		color: rand_color
	})
	let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial) 
	// Create the planet's Atmospheric glow
	let atmosphericGlowGeometry = new THREE.SphereBufferGeometry(globe_size + atmo_size, 45, 45) 
	let atmosphericGlowMaterial = glowMaterial(0.3, 2, rand_color) 
	let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial) 
	let atmoBool = Math.floor(Math.random() * 2)
	if (text.show_log) {
		console.log('___________________')
		console.log('')
		console.log('Determining atmosphere presence with parameter: ', atmoBool)
		console.log('-- 0 theres is atmosphere')
		console.log('-- 1 theres no atmosphere')
		console.log('___________________')
	}

	if (atmoBool) {
		container.add(atmosphericGlow)
		if (text.show_log) {
			console.log('___________________')
			console.log('')
			console.log('Determining size of atmosphere with parameter: ', atmo_size)
			console.log('___________________')
			console.log('___________________')
			console.log('')
			console.log('Determining color of atmosphere with parameter: ', rand_color)
			console.log('___________________')
		}
	}

	container.position.x = x 
	container.position.y = y 
	container.position.z = z 
	container.castShadow = true
	container.receiveShadow = true
	container.angle = Math.random() * 360
	return container
}


function glowMaterial(intensity, fade, color) {
	// Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
	let glowMaterial = new THREE.ShaderMaterial({
		uniforms: {
			'c': {
				type: 'f',
				value: intensity
			},
			'p': {
				type: 'f',
				value: fade
			},
			glowColor: {
				type: 'c',
				value: new THREE.Color(color)
			},
			viewVector: {
				type: 'v3',
				value: camera.position
			}
		},
		vertexShader: `
        uniform vec3 viewVector;
        uniform float c;
        uniform float p;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize( normalMatrix * normal );
          vec3 vNormel = normalize( normalMatrix * viewVector );
          intensity = pow( c - dot(vNormal, vNormel), p );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
		fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() 
        {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, 1.0 );
        }`,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}) 

	return glowMaterial 
}


/**
 * Loop
 */

const loop = () => {
	window.requestAnimationFrame(loop)
	const delta = clock.getDelta() 
	const hasControlsUpdated = cameraControls.update(delta) 

	for (let i = 1; i < planet_array.length; i++) {
		if(!text.pause_rotation)
			planet_array[i].rotation.y += text.rotation_speed
		if(!text.pause_orbit)
			planet_array[i].angle += text.orbit_speed
		planet_array[i].position.x = Math.cos(planet_array[i].angle / i) * 500 * i
		planet_array[i].position.z = Math.sin(planet_array[i].angle / i) * 500 * i
	}

	if (!camera_centered)
		cameraControls.setTarget(planet_array[x_pos].position.x, 0, planet_array[x_pos].position.z, true)
	else
		cameraControls.setTarget(0, 0, 0, true)
	if (text.lock)
		cameraControls.dollyTo(text.lock_distance, true)

	// Renderer
	renderer.render(scene, camera)
}
loop()