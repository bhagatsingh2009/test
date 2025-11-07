import './style.css';
import { FaceModel } from './faceModel.js';
import { PromptParser } from './promptParser.js';
import { SceneGenerator } from './sceneGenerator.js';

/**
 * Main Application Class
 */
class App {
    constructor() {
        this.uploadedImage = null;
        this.imageUrl = null;
        this.sceneGenerator = null;

        this.initializeUI();
    }

    /**
     * Initialize UI event listeners
     */
    initializeUI() {
        // Image upload
        const imageUpload = document.getElementById('imageUpload');
        imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));

        // Generate button
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.addEventListener('click', () => this.generateScene());

        // Control buttons
        const resetCamera = document.getElementById('resetCamera');
        resetCamera.addEventListener('click', () => this.resetCamera());

        const downloadScene = document.getElementById('downloadScene');
        downloadScene.addEventListener('click', () => this.downloadScene());
    }

    /**
     * Handle image upload
     */
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please upload a valid image file');
            return;
        }

        // Create object URL for the image
        this.imageUrl = URL.createObjectURL(file);
        this.uploadedImage = file;

        // Show preview
        this.showImagePreview(this.imageUrl);

        // Hide error if any
        this.hideError();
    }

    /**
     * Show image preview
     */
    showImagePreview(imageUrl) {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = '';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Uploaded face';
        preview.appendChild(img);
    }

    /**
     * Generate the 3D scene
     */
    async generateScene() {
        // Validate inputs
        if (!this.uploadedImage) {
            this.showError('Please upload an image first');
            return;
        }

        const prompt = document.getElementById('scenePrompt').value.trim();
        if (!prompt) {
            this.showError('Please enter a scene description');
            return;
        }

        try {
            // Show loading
            this.showLoading(true);
            this.hideError();

            // Parse the prompt
            const parser = new PromptParser(prompt);
            const config = parser.getConfig();

            console.log('Scene configuration:', config);

            // Get canvas
            const canvas = document.getElementById('sceneCanvas');

            // Cleanup previous scene if exists
            if (this.sceneGenerator) {
                this.sceneGenerator.dispose();
            }

            // Create scene generator
            this.sceneGenerator = new SceneGenerator(canvas, config);
            this.sceneGenerator.init();

            // Create face model
            const faceModel = new FaceModel(this.imageUrl);
            const faceMesh = await faceModel.create();

            // Add face model to scene
            this.sceneGenerator.addFaceModel(faceMesh);

            // Start animation
            this.sceneGenerator.animate();

            // Show canvas container
            this.showLoading(false);
            this.showCanvas(true);

        } catch (error) {
            console.error('Error generating scene:', error);
            this.showError(`Error generating scene: ${error.message}`);
            this.showLoading(false);
        }
    }

    /**
     * Reset camera position
     */
    resetCamera() {
        if (this.sceneGenerator) {
            this.sceneGenerator.resetCamera();
        }
    }

    /**
     * Download the scene as an image
     */
    downloadScene() {
        if (!this.sceneGenerator) return;

        try {
            const canvas = document.getElementById('sceneCanvas');
            const dataURL = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.download = 'my-3d-scene.png';
            link.href = dataURL;
            link.click();
        } catch (error) {
            console.error('Error downloading scene:', error);
            this.showError('Error downloading scene');
        }
    }

    /**
     * Show/hide loading indicator
     */
    showLoading(show) {
        const loading = document.getElementById('loadingIndicator');
        const generateBtn = document.getElementById('generateBtn');

        if (show) {
            loading.classList.remove('hidden');
            generateBtn.disabled = true;
        } else {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }

    /**
     * Show/hide canvas container
     */
    showCanvas(show) {
        const container = document.getElementById('canvasContainer');
        if (show) {
            container.classList.remove('hidden');
        } else {
            container.classList.add('hidden');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => this.hideError(), 5000);
    }

    /**
     * Hide error message
     */
    hideError() {
        const errorElement = document.getElementById('errorMessage');
        errorElement.classList.add('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
