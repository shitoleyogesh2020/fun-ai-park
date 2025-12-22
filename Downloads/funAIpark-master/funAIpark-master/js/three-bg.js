// 3D Background Animation
class ThreeBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('bg-canvas'),
            alpha: true,
            antialias: true
        });
        
        this.init();
        this.createGeometry();
        this.animate();
        this.handleResize();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 5;
        
        // Add subtle lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }
    
    createGeometry() {
        this.geometries = [];
        
        // Create floating geometric shapes
        const shapes = [
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.ConeGeometry(0.3, 0.6, 8),
            new THREE.OctahedronGeometry(0.4),
            new THREE.TetrahedronGeometry(0.4)
        ];
        
        const materials = [
            new THREE.MeshLambertMaterial({ color: 0x6366f1, transparent: true, opacity: 0.6 }),
            new THREE.MeshLambertMaterial({ color: 0xec4899, transparent: true, opacity: 0.6 }),
            new THREE.MeshLambertMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.6 }),
            new THREE.MeshLambertMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 }),
            new THREE.MeshLambertMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 })
        ];
        
        // Create multiple floating objects
        for (let i = 0; i < 15; i++) {
            const geometry = shapes[Math.floor(Math.random() * shapes.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random positioning
            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 10;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            // Store animation properties
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatRange: Math.random() * 2 + 1,
                initialY: mesh.position.y
            };
            
            this.geometries.push(mesh);
            this.scene.add(mesh);
        }
        
        // Create particle system
        this.createParticles();
    }
    
    createParticles() {
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 50;     // x
            positions[i + 1] = (Math.random() - 0.5) * 50; // y
            positions[i + 2] = (Math.random() - 0.5) * 20; // z
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animate geometric shapes
        this.geometries.forEach((mesh) => {
            // Rotation
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
            
            // Floating motion
            mesh.position.y = mesh.userData.initialY + 
                Math.sin(time * mesh.userData.floatSpeed) * mesh.userData.floatRange;
        });
        
        // Animate particles
        if (this.particles) {
            this.particles.rotation.y += 0.001;
            this.particles.rotation.x += 0.0005;
        }
        
        // Camera movement based on mouse (if mouse tracking is enabled)
        if (this.mouseX !== undefined && this.mouseY !== undefined) {
            this.camera.position.x += (this.mouseX * 0.001 - this.camera.position.x) * 0.05;
            this.camera.position.y += (-this.mouseY * 0.001 - this.camera.position.y) * 0.05;
            this.camera.lookAt(this.scene.position);
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    enableMouseTracking() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - window.innerWidth / 2;
            this.mouseY = event.clientY - window.innerHeight / 2;
        });
    }
}

// Initialize 3D background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const bg = new ThreeBackground();
        bg.enableMouseTracking();
    } catch (error) {
        console.log('3D background not supported on this device');
        // Fallback: hide canvas and show gradient background
        const canvas = document.getElementById('bg-canvas');
        if (canvas) {
            canvas.style.display = 'none';
        }
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.body.style.backgroundAttachment = 'fixed';
    }
});