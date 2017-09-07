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
        const controls = new THREE.TrackballControls(camera);
        const light = new THREE.DirectionalLight(0xf9f1c2, 1);
        const SPACE = 40, L = 8;

        scene.fog = new THREE.FogExp2(0x9db3b5, 0.0008);

		camera.position.x = 0;
		camera.position.y = SPACE*L;
		camera.position.z = SPACE*L*1.5;

        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;

        light.position.set(500, 1500, 1000);
		light.castShadow = true;
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		var d = 1000;
		light.shadow.camera.left = d;
		light.shadow.camera.right = -d;
		light.shadow.camera.top = d;
		light.shadow.camera.bottom = -d;
		light.shadow.camera.far = 2500;

        scene.add(light);

        containerElement.appendChild(renderer.domElement);

        return new RenderingContext(scene, camera, renderer, controls);
    }
}
