import * as THREE from 'three';

/**
 * Creates a 3D face model with the uploaded image as texture
 */
export class FaceModel {
    constructor(imageUrl) {
        this.imageUrl = imageUrl;
        this.mesh = null;
    }

    /**
     * Create a 3D head model with the face texture
     */
    async create() {
        // Load the texture from the uploaded image
        const textureLoader = new THREE.TextureLoader();
        const texture = await new Promise((resolve, reject) => {
            textureLoader.load(
                this.imageUrl,
                resolve,
                undefined,
                reject
            );
        });

        // Create a head-shaped geometry using sphere segments
        const geometry = this.createHeadGeometry();

        // Create material with the face texture
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.7,
            metalness: 0.1,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        return this.mesh;
    }

    /**
     * Create a head-shaped geometry
     * Uses a combination of sphere for head and cylinder for neck
     */
    createHeadGeometry() {
        // Create head (sphere)
        const headGeometry = new THREE.SphereGeometry(1, 32, 32);

        // Slightly flatten the sphere to make it more head-like
        const positions = headGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // Elongate vertically slightly
            positions.setY(i, y * 1.1);

            // Flatten the back of the head
            if (z < 0) {
                positions.setZ(i, z * 0.85);
            }
        }

        positions.needsUpdate = true;
        headGeometry.computeVertexNormals();

        return headGeometry;
    }

    /**
     * Create a more detailed 3D head with neck
     */
    createDetailedHead() {
        const group = new THREE.Group();

        // Head
        const headGeometry = this.createHeadGeometry();
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(this.imageUrl);

        const headMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.7,
            metalness: 0.1,
        });

        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.3;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.6, 16);
        const neckMaterial = new THREE.MeshStandardMaterial({
            color: 0xffd0b0,
            roughness: 0.7,
            metalness: 0.1,
        });

        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.y = -0.3;
        neck.castShadow = true;
        neck.receiveShadow = true;
        group.add(neck);

        return group;
    }

    /**
     * Add facial features using UV mapping for better texture placement
     */
    setupUVMapping(geometry) {
        const uvs = geometry.attributes.uv;
        const positions = geometry.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // Front of the face gets the main texture
            if (z > 0) {
                const u = (x + 1) / 2;
                const v = (y + 1) / 2;
                uvs.setXY(i, u, v);
            }
        }

        uvs.needsUpdate = true;
    }
}
