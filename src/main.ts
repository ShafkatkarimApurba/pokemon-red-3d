import * as THREE from 'three';
import { PlayerController } from './core/PlayerController';
import { CameraController } from './core/CameraController';
import { Tree } from './entities/Tree';
import { EncounterSystem } from './systems/EncounterSystem';
import { UIManager } from './ui/UIManager';

// === Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// === Player ===
const playerGeometry = new THREE.BoxGeometry(1, 1.8, 1);
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x3b82f6 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.9;
scene.add(player);

// === Player Controller ===
const playerController = new PlayerController();

// === Ground with BVH Collision ===
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4ade80 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

playerController.setCollider(ground);

// === Add some trees ===
const treePositions = [
  { x: -8, z: -6 },
  { x: 7, z: -8 },
  { x: -12, z: 4 },
  { x: 10, z: 6 },
  { x: -5, z: 10 },
];

treePositions.forEach(pos => {
  const tree = new Tree();
  tree.position.set(pos.x, 0, pos.z);
  scene.add(tree);
});

// === Add grass encounter area ===
const grassGeometry = new THREE.PlaneGeometry(12, 12);
const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x22c55e });
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2;
grass.position.set(-5, 0.01, -3);
scene.add(grass);

// === Encounter System ===
const encounterSystem = new EncounterSystem();
encounterSystem.addGrassArea(grass);

// === Camera Controller ===
const cameraController = new CameraController(camera, player);

// === Clock ===
const clock = new THREE.Clock();

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Update player movement + collision
  playerController.update(delta, player);

  // Update camera
  cameraController.update();

  // Check for wild encounters (and show UI message)
  // Note: We override the console log behavior temporarily for demo
  if (Math.random() < 0.01 && grass.position.distanceTo(player.position) < 8) {
    // Trigger visual encounter message occasionally in grass
    const ui = new UIManager();
    ui.showEncounterMessage();
  }

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('%c[Pokémon Red 3D] UI + Encounter feedback ready.', 'color: #4ade80');