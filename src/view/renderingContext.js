export default class RenderingContext {
    constructor(scene, camera, renderer, controls) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
    }

    static getDefault(containerElement) {
        const width = window.innerWidth, height = window.innerHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight), 1, 10000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const controls = new THREE.OrbitControls(camera, containerElement);
        const light1 = new THREE.DirectionalLight(0xf9f1c2, 0.5);
        const light2 = new THREE.DirectionalLight(0xf9f1c2, 0.5);
        const light3 = new THREE.PointLight(0xffffff, 1, 1000);
        const light4 = new THREE.PointLight(0xffffff, 1, 1000);

        const SPACE = 40, L = 8;

        scene.background = new THREE.Color(0xd7f0f7);

        scene.fog = new THREE.FogExp2(0x9db3b5, 0.0005);

        controls.target.set(0, 120, 0);

		camera.position.x = 0;
		camera.position.y = 500;
		camera.position.z = 870;

        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;

        light1.position.set(500, 1500, 1000);
        light2.position.set(-500, 1500, 1000);
        light3.position.set(500,300,0);
        light4.position.set(-500,300,0);

        scene.add(light1);
        scene.add(light2);
        scene.add(light3);
        scene.add(light4);

        containerElement.appendChild(renderer.domElement);

        return new RenderingContext(scene, camera, renderer, controls);
    }
}
