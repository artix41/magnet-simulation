import ViewMediator from './viewMediator';

export default class EngineViewMediator extends ViewMediator {
    constructor(engine, mediatorFactory) {
        super(engine, mediatorFactory);
        this.simulationObject.addObserver("MagnetAdded", (e) => this.onMagnetAdded(e));

        const floor = this.createFloor();

        this.object3D.add(floor);
    }

    onMagnetAdded(e) {
        this.addChild(e.magnet);
    }

    createFloor() {
        const geometry = new THREE.PlaneGeometry(2000, 2000, 40, 40);
		const material = new THREE.MeshPhongMaterial({color: 0xCA6924, overdraw: true});
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -0.5 * Math.PI;
        floor.position.y = -40*2;
        floor.receiveShadow = true;

        return floor;
    }
}
