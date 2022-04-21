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

camera.position.z = 5 //move the box backwards so we can see the scene

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000, side: THREE.DoubleSide, flatShading: THREE.FlatShading});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh); //adds items to scene

const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

//renders scene

animate();

