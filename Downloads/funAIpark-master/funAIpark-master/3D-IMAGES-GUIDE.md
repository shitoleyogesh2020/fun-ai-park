# 3D Images Guide

## Overview
This guide covers implementing 3D images and graphics in web applications using modern web technologies.

## Technologies

### Three.js
- **Purpose**: 3D graphics library for WebGL
- **Installation**: `npm install three`
- **Basic Setup**:
```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

### CSS 3D Transforms
- **transform-style**: `preserve-3d`
- **perspective**: Creates 3D viewing context
- **rotateX/Y/Z**: 3D rotations
- **translateZ**: Depth positioning

## Image Formats

### Supported Formats
- **JPEG/PNG**: Standard 2D textures
- **HDR**: High dynamic range environments
- **EXR**: Professional 3D textures
- **GLTF/GLB**: 3D model formats with textures

### Optimization
- Use compressed textures (DXT, ASTC)
- Power-of-2 dimensions (256x256, 512x512, 1024x1024)
- Mipmaps for distant objects
- Texture atlasing for multiple materials

## Implementation Patterns

### Basic 3D Scene
```javascript
// Geometry + Material + Mesh
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
```

### Texture Loading
```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('path/to/image.jpg');
const material = new THREE.MeshBasicMaterial({ map: texture });
```

### CSS 3D Card Flip
```css
.card {
    width: 200px;
    height: 300px;
    perspective: 1000px;
}

.card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
}

.card:hover .card-inner {
    transform: rotateY(180deg);
}
```

## Performance Tips

### Optimization
- Use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- Implement frustum culling
- Use LOD (Level of Detail) for distant objects
- Dispose of unused geometries and materials

### Memory Management
```javascript
// Clean up resources
geometry.dispose();
material.dispose();
texture.dispose();
renderer.dispose();
```

## 3D Images for Web Design & UI

### Hero Sections
- **Floating Elements**: Cards, icons, or text with subtle Z-axis movement
  - Download: [Floating 3D Icons](https://www.flaticon.com/packs/3d-casual)
  - Source: [3D Hero Backgrounds](https://unsplash.com/s/photos/3d-abstract)
- **Layered Backgrounds**: Multiple image planes at different depths
  - Download: [Geometric 3D Shapes](https://www.pexels.com/search/3d%20geometric/)
  - Source: [Abstract 3D Layers](https://pixabay.com/images/search/3d%20abstract/)
- **Isometric Illustrations**: Clean, modern 3D-style graphics
  - Download: [Isometric Icons Pack](https://iconscout.com/3d-illustrations)
  - Source: [3D Isometric Objects](https://www.freepik.com/vectors/isometric)

### Navigation & Menus
- **3D Buttons**: Raised/pressed states with shadows and depth
  - Download: [3D UI Elements](https://ui8.net/category/3d)
  - Source: [Button 3D Models](https://sketchfab.com/search?q=ui+button&type=models)
- **Rotating Icons**: Smooth transitions on hover/click
  - Download: [Animated 3D Icons](https://lottiefiles.com/featured/3d)
  - Source: [Icon 3D Pack](https://www.iconfinder.com/iconsets/3d-icons)
- **Sliding Panels**: Cards that slide in 3D space
  - Download: [3D Card Templates](https://www.figma.com/community/search?q=3d%20cards)

### Content Presentation
- **Product Showcases**: 360° rotatable product images
  - Download: [Product 3D Models](https://free3d.com/3d-models/product)
  - Source: [360° Product Views](https://www.turbosquid.com/Search/3D-Models/free/product)
- **Portfolio Grids**: Tilting cards with depth on hover
  - Download: [Portfolio 3D Mockups](https://mockupworld.co/free/category/3d/)
  - Source: [3D Card Designs](https://dribbble.com/tags/3d_cards)
- **Timeline Elements**: 3D stepping stones or floating milestones
  - Download: [Timeline 3D Assets](https://www.vecteezy.com/vector-art/timeline-3d)
  - Source: [Milestone 3D Icons](https://www.flaticon.com/packs/3d-business)

### UI Enhancement Patterns
```css
/* Subtle depth for cards */
.card-3d {
  transform: translateZ(0);
  transition: transform 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card-3d:hover {
  transform: translateZ(10px) rotateX(5deg);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotateZ(0deg); }
  50% { transform: translateY(-10px) rotateZ(2deg); }
}
```

### Design Principles
- **Subtle Motion**: Avoid overwhelming animations
- **Consistent Lighting**: Maintain uniform shadow directions
- **Performance First**: Use CSS transforms over JavaScript when possible
- **Accessibility**: Respect `prefers-reduced-motion`

### Popular 3D UI Elements
- **Neumorphism**: Soft, extruded button styles
  - Download: [Neumorphic 3D Elements](https://neumorphism.io/)
  - Source: [Soft UI 3D Pack](https://www.figma.com/community/search?q=neumorphism)
- **Glassmorphism**: Translucent layers with depth
  - Download: [Glass 3D Effects](https://glassmorphism.com/)
  - Source: [Transparent 3D Assets](https://www.behance.net/search/projects?search=glassmorphism)
- **Isometric Cards**: Angled perspective for modern look
  - Download: [Isometric UI Kit](https://www.sketch.com/s/3d-isometric)
  - Source: [3D Card Collection](https://codepen.io/search/pens?q=3d%20cards)
- **Floating Action Buttons**: Elevated circular buttons
  - Download: [3D FAB Icons](https://material.io/design/components/buttons-floating-action-button.html)
  - Source: [Floating 3D Buttons](https://cssbuttons.io/)
- **Parallax Scrolling**: Background/foreground depth separation
  - Download: [Parallax 3D Layers](https://www.pexels.com/search/parallax/)
  - Source: [3D Scroll Effects](https://codepen.io/search/pens?q=parallax%203d)

## Free 3D Asset Libraries

### General 3D Resources
- **Sketchfab**: Free 3D models and textures
- **Poly Haven**: High-quality HDRIs and 3D assets
- **Mixamo**: 3D character animations
- **Kenney Assets**: Game-ready 3D models
- **Quaternius**: Low-poly 3D models

### UI-Specific 3D Assets
- **Spline**: Browser-based 3D design tool with free assets
- **Blender Market**: Free 3D UI elements
- **Figma Community**: 3D mockups and UI kits
- **Dribbble**: 3D design inspiration and freebies
- **Behance**: Professional 3D UI showcases

## Common Use Cases

### Image Galleries
- 3D carousel/slideshow
- Parallax scrolling effects
- Interactive product viewers

### Backgrounds
- Particle systems
- Animated geometric shapes
- Environment mapping

### Interactive Elements
- Hover effects with 3D transforms
- Click-to-rotate objects
- Zoom and pan controls

## Browser Support
- **WebGL**: Modern browsers (IE11+)
- **CSS 3D**: All modern browsers
- **WebGL2**: Chrome 56+, Firefox 51+

## File Structure
```
images/
├── 3d/
│   ├── textures/
│   ├── models/
│   └── environments/
├── backgrounds/
└── icons/
```

## Quick Start Checklist
1. Choose technology (Three.js vs CSS 3D)
2. **Run Python script**: `python download_3d_assets.py` to get free assets
3. Optimize image assets
4. Set up basic scene/container
5. Add lighting (for Three.js)
6. Implement controls/interactions
7. Test performance across devices

## Automated Asset Download

Use the included Python script to download free 3D assets:

```bash
# Install dependencies
pip install -r requirements.txt

# Download 3D assets
python download_3d_assets.py
```

Script downloads:
- Hero section 3D elements
- Navigation 3D buttons
- Content showcase assets
- UI elements (glass, floating)
- Background textures
- 3D icons and symbols

All assets are organized in `images/3d/` with subfolders by category.