import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Generates and manages the Three.js scene based on parsed prompt configuration
 */
export class SceneGenerator {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.config = config;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationId = null;
        this.objects = [];
    }

    /**
     * Initialize the Three.js scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Setup camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 2, 8);

        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Setup controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;

        // Setup scene based on configuration
        this.setupEnvironment();
        this.setupLighting();
        this.addAtmosphere();
        this.addObjects();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    /**
     * Setup environment (background, fog, ground)
     */
    setupEnvironment() {
        const env = this.config.environment;

        switch (env) {
            case 'forest':
                this.scene.background = new THREE.Color(0x87ceeb);
                this.scene.fog = new THREE.Fog(0x87ceeb, 10, 50);
                this.addGround(0x2d5016);
                break;

            case 'city':
                this.scene.background = new THREE.Color(0x1a1a2e);
                this.addGround(0x333333);
                break;

            case 'space':
                this.scene.background = new THREE.Color(0x000011);
                this.addStarfield();
                break;

            case 'ocean':
                this.scene.background = new THREE.Color(0x0077be);
                this.scene.fog = new THREE.Fog(0x0077be, 10, 50);
                this.addGround(0xc2b280);
                break;

            case 'desert':
                this.scene.background = new THREE.Color(0xffd700);
                this.scene.fog = new THREE.Fog(0xffd700, 20, 80);
                this.addGround(0xdaa520);
                break;

            case 'mountain':
                this.scene.background = new THREE.Color(0x87ceeb);
                this.scene.fog = new THREE.Fog(0x87ceeb, 15, 60);
                this.addGround(0x8b7355);
                break;

            case 'abstract':
                const colorScheme = this.getColorFromScheme();
                this.scene.background = new THREE.Color(colorScheme);
                break;

            default:
                this.scene.background = new THREE.Color(0x87ceeb);
                this.addGround(0x7ec850);
        }
    }

    /**
     * Add ground plane
     */
    addGround(color) {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.2,
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }

    /**
     * Add starfield for space environment
     */
    addStarfield() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
        });

        const starsVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starsVertices, 3)
        );

        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }

    /**
     * Setup lighting based on configuration
     */
    setupLighting() {
        const lighting = this.config.lighting;

        // Ambient light
        let ambientIntensity = 0.5;
        let ambientColor = 0xffffff;

        // Directional light
        let directionalIntensity = 1.0;
        let directionalColor = 0xffffff;

        switch (lighting) {
            case 'bright':
                ambientIntensity = 0.7;
                directionalIntensity = 1.5;
                break;

            case 'dark':
                ambientIntensity = 0.2;
                directionalIntensity = 0.5;
                ambientColor = 0x4444ff;
                break;

            case 'neon':
                ambientIntensity = 0.3;
                this.addNeonLights();
                break;

            case 'warm':
                ambientColor = 0xffd7a8;
                directionalColor = 0xffaa77;
                break;

            case 'cool':
                ambientColor = 0xa8d7ff;
                directionalColor = 0x77aaff;
                break;
        }

        const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
    }

    /**
     * Add neon lights for cyberpunk scenes
     */
    addNeonLights() {
        const colors = [0xff00ff, 0x00ffff, 0xff0099];

        colors.forEach((color, i) => {
            const light = new THREE.PointLight(color, 2, 20);
            const angle = (i / colors.length) * Math.PI * 2;
            light.position.set(
                Math.cos(angle) * 8,
                3,
                Math.sin(angle) * 8
            );
            this.scene.add(light);

            // Add light helper spheres
            const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.copy(light.position);
            this.scene.add(sphere);
        });
    }

    /**
     * Add atmospheric effects
     */
    addAtmosphere() {
        this.config.atmosphere.forEach(effect => {
            switch (effect) {
                case 'fog':
                    if (!this.scene.fog) {
                        this.scene.fog = new THREE.Fog(0xcccccc, 10, 50);
                    }
                    break;

                case 'particles':
                    this.addParticles();
                    break;

                case 'glow':
                    this.addGlowEffect();
                    break;
            }
        });
    }

    /**
     * Add particle system
     */
    addParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = 5000;
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 50;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(particles);
        this.objects.push({ type: 'particles', mesh: particles });
    }

    /**
     * Add glow effect
     */
    addGlowEffect() {
        const glowGeometry = new THREE.SphereGeometry(15, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: this.getColorFromScheme(),
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide,
        });

        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.scene.add(glow);
    }

    /**
     * Add objects to the scene based on configuration
     */
    addObjects() {
        this.config.objects.forEach(objectType => {
            switch (objectType) {
                case 'trees':
                    this.addTrees();
                    break;

                case 'rocks':
                    this.addRocks();
                    break;

                case 'buildings':
                    this.addBuildings();
                    break;

                case 'geometric':
                    this.addGeometricShapes();
                    break;

                case 'crystals':
                    this.addCrystals();
                    break;
            }
        });
    }

    /**
     * Add trees to the scene
     */
    addTrees() {
        for (let i = 0; i < 10; i++) {
            const tree = this.createTree();
            const angle = (i / 10) * Math.PI * 2;
            const radius = 10 + Math.random() * 5;
            tree.position.set(
                Math.cos(angle) * radius,
                -2,
                Math.sin(angle) * radius
            );
            this.scene.add(tree);
        }
    }

    /**
     * Create a simple tree
     */
    createTree() {
        const tree = new THREE.Group();

        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.castShadow = true;
        tree.add(trunk);

        // Foliage
        const foliageGeometry = new THREE.ConeGeometry(2, 4, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 3;
        foliage.castShadow = true;
        tree.add(foliage);

        return tree;
    }

    /**
     * Add rocks to the scene
     */
    addRocks() {
        for (let i = 0; i < 15; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.5, 0);
            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.9,
            });
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            rock.position.set(
                (Math.random() - 0.5) * 30,
                -2,
                (Math.random() - 0.5) * 30
            );
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            rock.castShadow = true;
            this.scene.add(rock);
        }
    }

    /**
     * Add buildings for city scenes
     */
    addBuildings() {
        for (let i = 0; i < 20; i++) {
            const width = 2 + Math.random() * 2;
            const height = 5 + Math.random() * 15;
            const depth = 2 + Math.random() * 2;

            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.MeshStandardMaterial({
                color: Math.random() * 0x444444 + 0x333333,
                roughness: 0.7,
            });

            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            const angle = (i / 20) * Math.PI * 2;
            const radius = 15 + Math.random() * 10;
            building.position.set(
                Math.cos(angle) * radius,
                height / 2 - 2,
                Math.sin(angle) * radius
            );
            building.castShadow = true;
            this.scene.add(building);
        }
    }

    /**
     * Add geometric shapes for abstract scenes
     */
    addGeometricShapes() {
        const geometries = [
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.SphereGeometry(0.6, 16, 16),
            new THREE.TetrahedronGeometry(0.8),
            new THREE.OctahedronGeometry(0.7),
        ];

        for (let i = 0; i < 15; i++) {
            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshStandardMaterial({
                color: parseInt(this.getColorFromScheme().replace('#', '0x')),
                metalness: 0.5,
                roughness: 0.3,
            });

            const shape = new THREE.Mesh(geometry, material);
            shape.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 5,
                (Math.random() - 0.5) * 20
            );
            shape.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            shape.castShadow = true;
            this.scene.add(shape);
            this.objects.push({ type: 'geometric', mesh: shape });
        }
    }

    /**
     * Add crystals for fantasy scenes
     */
    addCrystals() {
        for (let i = 0; i < 10; i++) {
            const crystalGeometry = new THREE.ConeGeometry(0.5, 3, 6);
            const crystalMaterial = new THREE.MeshStandardMaterial({
                color: parseInt(this.getColorFromScheme().replace('#', '0x')),
                metalness: 0.8,
                roughness: 0.2,
                transparent: true,
                opacity: 0.8,
            });

            const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
            crystal.position.set(
                (Math.random() - 0.5) * 15,
                0.5,
                (Math.random() - 0.5) * 15
            );
            crystal.rotation.x = Math.PI;
            crystal.castShadow = true;
            this.scene.add(crystal);
        }
    }

    /**
     * Get a color from the color scheme
     */
    getColorFromScheme() {
        const colorMap = {
            red: '#ff0000',
            blue: '#0066ff',
            green: '#00ff00',
            purple: '#9966ff',
            orange: '#ff6600',
            pink: '#ff66cc',
            yellow: '#ffff00',
            white: '#ffffff',
            black: '#000000',
        };

        const colors = this.config.colors;
        if (colors.length > 0) {
            return colorMap[colors[Math.floor(Math.random() * colors.length)]] || '#6677ee';
        }

        return '#6677ee';
    }

    /**
     * Add the face model to the scene
     */
    addFaceModel(faceModel) {
        faceModel.position.set(0, 1, 0);
        this.scene.add(faceModel);
        this.faceModel = faceModel;
    }

    /**
     * Animation loop
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();

        // Animate objects
        this.objects.forEach(obj => {
            if (obj.type === 'particles') {
                obj.mesh.rotation.y += 0.001;
            } else if (obj.type === 'geometric') {
                obj.mesh.rotation.x += 0.01;
                obj.mesh.rotation.y += 0.01;
            }
        });

        // Rotate face model slightly
        if (this.faceModel) {
            this.faceModel.rotation.y += 0.005;
        }

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    /**
     * Reset camera position
     */
    resetCamera() {
        this.camera.position.set(0, 2, 8);
        this.controls.target.set(0, 1, 0);
        this.controls.update();
    }

    /**
     * Stop animation and cleanup
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.renderer.dispose();
        this.controls.dispose();
    }
}
