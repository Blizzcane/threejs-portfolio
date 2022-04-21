import * as THREE from 'https://unpkg.com/three@0.139.2/build/three.module.js'

//create a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement); //inject canvas element

//need a geometry: data relating to all of the object's vertices that connects into a shape
//need a material that fills in the wireframe of the geometry

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const mesh = new THREE.Mesh(boxGeometry, material);

scene.add(mesh); //adds items to scene

camera.position.z = 5 //move the box backwards so we can see the scene

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01
}

//renders scene

animate();

