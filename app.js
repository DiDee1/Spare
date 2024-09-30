// Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a gradient background using a texture
    const createGradientTexture = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512; // Set canvas size
        canvas.height = 512;

        // Create a gradient
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#FFFFFF'); // Light color at the top right
        gradient.addColorStop(0.2, '#FFFFAA'); // Light yellow 
        gradient.addColorStop(1, '#000000'); // Dark color at the bottom left

        // Fill the canvas with the gradient
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Create a texture from the canvas
        return new THREE.CanvasTexture(canvas);
    };

    // Assign the gradient texture as the scene background
    const gradientTexture = createGradientTexture();
    scene.background = gradientTexture;

    // Create a sphere geometry (the object)
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0x0000FF, shininess: 50 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true; // Enable shadow casting for the sphere
    scene.add(sphere);

    // Add light source at the upper-left corner
    const pointLight = new THREE.PointLight(0xFFFFFF, 2, 100);
    pointLight.position.set(-5, 5, 5);  // Fixed light at upper-left corner
    pointLight.castShadow = true; // Enable shadows for the point light
    scene.add(pointLight);

    // Add ambient light to softly illuminate the entire scene
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);  // Soft ambient light
    scene.add(ambientLight);

    // Add a shadow-catching plane (floor)
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });  // Material that displays shadows
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to lie flat
    plane.position.y = -0.5;  // Position below the sphere
    plane.receiveShadow = true; // Enable shadow reception
    scene.add(plane);

    // Enable shadows for the renderer
    renderer.shadowMap.enabled = true;

    // Camera position
    camera.position.z = 5;

    // Movement variables
    let speedX = 0.05;
    let speedY = 0.03;

    // Define the boundaries for bouncing
    const maxX = 2.5;
    const minX = -2.5;
    const maxY = 1.5;
    const minY = -1.5;

    // Animation function
    function animate() {
        requestAnimationFrame(animate);

        // Move the sphere along the x and y axes
        sphere.position.x += speedX;
        sphere.position.y += speedY;

        // Check for boundaries and bounce
        if (sphere.position.x >= maxX || sphere.position.x <= minX) {
            speedX = -speedX;  // Reverse direction on X-axis
            sphere.material.color.set(Math.random() * 0xFFFFFF);  // Change color to a random color
        }

        if (sphere.position.y >= maxY || sphere.position.y <= minY) {
            speedY = -speedY;  // Reverse direction on Y-axis
            sphere.material.color.set(Math.random() * 0xFFFFFF);  // Change color to a random color
        }

        // Render the scene with the updated sphere position
        renderer.render(scene, camera);
    }

    // Handle window resizing
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Start the animation loop
    animate();
