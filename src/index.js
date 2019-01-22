import './css/style.styl'
import CameraControls from 'camera-controls';
import * as THREE from 'three'
import skyboxTexture from './img/texture/skybox/skybox.png' 
import starText from './img/texture/particle64.png' 
const textureLoader = new THREE.TextureLoader()
CameraControls.install( { THREE: THREE } );
let quickNormalMap = require("quick-normal-map")
let ndarray = require("ndarray")


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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 10000)
camera.position.z = 30
scene.add(camera)


/**
 * Universe


let galaxyArray = new Array()
const universe = new THREE.Object3D()
const ul = 5000
const nb_of_clusters = 50
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
    const cluster_size = 50 + Math.random()*150
    //linear cluster generation
    for(let j = 0; j < 200; j++)
    {
        var particleGeometry = new THREE.Geometry();
        if(true){
            gvx = Math.random() * 1.2
            gvy = Math.random() * 1.2
            gvz = Math.random() * 1
        }
        const tx = galaxyArray[i].cx + ((-(cluster_size * gvx)/2) + Math.random() * (cluster_size * gvx))
        const ty = galaxyArray[i].cy + ((-(cluster_size * gvy)/2) + Math.random() * (cluster_size * gvy))/2
        const tz = galaxyArray[i].cz + ((-(cluster_size * gvz)/2) + Math.random() * (cluster_size * gvz))
        const vertice = new THREE.Vector3(1, 1, 1);
        particleGeometry.vertices.push(vertice);

        let materialP = new THREE.PointsMaterial({
                    map: textureLoader.load(starText), 
                    color: cluster_color,
                    transparent: true,
                    size: 10,
                    sizeAttenuation: false
                    })
        
        const star = new THREE.Points(
            particleGeometry,
            materialP
         );

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
 */
/**
        this.belt = {}
        this.belt.geometry = new THREE.Geometry()
        for ( let i = 0; i < 20000; i ++ ) {
            const vertice = new THREE.Vector3();
            const angle = Math.random() * Math.PI * 2
            const distance = 1.5 + Math.random() * 1.5

            vertice.x = Math.cos(angle) * distance
            vertice.y = (Math.random() - 0.5) *0.2
            vertice.z = Math.sin(angle) * distance
        
            this.belt.geometry.vertices.push( vertice );
        
        }
        this.belt.material = new THREE.PointsMaterial( { 
            map: this.textureLoader.load(rockSource), 
            transparent: true,
            size: 2,
            sizeAttenuation: false
        } );
        this.belt.point = new THREE.Points( this.belt.geometry, this.belt.material );
        this.container.add(this.belt.point)
**/


const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3)
//scene.add(ambientLight)

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
});
var Terrain = function( options ) {

	var self = this;


	this.size = 9;

	this.noise = 0.1;

	this.deviation = 5;

	this.roughness = 13;


	for ( var i in options ) this[ i ] = options[ i ];


	if ( typeof this.map === 'undefined' ) {

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

	this.map.getEdge = function( edge ) {

		return self.getEdge( edge );

	}


	return this.map;

}


Terrain.prototype = {


	getEdge: function( edge, flip ) {

		var node, x, y,

			chunk = this.createMap();


		for ( x = 0; x < this.size; ++x ) {

			for ( y = 0; y < this.size; ++y ) {

				node = this.map[ x ] && this.map[ x ][ y ];


				if ( edge === this.map.EDGE_TOP && y === 0 ) {

					chunk[ x ][ y ] = this.map[ x ][ y ];

				} else if ( edge === this.map.EDGE_BOTTOM && y === this.size - 1 ) {

					chunk[ x ][ y ] = this.map[ x ][ y ];

				} else if ( edge === this.map.EDGE_LEFT && x === 0 ) {

					chunk[ x ][ y ] = this.map[ x ][ y ];

				} else if ( edge === this.map.EDGE_RIGHT && x === this.size - 1 ) {

					chunk[ x ][ y ] = this.map[ x ][ y ];

				}

			}

		}


		if ( flip === this.FLIP_VERT ) {

			for ( x = 0; x < this.size; ++x ) {

				chunk[ x ].reverse();

			}

			chunk.reverse();

		}


		if ( flip === this.FLIP_HORZ ) {

			chunk.reverse();

		}


		return chunk;

	},


	createMap: function() {

		var map = [];

		var w = this.size;

		while ( w-- ) {

			var h = this.size;

			if ( typeof map[ w ] == 'undefined' )

				map[ w ] = [];

			while ( h-- ) {

				map[ w ][ h ] = null;

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

	eachNode: function( fn ) {

		for ( var x = 0; x < this.size; ++x ) {

			for ( var y = 0; y < this.size; ++y ) {

				fn( this[ x ][ y ], x, y );

			}

		}

	},


	// Generates the terrain

	generate: function() {

		this.set( 0, 0, Math.random() * 1 );

		this.set( this.size - 1, 0, Math.random() * 1 );

		this.set( this.size - 1, this.size - 1, Math.random() * 1 );

		this.set( 0, this.size - 1, Math.random() * 1 );


		this.set( Math.floor( this.size / 2 ), Math.floor( this.size / 2 ), Math.random() * 1 );


		this.subdivide( 0, 0, this.size - 1, 1 );

	},


	// Sets the value of a node

	set: function( x, y, value ) {

		if ( this.map[ x ][ y ] == null ) {

			this.map[ x ][ y ] = value;

		}

	},


	// Gets the value of a node

	get: function( x, y ) {

		return this.map[ x ][ y ];

	},


	// Returns the average value of given numbers (arguments)

	average: function() {

		var sum = 0;

		for ( var i = 0, l = arguments.length; i < l; ++i ) {

			sum += arguments[ i ];

		}

		return ( sum / arguments.length ) // + ( Math.random() - 0.5 ) / deviation * 15 ;

	},


	// Fits the given number between 0 - 1 range.

	constrain: function( num ) {

		return num < 0 ? 0 : num > 1 ? 1 : num;

	},



	// Returns a displacement value.

	displace: function( num, roughness ) {

		var max = num / ( this.size + this.size ) * roughness;

		return ( Math.random() - 0.5 ) * max;

	},


	// Subdivides the terrain recursively.

	subdivide: function( x, y, s, level ) {

		if ( s > 1 ) {

			var half_size = Math.floor( s / 2 );


			var midpoint_x = x + half_size,

				midpoint_y = y + half_size;


			var roughness = this.noise / level;


			// Diamond stage

			var tp_lf = this.get( x, y ),

				tp_rg = this.get( x + s, y ),

				bt_lf = this.get( x, y + s ),

				bt_rg = this.get( x + s, y + s );


			let midpoint_value = this.average( tp_lf, tp_rg, bt_rg, bt_lf );

			midpoint_value += this.displace( half_size + half_size, roughness );

			midpoint_value = this.constrain( midpoint_value )


			this.set( midpoint_x, midpoint_y, midpoint_value );


			// Square stage

			var tp_x = x + half_size,

				tp_y = y;


			var rg_x = x + s,

				rg_y = y + half_size;


			var bt_x = x + half_size,

				bt_y = y + s;


			var lf_x = x,

				lf_y = y + half_size;


			var t_val = this.average( tp_lf, tp_rg ) + this.displace( half_size + half_size, roughness ),

				r_val = this.average( tp_rg, bt_rg ) + this.displace( half_size + half_size, roughness ),

				b_val = this.average( bt_lf, bt_rg ) + this.displace( half_size + half_size, roughness ),

				l_val = this.average( tp_lf, bt_lf ) + this.displace( half_size + half_size, roughness );


			t_val = this.constrain( t_val );

			r_val = this.constrain( r_val );

			b_val = this.constrain( b_val );

			l_val = this.constrain( l_val );


			this.set( tp_x, tp_y, t_val );

			this.set( rg_x, rg_y, r_val );

			this.set( bt_x, bt_y, b_val );

			this.set( lf_x, lf_y, l_val );


			this.subdivide( x, y, half_size, level + 1 );

			this.subdivide( x, midpoint_y, half_size, level + 1 );

			this.subdivide( midpoint_x, midpoint_y, half_size, level + 1 );

			this.subdivide( midpoint_x, y, half_size, level + 1 );

		}

	}

}


function generate( map_size, noise, pixel_size ) {

    var div    = document.createElement('div'),


        canvas = document.createElement('canvas'),
        ctx    = canvas.getContext('2d');
    

    div.appendChild( canvas );

	document.body.appendChild(div);
	
	console.log('Generatin first planet : Using Diamond square algorithm..')
	console.log('___________________')
	console.log('')
	console.log('The parameters are the following: ')
	console.log('-- Map size: ', map_size)
	console.log('-- Noise: ', noise)
	console.log('-- Pixel size: ', pixel_size)
	console.log('___________________')
    var terrain = new Terrain({


        size : map_size + 1,


        noise  : noise


    });



	let type = Math.ceil(Math.random()*4)
	console.log('___________________')
	console.log('')
	console.log('Determining colors with following parameter: ', type)
	console.log('-- 1 is earth like')
	console.log('-- 2 is mars like')
	console.log('-- 3 is random color')
	console.log('-- 4 is toned down random color')
	console.log('___________________')
	canvas.width  = terrain.size * pixel_size;
    canvas.height = terrain.size * pixel_size;
	let c1 = Math.floor(Math.random()*255)
	let c2 = Math.floor(Math.random()*255)
	let c3 = Math.floor(Math.random()*255)
    terrain.eachNode(function( value, x, y ){


        ctx.beginPath();


        var c = Math.floor( value * 255 );
		// 1 : habitable (earth like) 2 : Mars Like 
		if(c > 170){	//water
			if(type == 1){
				ctx.fillStyle = 'rgb(' + 64 + ', ' + 164 + ',' + 223 + ')';
			}
			if(type == 2){
				ctx.fillStyle = 'rgb(' + 231 + ', ' + 125 + ',' + 17 + ')';
			}
			if(type == 3 || type == 4){
				ctx.fillStyle = 'rgb(' + c1 + ', ' + c2 + ',' + c3 + ')';
			}
			
		}
		else{
			if(type == 1){
				ctx.fillStyle = 'rgb(' + 124 + ', ' + 252 + ',' + 0 + ')';
			}
			if(type == 2){
				ctx.fillStyle = 'rgb(' + 193 + ', ' + 68 + ',' + 14 + ')';
			}
			if(type == 3){
				ctx.fillStyle = 'rgb(' + c1/2 + ', ' + c2/2 + ',' + c3/2 + ')';
			}
			if(type == 4){
				ctx.fillStyle = 'rgb(' + c1/1.2 + ', ' + c2/1.2 + ',' + c3/1.2 + ')';
			}
			
		}
        
        ctx.rect( x * pixel_size, y * pixel_size, pixel_size, pixel_size );


        ctx.fill();


		ctx.closePath();
		

	});
	//ctx.fillStyle = 'rgba(255,255,255,0.9)';
	//ctx.fillRect(0,0,513,30)
	//ctx.fillRect(0,490,513,23)
    return [ctx, canvas]
}




let arrayTexture = new Array()
let globeImg = {}

function init(size, px_size){


   // generate( 8, 2, 32 );


 
	let randNoise = 10 + Math.floor(Math.random()*500)
	let context = generate(size, randNoise, px_size);
	console.log('Finished generating planet')
	console.log('Starting generating texture...')
	let data = context[0].getImageData(0,0,2050,2050);
	let base_data = context[0].getImageData(0,0,2050,2050);
	
	let ar = ndarray(data.data,[2,2])
    //console.log(data.data[0],data.data[1],data.data[2],data.data[3])
	let normal = quickNormalMap(ar)
	let ar2 = ndarray(normal.data, [1,1])
	globeImg.texture = context[1].toDataURL("image/jpg")/*
	for(var i = 0; i < data.data.length; i += 4) {
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
	for(var i = 0; i < data.data.length; i += 4) {
		var brightness = 0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2];
		// red
		data.data[i] = brightness;
		// green
		data.data[i + 1] = brightness;
		// blue
		data.data[i + 2] = brightness;
	  }
	context[0].putImageData(data,0,0)
	globeImg.BW = context[1].toDataURL("image/jpg")
	//Specular
	for(var i = 0; i < data.data.length; i += 4) {
		// red
		data.data[i] = 255 - data.data[i];
		// green
		data.data[i + 1] = 255 - data.data[i + 1];
		// blue
		data.data[i + 2] = 255 - data.data[i + 2];
	  }
	  globeImg.spec = context[1].toDataURL("image/jpg")
	  context[0].putImageData(data,0,0)
	  context[0].fillStyle = 'rgba(255,255,255,0.9)'
	  context[0].fillRect(0,0,2050,2050)
	  data = context[0].getImageData(0,0,2050,2050);
	  for(var i = 0; i < data.data.length; i += 4) {
		// red
		data.data[i] = 255 - data.data[i];
		// green
		data.data[i + 1] = 255 - data.data[i + 1];
		// blue
		data.data[i + 2] = 255 - data.data[i + 2];
	  }
	  context[0].putImageData(data,0,0)
	  globeImg.bump = context[1].toDataURL("image/jpg")
	  context[0].putImageData(base_data,0,0)
	// overwrite original image
	//arrayTexture.push(globeImg)
	console.log('Finished generating texture')
	return globeImg

}

let nb_gala = 0
let x_pos = 0
let nb_planets = 6
let d = 6000
let spacing = d/nb_planets
let planetArray = new Array()
for (let j = 0; j < nb_planets; j++) {
	console.log('________________')
	console.log('*******',j,j,j,j,j,j,j,'*********')
	console.log('________________')
	arrayTexture.push(init(2048, 1))
	planetArray.push(createGlobe(-d/2 + j*spacing,0,0,j))
}
window.addEventListener('contextmenu', () =>
{	
	if(x_pos >= nb_planets)
		x_pos = 0
    //cameraControls.setPosition( galaxyArray[rand].cx,galaxyArray[rand].cy,galaxyArray[rand].cz, true)
    cameraControls.setTarget(planetArray[x_pos].position.x,0,0, true)
	cameraControls.dollyTo( 50, true )

	x_pos++
})

function createGlobe(x,y,z,texture_nm){
	let container = new THREE.Object3D()
	let globe_size = 0.2 + Math.random()*8
	let atmo_size = Math.random()/2
	let rand_color = '0x' + (Math.random().toString(16) + "000000").substring(2,8)
	rand_color = parseInt(rand_color)
	let texture = {}
	texture.map = textureLoader.load(arrayTexture[texture_nm].texture)
	texture.rough = textureLoader.load(arrayTexture[texture_nm].BW)
	texture.spec = textureLoader.load(arrayTexture[texture_nm].spec)
	texture.bump = textureLoader.load(arrayTexture[texture_nm].bump)
	texture.map.anisotropy = 0;
	texture.map.magFilter = THREE.NearestFilter;
	texture.map.minFilter = THREE.NearestFilter;
	console.log('___________________')
	console.log('')
	console.log('Determining size of planet with parameter: ', globe_size)
	console.log('___________________')
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
			let atmosphereMaterial =  new THREE.MeshStandardMaterial({
			 side: THREE.DoubleSide,
			 transparent: true,
			 color: rand_color
		 })
			let atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
			  // Create the planet's Atmospheric glow
		   let atmosphericGlowGeometry = new THREE.SphereBufferGeometry(globe_size + atmo_size, 45, 45);
		   let atmosphericGlowMaterial = glowMaterial(0.5, 2, rand_color);
		   let atmosphericGlow = new THREE.Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);
		   let atmoBool = Math.floor(Math.random()*2)
		   console.log('___________________')
		   console.log('')
		   console.log('Determining atmosphere presence with parameter: ', atmoBool)
		   console.log('-- 0 theres is atmosphere')
		   console.log('-- 1 theres no atmosphere')
		   console.log('___________________')
		   if(atmoBool){
			container.add(atmosphericGlow)
			 console.log('___________________')
			 console.log('')
			 console.log('Determining size of atmosphere with parameter: ', atmo_size)
			 console.log('___________________')
			 console.log('___________________')
			 console.log('')
			 console.log('Determining color of atmosphere with parameter: ', rand_color)
			 console.log('___________________')
		   }
		 
		   container.position.x = x;
		   container 	.position.y = y;
		   container.position.z = z;
		   container.castShadow = true
		   container.receiveShadow = true
		   scene.add(container)
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
        }`
      ,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() 
        {
          vec3 glow = glowColor * intensity;
          gl_FragColor = vec4( glow, 1.0 );
        }`
      ,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    return glowMaterial;
  }


   // Create the planet's Atmosphere
 

/**
 * Loop
 */
const loop = () =>
{
    window.requestAnimationFrame(loop)
    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update( delta );

    //console.log(camera.position)

    // Renderer
    renderer.render(scene, camera)
}
loop()
