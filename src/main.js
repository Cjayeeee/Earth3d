import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

const light = new THREE.DirectionalLight("white", 3);

scene.add(light);
light.position.set(1, 1, 1);

let textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load("./public/earth8k.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

let texture2 = textureLoader.load("./public/clouds.jpg");
texture2.colorSpace = THREE.SRGBColorSpace;

camera.position.z = 2;

const geometry = new THREE.SphereGeometry(1, 250, 250);
const material = new THREE.MeshPhysicalMaterial({
  map: texture,
  roughness: 0.7,
});

const geometry2 = new THREE.SphereGeometry(1.0001, 250, 250);
const material2 = new THREE.MeshPhysicalMaterial({ alphaMap: texture2 });

material2.transparent = true;

const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry2, material2);

scene.add(mesh);
scene.add(mesh2);

let hdri = new RGBELoader();
hdri.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/flamingo_pan_2k.hdr",
  function (hdritext) {
    hdritext.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdritext;
  },
);

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({ canvas: canvas });

renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

let clock = new THREE.Clock();

function animate() {
  window.requestAnimationFrame(animate);
  // mesh.rotation.y = clock.getElapsedTime();
  mesh.rotation.y += 0.0002;
  mesh2.rotation.y += 0.0003;
  controls.update();
  renderer.render(scene, camera);
  // console.log(clock.getElapsedTime());
}

animate();
