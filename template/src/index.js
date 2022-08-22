import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module';

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

let canvasSz = new THREE.Vector2(window.innerWidth, window.innerHeight);
let cameraZ = -10;

let mouse = new THREE.Vector2(0,0);

var width, height, canvasCubeSize;
if (window.innerHeight >= window.innerWidth) {
    var width = window.innerWidth;
    var height = window.innerWidth;
    canvasCubeSize = height * 0.6;
} else {
    var width = window.innerHeight;
    var height = window.innerHeight;
    canvasCubeSize = width * 0.6;
}

var clock = new THREE.Clock();
var controls;

var camera, scene, renderer;
var boundCube_geom, boundCube_mat, boundCube_mesh;
var circle;

function init() {

    // create scene
    scene = new THREE.Scene();

    //create boundary box
    boundCube_geom = new THREE.BoxGeometry(canvasCubeSize, canvasCubeSize, canvasCubeSize);
    boundCube_mat = new THREE.MeshBasicMaterial({
        wireframe: true,
        // opacity: 0.5,
        color: 0xffffff
    });
    // boundCube_mat.visible = false;
    boundCube_mesh = new THREE.Mesh(boundCube_geom, boundCube_mat);
    scene.add(boundCube_mesh);

    //create circle at cursor
    const geometry = new THREE.CircleGeometry( 100, 60 );
    const material = new THREE.MeshBasicMaterial( { 
        color: 0xff0000,
        side: THREE.DoubleSide } );
    circle = new THREE.Mesh( geometry, material );
    circle.position.set(0,0,0);
    scene.add( circle );

    //create camera
    camera = new THREE.OrthographicCamera(-canvasSz.x/2, canvasSz.x/2, canvasSz.y/2, -canvasSz.y/2, 0, 1000);
    camera.position.set(0, 0, cameraZ);
    camera.lookAt(0,0,0);

    //create a webGL renderer
    renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    renderer.setSize(canvasSz.x, canvasSz.y);
    renderer.setClearColor(0x0000ff);
    document.body.appendChild(renderer.domElement);

    // CONTROLS
    controls = new OrbitControls( camera, renderer.domElement );
}

function animate() {
    stats.begin();
    requestAnimationFrame(animate);
    var time = performance.now() * 0.001;
    render();
    stats.end();
}

function render() {
    renderer.render(scene, camera);
}

init();
animate();

window.addEventListener('resize', function(event) {
    if (window.innerHeight >= window.innerWidth) {
        width = window.innerWidth;
        height = window.innerWidth;
        canvasCubeSize = height * 0.6;
    } else {
        width = window.innerHeight;
        height = window.innerHeight;
        canvasCubeSize = width * 0.6;
    }

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    let mappedMousePos = new THREE.Vector2(
        map(mouse.x, -1, 1, -canvasSz.x/2, canvasSz.x/2),
        map(mouse.y, -1, 1, -canvasSz.y/2, canvasSz.y/2),
    );

    circle.position.set(mappedMousePos);
}

function map( value, min1, max1, min2, max2)
{
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}