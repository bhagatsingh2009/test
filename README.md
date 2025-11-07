# 3D Face Scene Generator

Generate immersive 3D scenes with your face from photos using AI-powered scene generation and Three.js!

## Features

- **Upload Your Photo**: Upload any photo and it will be mapped onto a 3D face model
- **Text-to-Scene Generation**: Describe a scene in natural language and watch it come to life
- **Interactive 3D Viewer**: Explore your generated scene with mouse controls (rotate, zoom, pan)
- **Smart Scene Understanding**: AI parses your prompts to create appropriate environments, lighting, and objects
- **Multiple Environments**: Forest, city, space, ocean, desert, mountain, abstract, and more
- **Dynamic Lighting**: Bright, dark, neon, warm, cool lighting based on your description
- **Atmospheric Effects**: Fog, particles, glow effects
- **Various Objects**: Trees, rocks, buildings, geometric shapes, crystals

## Demo

Upload your photo and try prompts like:
- "Place me in a futuristic cyberpunk city with neon lights"
- "Put me in a peaceful forest with sunlight filtering through trees"
- "Place me in space surrounded by stars and nebulae"
- "Put me in a desert at sunset with warm golden light"

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Upload Your Photo**: Click the file input and select a photo of yourself
2. **Describe Your Scene**: Enter a text description of the scene you want
3. **Generate**: Click "Generate 3D Scene" and wait for your scene to render
4. **Interact**: Use your mouse to rotate, zoom, and explore the 3D scene
5. **Download**: Save a screenshot of your scene

## Technology Stack

- **Three.js**: 3D rendering and WebGL
- **Vite**: Fast build tool and dev server
- **JavaScript ES6+**: Modern JavaScript features
- **CSS3**: Responsive styling with gradients and animations

## How It Works

1. **Image Processing**: The uploaded photo is loaded as a texture
2. **3D Face Model**: A procedural 3D head geometry is created and textured with your photo
3. **Prompt Parsing**: Your text prompt is analyzed to extract:
   - Environment type (forest, city, space, etc.)
   - Lighting conditions (bright, dark, neon, etc.)
   - Atmospheric effects (fog, particles, glow)
   - Objects to include (trees, buildings, geometric shapes)
   - Color scheme and mood
4. **Scene Generation**: A Three.js scene is procedurally generated based on parsed parameters
5. **Rendering**: The scene is rendered in real-time with interactive camera controls

## Project Structure

```
.
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── main.js             # Application entry point
│   ├── faceModel.js        # 3D face model creation
│   ├── promptParser.js     # AI prompt parsing
│   ├── sceneGenerator.js   # Three.js scene generation
│   └── style.css           # Styling
├── package.json
├── vite.config.js
└── README.md
```

## Browser Support

Works in all modern browsers with WebGL support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

- Integration with advanced 3D face reconstruction (MediaPipe, Deep3DFaceRecon)
- Facial animation using NVIDIA Audio2Face
- Text-to-speech integration for animated avatars
- More sophisticated scene elements
- Export to GLTF/GLB format
- VR/AR support

## License

ISC

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
