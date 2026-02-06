import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.z = 2;

const ambientLight = new THREE.AmbientLight("white", 1.2);
scene.add(ambientLight);




//light.position.set(1, 1, 1);
//scene.add(light);

const textureLoader = new THREE.TextureLoader();

const texture = textureLoader.load("/earth8k.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

const texture2 = textureLoader.load("/clouds.jpg");
texture2.colorSpace = THREE.SRGBColorSpace;

const geometry = new THREE.SphereGeometry(1, 250, 250);
const material = new THREE.MeshPhysicalMaterial({
  map: texture,
  roughness: 0.7
});

const geometry2 = new THREE.SphereGeometry(1.0001, 250, 250);
const material2 = new THREE.MeshPhysicalMaterial({
  alphaMap: texture2,
  transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry2, material2);

scene.add(mesh);
scene.add(mesh2);

const hdri = new RGBELoader();
hdri.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/flamingo_pan_2k.hdr",
  (hdritext) => {
    hdritext.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdritext;
  }
);

const canvas = document.querySelector("canvas");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);

  mesh.rotation.y += 0.0002;
  mesh2.rotation.y += 0.0003;

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
