<script>
import {
	onMount,
	onDestroy,
	afterUpdate,
	beforeUpdate
} from 'svelte';

import * as THREE from 'three';

/**
 * PROPS
 */
export let width = 900;
export let height = 600;

/**
 * STATE
 */
let scene, camera, renderer;
let globe;

/**
 * CONSTANTS
 */
const FOV = 45;
const NEAR = 1;
const FAR = 4000;

/**
 * REFS
 */
let container;
let animationRef;

/**
 * Setup and Rotation 
 */
const init = function(){
	// Create the camera
	camera = new THREE.PerspectiveCamera( FOV, width/height, NEAR, FAR );
	camera.position.set( 1800, 300, 1200 )
	camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
	
	// Create the scene and add the camera
	scene = new THREE.Scene();
	scene.add( camera );

	addLights();
	
	drawGlobe();
	
	// Create the renderer and add it to the DOM
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( width, height );
	container.appendChild( renderer.domElement );	
}

const addLights = function(){
	let light = new THREE.AmbientLight( 0xFEFEFE );
	scene.add( light )
}

const drawGlobe = function(){
	let globeGeom = new THREE.SphereGeometry( 400, 50, 50 );
	let globeTexture = new THREE.ImageUtils.loadTexture( "/world-old.jpg")
	let globeMaterial = new THREE.MeshPhongMaterial(
		{
			map: globeTexture,
			shininess: 0.2
		}
	);

	globe = new THREE.Mesh( globeGeom, globeMaterial );
	scene.add( globe )
}

const animate = function(){
	animationRef = window.requestAnimationFrame( animate );

	var timer = Date.now() * 0.0001;
    camera.position.x = (Math.cos( timer ) *  1600);
    camera.position.z = (Math.sin( timer ) *  1600) ;
    camera.lookAt( scene.position );

	renderer.render( scene, camera );
}

onMount( () => {
	init();
	animate();
} )

onDestroy( () => {
	window.cancelAnimationFrame( animationRef );
})

</script>

<style>

</style>

<div class="shnt-globe-3d" bind:this={ container }>

</div>