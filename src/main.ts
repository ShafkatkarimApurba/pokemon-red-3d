import * as THREE from 'three';
import { PlayerController } from './core/PlayerController';

// === Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Basic lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// === Player ===
const playerGeometry = new THREE.BoxGeometry(1, 1.8, 1);
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0x3b82f6 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.9; // stand on ground
scene.add(player);

// === Player Controller ===
const playerController = new PlayerController();

// === Camera ===
camera.position.set(0, 8, 12);
camera.lookAt(player.position);

// === Ground (Temporary) ===
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4ade80 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// === Clock for delta time ===
const clock = new THREE.Clock();

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // Update player movement
  playerController.update(delta, player);

  // Simple camera follow (will be improved later)
  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 12;
  camera.lookAt(player.position.x, player.position.y + 2, player.position.z);

  renderer.render(scene, camera);
}

animate();

// === Resize Handler ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('%c[Pokémon Red 3D] Player Controller initialized. Use WASD or Arrow Keys to move.', 'color: #4ade80');