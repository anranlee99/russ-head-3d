import * as THREE from 'three'
import { OrbitControls, STLLoader } from 'three/addons'


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6; 
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


const cube_geometry = new THREE.BoxGeometry();
const cube_material = new THREE.MeshLambertMaterial({
  color: 0x00beef,
});



const cube = new THREE.Mesh(cube_geometry, cube_material);
cube.position.set(2, 0, 0);
scene.add(cube);


const vertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vPosition;
    uniform vec3 color1;
    uniform vec3 color2;

    void main() {
        float mixFactor = (vPosition.y + 1.0) / 2.0;
        gl_FragColor = vec4(mix(color1, color2, mixFactor), 1.0);
    }
`;

const sphere_material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
        color1: { value: new THREE.Color(0xff0000) }, // Red
        color2: { value: new THREE.Color(0x0000ff) }  // Blue
    }
});
const sphere_geometry = new THREE.SphereGeometry(0.5, 32, 32);

const sphere = new THREE.Mesh(sphere_geometry, sphere_material);
scene.add(sphere);

sphere.position.set(-2, 0, 0);


scene.fog = new THREE.Fog(0x3f7b9d, 1, 10);
const tetrahedron_geometry = new THREE.TetrahedronGeometry();
const tetrahedron_material = new THREE.MeshNormalMaterial();

const tetrahedron = new THREE.Mesh(tetrahedron_geometry, tetrahedron_material);
scene.add(tetrahedron);
tetrahedron.position.set(0, 0, 2);


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
  camera.aspect = window.innerWidth * 0.5 / window.innerHeight * 0.5
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth * 0.5, window.innerHeight * 0.5)
  render()
}

let userRotate = true;
const russList: THREE.Mesh[] = [];
function addRuss(){
  const mesh = russ.clone();
  const offset = 2 + russList.length * 2
  mesh.position.set(Math.random() < 0.5 ? offset : 0, Math.random() < 0.5 ? offset: 0, Math.random() < 0.5 ? offset: 0);
  scene.add(mesh);
  russList.push(mesh);
}

const addBtn = document.createElement('button');
addBtn.innerHTML = "MORE RUSS";
const app = document.getElementById('app') as HTMLElement;
app.appendChild(addBtn);

addBtn.onclick = function () {
  addRuss();
}
function animate() {
  requestAnimationFrame(animate)

  // russ.rotation.x += 0.01
  // russ.rotation.y += 0.01
  if (userRotate && russ)
    russ.rotation.z += 0.01

  if (cube) {
    //have it rotate about (0,0,0)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.position.x = 2 * Math.cos(Date.now() * 0.001);
    cube.position.y = 2 * Math.sin(Date.now() * 0.001);
  }

  if (sphere) {
    sphere.position.x = -2 * Math.cos(Date.now() * 0.001);
    sphere.position.y = -2 * Math.sin(Date.now() * 0.001);
  }

  if(tetrahedron){

    //have it rotate in an ellpse on the xz plane
    tetrahedron.rotation.x += 0.05;
    tetrahedron.position.x = 2 * Math.cos(Date.now() * 0.001);
    tetrahedron.position.z = 4 * Math.sin(Date.now() * 0.001); 
  }

  if(russList.length){
    russList.forEach((russ, index) => {
      russ.rotation.z += Math.cos(Date.now() * 0.001 + index);
      russ.position.x = 2 * Math.cos(Date.now() * 0.001 + index);
      russ.position.y = 2 * Math.sin(Date.now() * 0.001 + index);
    });
  }




  controls.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}
animate()


