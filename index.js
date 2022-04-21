import * as THREE from 'https://unpkg.com/three@0.139.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.139.2/examples/jsm/controls/OrbitControls.js';
import * as gsap from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.3/gsap.min.js';

//create a scene, camera, and renderer
const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement); //inject canvas element

//need a geometry: data relating to all of the object's vertices that connects into a shape
//need a material that fills in the wireframe of the geometry

new OrbitControls(camera, renderer.domElement);
camera.position.z = 50 //move the box backwards so we can see the scene

const planeGeometry = new THREE.PlaneGeometry(400, 400, 50, 50);
const planeMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh); //adds items to scene

//vertice position randomization
const { array } = planeMesh.geometry.attributes.position;
const randomValues = [];
for (let i = 0; i < array.length; i++) {
    if (i % 3 == 0) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];

        array[i] = x + (Math.random() - 0.5) * 3;
        array[i + 1] = y + (Math.random() - 0.5) * 3;
        array[i + 2] = z + (Math.random() - 0.5) * 3;
    }


    randomValues.push(Math.random() - 0.5);
}

planeMesh.geometry.attributes.position.randomValues = randomValues;
planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;


const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
    x: undefined,
    y: undefined
}

let frame = 0;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    frame += 0.01;
    const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        //x
        array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.03;
        //y
        array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.03;
    }



    planeMesh.geometry.attributes.position.needsUpdate = true;

    const intersects = raycaster.intersectObject(planeMesh);
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes;
        //vertice 1
        color.setX(intersects[0].face.a, 0.1);
        color.setY(intersects[0].face.a, 0.5);
        color.setZ(intersects[0].face.a, 1);

        //vertice 2
        color.setX(intersects[0].face.b, 0.1);
        color.setY(intersects[0].face.b, 0.5);
        color.setZ(intersects[0].face.b, 1);

        //vertice 3
        color.setX(intersects[0].face.c, 0.1);
        color.setY(intersects[0].face.c, 0.5);
        color.setZ(intersects[0].face.c, 1);

        color.needsUpdate = true;

        const initialColor = {
            r: 0,
            g: 0.19,
            b: 0.4
        }
        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }

        gsap.to(hoverColor, {
            r: initialColor.r,
            b: initialColor.b,
            g: initialColor.g,
            onUpdate: () => {
                //vertice 1
                color.setX(intersects[0].face.a, hoverColor.r);
                color.setY(intersects[0].face.a, hoverColor.g);
                color.setZ(intersects[0].face.a, hoverColor.b);

                //vertice 2
                color.setX(intersects[0].face.b, hoverColor.r);
                color.setY(intersects[0].face.b, hoverColor.g);
                color.setZ(intersects[0].face.b, hoverColor.b);

                //vertice 3
                color.setX(intersects[0].face.c, hoverColor.r);
                color.setY(intersects[0].face.c, hoverColor.g);
                color.setZ(intersects[0].face.c, hoverColor.b);
            }
        })

    }
}

//renders scene

animate();

addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
})