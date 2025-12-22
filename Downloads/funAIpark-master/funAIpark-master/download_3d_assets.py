#!/usr/bin/env python3
import requests
import os
from pathlib import Path
import time

def create_folders():
    """Create folder structure for 3D assets"""
    folders = [
        'images/3d/hero',
        'images/3d/navigation', 
        'images/3d/content',
        'images/3d/ui-elements',
        'images/3d/backgrounds',
        'images/3d/icons'
    ]
    for folder in folders:
        Path(folder).mkdir(parents=True, exist_ok=True)
    print("Folders created")

def download_image(url, filepath):
    """Download image from URL"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filepath}")
        return True
    except Exception as e:
        print(f"Failed: {filepath} - {e}")
        return False

def download_3d_assets():
    """Download free 3D assets from various sources"""
    
    # Free direct download URLs (sample assets)
    assets = {
        # Hero Section Assets
        'images/3d/hero/floating-cube.png': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        'images/3d/hero/abstract-sphere.jpg': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
        'images/3d/hero/geometric-bg.jpg': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400',
        
        # Navigation Assets  
        'images/3d/navigation/3d-button.png': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        'images/3d/navigation/menu-icon.png': 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400',
        
        # Content Assets
        'images/3d/content/product-showcase.jpg': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        'images/3d/content/portfolio-card.png': 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=400',
        
        # UI Elements
        'images/3d/ui-elements/glass-card.png': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400',
        'images/3d/ui-elements/floating-button.png': 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400',
        
        # Backgrounds
        'images/3d/backgrounds/particle-bg.jpg': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        'images/3d/backgrounds/gradient-mesh.jpg': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        
        # Icons
        'images/3d/icons/3d-star.png': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200',
        'images/3d/icons/3d-heart.png': 'https://images.unsplash.com/photo-1618556450991-2f1af64e8191?w=200'
    }
    
    print("Starting 3D asset downloads...")
    
    success_count = 0
    total_count = len(assets)
    
    for filepath, url in assets.items():
        if download_image(url, filepath):
            success_count += 1
        time.sleep(0.5)  # Rate limiting
    
    print(f"\nDownload Summary:")
    print(f"Success: {success_count}/{total_count}")
    print(f"Failed: {total_count - success_count}/{total_count}")

def create_readme():
    """Create README for downloaded assets"""
    readme_content = """# 3D Assets Collection

## Folder Structure
- `hero/` - Hero section 3D elements
- `navigation/` - 3D buttons and menu items  
- `content/` - Product showcases and cards
- `ui-elements/` - Glass effects and floating buttons
- `backgrounds/` - 3D backgrounds and textures
- `icons/` - 3D icons and symbols

## Usage
All images are optimized for web use and ready for Three.js or CSS 3D transforms.

## Sources
- Unsplash (Free license)
- Sample 3D renders for demonstration

## License
Free for commercial and personal use.
"""
    
    with open('images/3d/README.md', 'w') as f:
        f.write(readme_content)
    print("README created")

if __name__ == "__main__":
    print("3D Asset Downloader")
    print("=" * 30)
    
    create_folders()
    download_3d_assets()
    create_readme()
    
    print("\nDownload complete! Check images/3d/ folder")
    print("Tip: Replace sample URLs with actual asset URLs from the guide")