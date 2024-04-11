// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Track mouse position
const mouse = new THREE.Vector2(); let INTERSECTED;
document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Particle setup
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.05,
    vertexColors: true // Allow each vertex to have a different color
});

// Populate geometry with particles
const colors = [];
for (let i = 0; i < 1000; i++) {
    const vertex = new THREE.Vector3();
    vertex.x = Math.random() * 10 - 5;
    vertex.y = Math.random() * 10 - 5;
    vertex.z = Math.random() * 10 - 5;
    geometry.vertices.push(vertex);
    
    // Color gradient from center
    const color = new THREE.Color(0xffffff);
    color.setHSL(0.6 - (vertex.length() / 5) * 0.5, 1.0, 0.6);
    colors.push(color);
}
geometry.colors = colors;

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Camera position
camera.position.z = 10;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Attract particles to the mouse
    geometry.vertices.forEach(function (vertex, i) {
        const direction = new THREE.Vector3(mouse.x, mouse.y, 0).sub(vertex);
        direction.multiplyScalar(0.05);
        vertex.add(direction);

        // Update colors based on position
        const color = new THREE.Color(0xffffff);
        color.setHSL(0.6 - (vertex.length() / 5) * 0.5, 1.0, 0.5 + Math.random() * 0.5);
        geometry.colors[i] = color;
    });
    geometry.colorsNeedUpdate = true; // Important to update colors in render
    particles.rotation.x += 0.005;
    particles.rotation.y += 0.005;
    renderer.render(scene, camera);
}

animate();
