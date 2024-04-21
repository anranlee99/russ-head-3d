import * as THREE from 'three'
import { OrbitControls, STLLoader } from 'three/addons'


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2
const DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(DirectionalLight);

const SpotLight = new THREE.SpotLight(0xffffff, 1); 
SpotLight.position.set(15, 15, 15);
scene.add(SpotLight);

const AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(AmbientLight);


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)


const loader = new STLLoader();
let russ: THREE.Mesh;
loader.load('models/russ.stl', function (geometry) {
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

  // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(0.1, 0.1, 0.1);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);
  russ = mesh;

  const btn = document.createElement('button');
  btn.innerHTML = "Stop Rotation";
  const app = document.getElementById('app') as HTMLElement;
  app.appendChild(btn);

  btn.onclick = function () {
    userRotate = !userRotate;
    btn.innerHTML = userRotate ? "Stop Rotation" : "Start Rotation";
  }

}, undefined, function (error) { console.error(error) });

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth*0.5 / window.innerHeight*0.5
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth*0.5, window.innerHeight*0.5)
  render()
}

let userRotate = true;
function animate() {
  requestAnimationFrame(animate)

  // russ.rotation.x += 0.01
  // russ.rotation.y += 0.01
  if (userRotate && russ)
    russ.rotation.z += 0.01




  controls.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}
animate()


