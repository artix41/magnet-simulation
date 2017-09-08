import ViewMediator from './viewMediator';

export default class EngineViewMediator extends ViewMediator {
    constructor(engine, mediatorFactory) {
        super(engine, mediatorFactory);
        this.simulationObject.addObserver("MagnetAdded", (e) => this.onMagnetAdded(e));
        this.sizeFloor = {
            x: 2000,
            y: 0,
            z: 500
        };
        this.sizeThermos = {
            x: 10,
            y: 500,
            z: this.sizeFloor.z
        }

        const floor = this.createFloor();
        this.object3D.add(floor);

        this.temperatureLeft = 1;
        this.temperatureRight = 0;
        this.scaleTemperature = chroma.scale(['blue', 'red']).mode('lab');

        const thermosLeft = this.createThermostat(this.temperatureLeft, -this.sizeFloor.x / 2 + this.sizeThermos.x / 2);
        const thermosRight = this.createThermostat(this.temperatureRight, this.sizeFloor.x / 2 - this.sizeThermos.x / 2);
        this.object3D.add(thermosLeft);
        this.object3D.add(thermosRight);

    }

    onMagnetAdded(e) {
        this.addChild(e.magnet);
    }

    createFloor() {
        const geometry = new THREE.PlaneGeometry(this.sizeFloor.x, this.sizeFloor.z, 40, 40);
		const material = new THREE.MeshPhongMaterial({color: 0xCA6924, overdraw: true});
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;

        return floor;
    }

    createThermostat(initTemperature, positionX) {
        const geometry = new THREE.BoxGeometry(this.sizeThermos.x, this.sizeThermos.y, this.sizeThermos.z);
        const material = new THREE.MeshPhongMaterial({color: this.scaleTemperature(initTemperature).hex(), transparent: true, opacity: 0.9});
        const thermos = new THREE.Mesh(geometry, material);

        thermos.position.setY(this.sizeThermos.y / 2);
        thermos.position.setX(positionX);
        thermos.position.setZ(0);


        return thermos

    }
}
