import './css/style.styl'
import CameraControls from 'camera-controls'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import skyboxTexture from './img/texture/skybox/skybox.png'
import starText from './img/texture/particle64.png'
const textureLoader = new THREE.TextureLoader()
CameraControls.install({
	THREE: THREE
});
let quickNormalMap = require("quick-normal-map")
let ndarray = require("ndarray")
let camera_centered = false

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 10000)
camera.position.z = 30
scene.add(camera)

const galaxyPoint = new THREE.Mesh(
	new THREE.SphereBufferGeometry(20, 50,50),
	new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.8, opacity: 0.5 })
)
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7)
//galaxyPoint.add(ambientLight)
scene.add(galaxyPoint)
const sunLight = new THREE.PointLight( 0xffffff, 1, 0);
sunLight.position.set( 0, 0, 0 );
sunLight.castShadow = true
sunLight.shadow.camera.top = 1.20
sunLight.shadow.camera.right = 1.20
sunLight.shadow.camera.bottom = -1.20
sunLight.shadow.camera.left = -1.20
scene.add( sunLight );

const light1 = new THREE.PointLight( 0xffffff, 10, 200);
light1.position.set( 100, 0, 0 );
light1.castShadow = false
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 10, 200);
light2.position.set( -100, 0, 0 );
light2.castShadow = false
scene.add( light2 );

const light3 = new THREE.PointLight( 0xffffff, 10, 200);
light3.position.set( 0, 0, 100 );
light3.castShadow = false
scene.add( light3 );

const light4 = new THREE.PointLight( 0xffffff, 10, 200);
light4.position.set( 0, 0, -100 );
light4.castShadow = false
scene.add( light4 );

const light5= new THREE.PointLight( 0xffffff, 10, 200);
light5.position.set( 0, 100, 0 );
light5.castShadow = false
scene.add( light5 );

const light6 = new THREE.PointLight( 0xffffff, 10, 200);
light6.position.set( 0, -100, 0 );
light6.castShadow = false
scene.add( light6 );
/*

Do clusters of stars (select a point, build around it), complexité log(n). 

*/

let geometry = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
for (let i in geometry.vertices) {
	let vertex = geometry.vertices[i];
	vertex.normalize().multiplyScalar(4000);
}
let materialArray = [];
for (let i = 0; i < 6; i++) {
	let faceMaterial = new THREE.MeshPhongMaterial();
	faceMaterial.map = textureLoader.load(skyboxTexture); // see github for implementation
	materialArray.push(faceMaterial);
}

let sphereMaterial = new THREE.MeshFaceMaterial(materialArray);
let material = new THREE.MeshBasicMaterial({
	map: textureLoader.load(skyboxTexture),
	side: THREE.BackSide
})
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
});
let Terrain = function (options) {

	let self = this;


	this.size = 9;

	this.noise = 0.1;

	this.deviation = 5;

	this.roughness = 13;


	for (let i in options) this[i] = options[i];


	if (typeof this.map === 'undefined') {

		this.map = this.createMap();

	}


	this.generate();


	this.map.EDGE_TOP = 0x0;

	this.map.EDGE_RIGHT = 0x1;

	this.map.EDGE_BOTTOM = 0x2;

	this.map.EDGE_LEFT = 0x3;


	this.map.FLIP_NONE = 0x0;

	this.map.FLIP_VERT = 0x1;

	this.map.FLIP_HORZ = 0x2;


	this.map.size = this.size;

	this.map.eachNode = this.eachNode;

	this.map.getEdge = function (edge) {

		return self.getEdge(edge);

	}


	return this.map;

}


Terrain.prototype = {


	getEdge: function (edge, flip) {

		let node, x, y,

			chunk = this.createMap();


		for (x = 0; x < this.size; ++x) {

			for (y = 0; y < this.size; ++y) {

				node = this.map[x] && this.map[x][y];


				if (edge === this.map.EDGE_TOP && y === 0) {

					chunk[x][y] = this.map[x][y];

				} else if (edge === this.map.EDGE_BOTTOM && y === this.size - 1) {

					chunk[x][y] = this.map[x][y];

				} else if (edge === this.map.EDGE_LEFT && x === 0) {

					chunk[x][y] = this.map[x][y];

				} else if (edge === this.map.EDGE_RIGHT && x === this.size - 1) {

					chunk[x][y] = this.map[x][y];

				}

			}

		}


		if (flip === this.FLIP_VERT) {

			for (x = 0; x < this.size; ++x) {

				chunk[x].reverse();

			}

			chunk.reverse();

		}


		if (flip === this.FLIP_HORZ) {

			chunk.reverse();

		}


		return chunk;

	},


	createMap: function () {

		let map = [];

		let w = this.size;

		while (w--) {

			let h = this.size;

			if (typeof map[w] == 'undefined')

				map[w] = [];

			while (h--) {

				map[w][h] = null;

			}

		}

		return map;

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

				fn(this[x][y], x, y);

			}

		}

	},


	// Generates the terrain

	generate: function () {

		this.set(0, 0, Math.random() * 1);

		this.set(this.size - 1, 0, Math.random() * 1);

		this.set(this.size - 1, this.size - 1, Math.random() * 1);

		this.set(0, this.size - 1, Math.random() * 1);


		this.set(Math.floor(this.size / 2), Math.floor(this.size / 2), Math.random() * 1);


		this.subdivide(0, 0, this.size - 1, 1);

	},


	// Sets the value of a node

	set: function (x, y, value) {

		if (this.map[x][y] == null) {

			this.map[x][y] = value;

		}

	},


	// Gets the value of a node

	get: function (x, y) {

		return this.map[x][y];

	},


	// Returns the average value of given numbers (arguments)

	average: function () {

		let sum = 0;

		for (let i = 0, l = arguments.length; i < l; ++i) {

			sum += arguments[i];

		}

		return (sum / arguments.length) // + ( Math.random() - 0.5 ) / deviation * 15 ;

	},


	// Fits the given number between 0 - 1 range.

	constrain: function (num) {

		return num < 0 ? 0 : num > 1 ? 1 : num;

	},



	// Returns a displacement value.

	displace: function (num, roughness) {

		let max = num / (this.size + this.size) * roughness;

		return (Math.random() - 0.5) * max;

	},


	// Subdivides the terrain recursively.

	subdivide: function (x, y, s, level) {

		if (s > 1) {

			let half_size = Math.floor(s / 2);


			let midpoint_x = x + half_size,

				midpoint_y = y + half_size;


			let roughness = this.noise / level;


			// Diamond stage

			let tp_lf = this.get(x, y),

				tp_rg = this.get(x + s, y),

				bt_lf = this.get(x, y + s),

				bt_rg = this.get(x + s, y + s);


			let midpoint_value = this.average(tp_lf, tp_rg, bt_rg, bt_lf);

			midpoint_value += this.displace(half_size + half_size, roughness);

			midpoint_value = this.constrain(midpoint_value)


			this.set(midpoint_x, midpoint_y, midpoint_value);


			// Square stage

			let tp_x = x + half_size,

				tp_y = y;


			let rg_x = x + s,

				rg_y = y + half_size;


			let bt_x = x + half_size,

				bt_y = y + s;


			let lf_x = x,

				lf_y = y + half_size;


			let t_val = this.average(tp_lf, tp_rg) + this.displace(half_size + half_size, roughness),

				r_val = this.average(tp_rg, bt_rg) + this.displace(half_size + half_size, roughness),

				b_val = this.average(bt_lf, bt_rg) + this.displace(half_size + half_size, roughness),

				l_val = this.average(tp_lf, bt_lf) + this.displace(half_size + half_size, roughness);


			t_val = this.constrain(t_val);

			r_val = this.constrain(r_val);

			b_val = this.constrain(b_val);

			l_val = this.constrain(l_val);


			this.set(tp_x, tp_y, t_val);

			this.set(rg_x, rg_y, r_val);

			this.set(bt_x, bt_y, b_val);

			this.set(lf_x, lf_y, l_val);


			this.subdivide(x, y, half_size, level + 1);

			this.subdivide(x, midpoint_y, half_size, level + 1);

			this.subdivide(midpoint_x, midpoint_y, half_size, level + 1);

			this.subdivide(midpoint_x, y, half_size, level + 1);

		}

	}

}


function generate(map_size, noise, pixel_size) {

	let  canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');


	//div.appendChild(canvas);

	//document.body.appendChild(div);
	if(text.showLog){
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


	});



	let type = Math.ceil(Math.random() * 4)
	if(text.showLog){
		console.log('___________________')
		console.log('')
		console.log('Determining colors with following parameter: ', type)
		console.log('-- 1 is earth like')
		console.log('-- 2 is mars like')
		console.log('-- 3 is random color')
		console.log('-- 4 is toned down random color')
		console.log('___________________')
	}
	canvas.width = terrain.size * pixel_size;
	canvas.height = terrain.size * pixel_size;
	let c1 = Math.floor(Math.random() * 255)
	let c2 = Math.floor(Math.random() * 255)
	let c3 = Math.floor(Math.random() * 255)
	terrain.eachNode(function (value, x, y) {


		ctx.beginPath();


		let c = Math.floor(value * 255);
		// 1 : habitable (earth like) 2 : Mars Like 
		if (c > 170) { //water
			if (type == 1) {
				ctx.fillStyle = 'rgb(' + 64 + ', ' + 164 + ',' + 223 + ')';
			}
			if (type == 2) {
				ctx.fillStyle = 'rgb(' + 231 + ', ' + 125 + ',' + 17 + ')';
			}
			if (type == 3 || type == 4) {
				ctx.fillStyle = 'rgb(' + c1 + ', ' + c2 + ',' + c3 + ')';
			}

		} else {
			if (type == 1) {
				ctx.fillStyle = 'rgb(' + 124 + ', ' + 252 + ',' + 0 + ')';
			}
			if (type == 2) {
				ctx.fillStyle = 'rgb(' + 193 + ', ' + 68 + ',' + 14 + ')';
			}
			if (type == 3) {
				ctx.fillStyle = 'rgb(' + c1 / 2 + ', ' + c2 / 2 + ',' + c3 / 2 + ')';
			}
			if (type == 4) {
				ctx.fillStyle = 'rgb(' + c1 / 1.2 + ', ' + c2 / 1.2 + ',' + c3 / 1.2 + ')';
			}

		}

		ctx.rect(x * pixel_size, y * pixel_size, pixel_size, pixel_size);


		ctx.fill();


		ctx.closePath();


	});
	//ctx.fillStyle = 'rgba(255,255,255,0.9)';
	//ctx.fillRect(0,0,513,30)
	//ctx.fillRect(0,490,513,23)
	return [ctx, canvas]
}
var FizzyText = function() {
	this.seed = 'hello';
	this.orbit_speed = 0.8;
	this.rotation_speed = 0.4;
	this.lock = false;
	this.camera_centered = false;
	this.nb_planets = 6;
	this.resolution = 16;
	this.primary = "#ffae23";
	this.secondary = "#d7b781";
	this.showLog = true;
	this.generate = function() {};
  };

let text = new FizzyText();

  
window.onload = function() {
	var gui = new dat.GUI();
	gui.add(text, 'seed');
	var f1 = gui.addFolder('Camera options');
	f1.add(text, 'lock').onChange(()=>{if(!lock_camera){lock_camera = true}else{lock_camera = false}});
	f1.add(text, 'camera_centered').onChange(()=>{if(!camera_centered){camera_centered = true}else{camera_centered = false}});
	var f2 = gui.addFolder('Texture options');
	f2.add(text, 'resolution', { very_low: 16, low: 64, mid: 256, high: 512, very_high: 1024 } ).setValue(256);
	f2.addColor(text, 'primary');
	f2.addColor(text, 'secondary');
	var f3 = gui.addFolder('Mouvement options');
	f3.add(text, 'orbit_speed', -5, 5);
	f3.add(text, 'rotation_speed', -5, 5);
	var f4 = gui.addFolder('Generation options');
	f4.add(text, 'nb_planets', 1, 20).step(1).onChange(getEl);
	f4.add(text, 'showLog').onChange(()=>{if(!text.show_log){text.show_log = true}else{text.show_log = false}});
	gui.add(text, 'generate').onChange(generateNew);
  }
  function getEl(){
	nb_planets = text.nb_planets
	x_pos = 0
  }


let arrayTexture = new Array()
let globeImg = {}

function init(size, px_size) {
	let randNoise = 10 + Math.floor(Math.random() * 500)
	let context = generate(size, randNoise, px_size);
	if(text.showLog){
		console.log('Finished generating planet')
		console.log('Starting generating texture...')
	}
	let data = context[0].getImageData(0, 0, 2050, 2050);
	let base_data = context[0].getImageData(0, 0, 2050, 2050);

	let ar = ndarray(data.data, [2, 2])
	//console.log(data.data[0],data.data[1],data.data[2],data.data[3])
	let normal = quickNormalMap(ar)
	let ar2 = ndarray(normal.data, [1, 1])
	globeImg.texture = context[1].toDataURL("image/jpg")
	/*
		for(let i = 0; i < data.data.length; i += 4) {
		  // red
		  data.data[i] = 255 - data.data[i];
		  // green
		  data.data[i + 1] = 255 - data.data[i + 1];
		  // blue
		  data.data[i + 2] = 255 - data.data[i + 2];
		}*/
	//Roughness
	let globalB = 0
	let globalC = 0
	for (let i = 0; i < data.data.length; i += 4) {
		let brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		// red
		data.data[i] = brightness;
		// green
		data.data[i + 1] = brightness;
		// blue
		data.data[i + 2] = brightness;
	}
	context[0].putImageData(data, 0, 0)
	globeImg.BW = context[1].toDataURL("image/jpg")
	//Specular
	for (let i = 0; i < data.data.length; i += 4) {
		// red
		data.data[i] = 255 - data.data[i];
		// green
		data.data[i + 1] = 255 - data.data[i + 1];
		// blue
		data.data[i + 2] = 255 - data.data[i + 2];
	}
	globeImg.spec = context[1].toDataURL("image/jpg")
	context[0].putImageData(data, 0, 0)
	context[0].fillStyle = 'rgba(255,255,255,0.9)'
	context[0].fillRect(0, 0, 2050, 2050)
	data = context[0].getImageData(0, 0, 2050, 2050);
	for (let i = 0; i < data.data.length; i += 4) {
		// red
		data.data[i] = 255 - data.data[i];
		// green
		data.data[i + 1] = 255 - data.data[i + 1];
		// blue
		data.data[i + 2] = 255 - data.data[i + 2];
	}
	context[0].putImageData(data, 0, 0)
	globeImg.bump = context[1].toDataURL("image/jpg")
	context[0].putImageData(base_data, 0, 0)
	// overwrite original image
	//arrayTexture.push(globeImg)
	if(text.showLog)
		console.log('Finished generating texture')
	return globeImg

}

let nb_gala = 0
let x_pos = 0
let nb_planets = 6
let d = 6000
let spacing = d / nb_planets
let lock_camera = false
let planetArray = new Array()
function generateNew(){
	for (let i = 0; i < planetArray.length; i++) {
		scene.remove(planetArray[i]);
		//planetArray[i].geometry.dispose();
		//planetArray[i].material.dispose();
	}
	planetArray.splice(0, planetArray.length)
	for (let j = 0; j < nb_planets; j++) {
		if(text.showLog){
			console.log('________________')
			console.log('*******', j, j, j, j, j, j, j, '*********')
			console.log('________________')
		}
		arrayTexture.push(init(256, 1))
		planetArray.push(createGlobe(-d / 2 + j * spacing, 0, Math.random()*3000, j))
	}
	for (let i = 0; i < planetArray.length; i++) {
		scene.add(planetArray[i])
	}
}
generateNew()
window.addEventListener('contextmenu', () => {
	if (x_pos >= nb_planets-1)
		x_pos = 0
	//cameraControls.setPosition( galaxyArray[rand].cx,galaxyArray[rand].cy,galaxyArray[rand].cz, true)
	cameraControls.setTarget(planetArray[x_pos].position.x, 0, planetArray[x_pos].position.z, false)
	cameraControls.dollyTo(10, true)

	x_pos++
	//console.log(planetArray[0].position)
})

function createGlobe(x, y, z, texture_nm) {
	let container = new THREE.Object3D()
	let globe_size = 0.2 + Math.random() * 8
	let atmo_size = Math.random() / 4
	let rand_color = '0x' + (Math.random().toString(16) + "000000").substring(2, 8)
	let texture = {}
	rand_color = parseInt(rand_color)
	texture.map = textureLoader.load(arrayTexture[texture_nm].texture)
	texture.rough = textureLoader.load(arrayTexture[texture_nm].BW)
	texture.spec = textureLoader.load(arrayTexture[texture_nm].spec)
	texture.bump = textureLoader.load(arrayTexture[texture_nm].bump)
	texture.map.anisotropy = 0;
	texture.map.magFilter = THREE.NearestFilter;
	texture.map.minFilter = THREE.NearestFilter;
	if(text.showLog){
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
	let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
	// Create the planet's Atmospheric glow
	let atmosphericGlowGeometry = new THREE.SphereBufferGeometry(globe_size + atmo_size, 45, 45);
	let atmosphericGlowMaterial = glowMaterial(0.3, 2, rand_color);
	let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);
	let atmoBool = Math.floor(Math.random() * 2)
	if(text.showLog){
		console.log('___________________')
		console.log('')
		console.log('Determining atmosphere presence with parameter: ', atmoBool)
		console.log('-- 0 theres is atmosphere')
		console.log('-- 1 theres no atmosphere')
		console.log('___________________')
	}

	if (atmoBool) {
		container.add(atmosphericGlow)
		if(text.showLog){
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

	container.position.x = x;
	container.position.y = y;
	container.position.z = z;
	container.castShadow = true
	container.receiveShadow = true
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
	});

	return glowMaterial;
}


/**
 * Loop
 */
let angle = 0
console.log(planetArray[0])
const loop = () => {
	window.requestAnimationFrame(loop)
	const delta = clock.getDelta();
	const hasControlsUpdated = cameraControls.update(delta);

	//console.log(camera.position)
	for (let i = 1; i < planetArray.length; i++) {
		planetArray[i].rotation.y += planetArray[i].scale.x / 1000
		planetArray[i].position.x = Math.cos(angle/i) * 500 * i
		planetArray[i].position.z = Math.sin(angle/i) * 500 * i
	}
	//containerSolarSystem.rotation.y += 0.0001
	 angle += 0.0007	
	 
	//cameraControls.setPosition( planetArray[x_pos].position.x,0,planetArray[x_pos].position.z, false)
	if(!camera_centered)
		cameraControls.setTarget(planetArray[x_pos].position.x, 0, planetArray[x_pos].position.z, true)
	else
		cameraControls.setTarget(0, 0, 0, true)
	if(lock_camera)
		cameraControls.dollyTo(30, true)

	// Renderer
	renderer.render(scene, camera)
}
loop()