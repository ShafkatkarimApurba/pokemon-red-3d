import * as THREE from 'three';
import { PlayerController } from './core/PlayerController';
import { CameraController } from './core/CameraController';
import { Tree } from './entities/Tree';
import { EncounterSystem } from './systems/EncounterSystem';
import { UIManager } from './ui/UIManager';
import { PlayerCharacter } from './entities/PlayerCharacter';
import { Path } from './entities/Path';
import { House } from './entities/House';
import { BattleScene } from './scenes/BattleScene';

// === Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(15, 30, 15);
directionalLight.castShadow = true;
scene.add(directionalLight);

// === Player Character ===
const player = new PlayerCharacter();
player.position.y = 0;
scene.add(player);

// === Player Controller ===
const playerController = new PlayerController();

// === Ground with BVH Collision ===
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4ade80 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

playerController.setCollider(ground);

// === Add paths ===
const mainPath = new Path(3, 30);
mainPath.position.set(0, 0.02, 0);
scene.add(mainPath);

// === Add a house ===
const house = new House();
house.position.set(12, 0, -8);
scene.add(house);

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

// === Encounter System + UI ===
const encounterSystem = new EncounterSystem();
encounterSystem.addGrassArea(grass);

const uiManager = new UIManager();

// === Camera Controller ===
const cameraController = new CameraController(camera, player);

// === Battle Scene (initialized but not active yet) ===
const battleScene = new BattleScene();

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

  // Check for wild encounters (visual feedback)
  if (Math.random() < 0.01 && grass.position.distanceTo(player.position) < 8) {
    uiManager.showEncounterMessage();
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

console.log('%c[Pokémon Red 3D] BattleScene structure initialized.', 'color: #4ade80');