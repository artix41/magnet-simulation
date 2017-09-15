import chroma from 'chroma-js'
import ViewMediator from './viewMediator';
import Magnet from '../../model/magnet';
import Text from '../../model/text';

export default class EngineViewMediator extends ViewMediator {
    constructor(engine, mediatorFactory) {
        super(engine, mediatorFactory);
        this.simulationObject.addObserver("MagnetAdded", (e) => this.onMagnetAdded(e));

        const floor = this.createFloor();
        this.object3D.add(floor);

        this.scaleTemperature = chroma.scale(["blue", "white", "red"]).mode('hsl');
        this.thermosLeft = this.createThermostat(this.simulationObject.temperature, -this.simulationObject.sizeFloor.x / 2 + this.simulationObject.sizeThermos.x / 2);
        this.thermosRight = this.createThermostat(this.simulationObject.temperature, this.simulationObject.sizeFloor.x / 2 - this.simulationObject.sizeThermos.x / 2);
        this.object3D.add(this.thermosLeft);
        this.object3D.add(this.thermosRight);

        const metal = this.createMetal();
        this.object3D.add(metal);

        const magnet = new Magnet(this.simulationObject.sizeMagnet, this.simulationObject.positionMagnet, this.simulationObject.nbParticules);
        this.simulationObject.addMagnet(magnet);
        magnet.addParticules();

        var promiseText = new Promise(function(resolve, reject) {
            resolve(new Text());
        });
        var obj = this;
        promiseText.then(function(text) {
            text.magnet = magnet;
            text.engine = engine;
            obj.addChild(text);
        });

        this.createGUI();
    }

    onMagnetAdded(e) {
        e.magnet.engine = this.simulationObject;
        this.addChild(e.magnet);
    }

    createFloor() {
        const geometry = new THREE.PlaneGeometry(this.simulationObject.sizeFloor.x, this.simulationObject.sizeFloor.z, 40, 40);
        const texture = new THREE.TextureLoader().load('images/textures/floor2.jpg');

		const material = new THREE.MeshBasicMaterial({map: texture});
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;

        return floor;
    }

    createThermostat(initTemperature, positionX) {
        const normalizedTemperature = initTemperature / this.simulationObject.maxTemperature;
        const geometry = new THREE.BoxGeometry(this.simulationObject.sizeThermos.x, this.simulationObject.sizeThermos.y, this.simulationObject.sizeThermos.z);
        const material = new THREE.MeshPhongMaterial({color: this.scaleTemperature(normalizedTemperature).hex(), transparent: true, opacity: 0.9});
        const thermos = new THREE.Mesh(geometry, material);

        thermos.position.setY(this.simulationObject.sizeThermos.y / 2);
        thermos.position.setX(positionX);
        thermos.position.setZ(0);

        return thermos;
    }

    createMetal() {
        const geometry = new THREE.BoxGeometry(this.simulationObject.sizeMetal.x, this.simulationObject.sizeMetal.y, this.simulationObject.sizeMetal.z);
        const texture = new THREE.TextureLoader().load('images/textures/metal.jpg');
        const material = new THREE.MeshBasicMaterial({map: texture});
        const metal = new THREE.Mesh(geometry, material);

        metal.position.setY(this.simulationObject.sizeMetal.y / 2);
        metal.position.setX(-this.simulationObject.sizeFloor.x / 2 + this.simulationObject.sizeThermos.x + this.simulationObject.positionMetal.x);
        metal.position.setZ(0);

        return metal;
    }

    createGUI() {
        var gui = new dat.GUI({width: 400});
        var obj = this;
		gui.add(this.simulationObject, 'temperature', 0,this.simulationObject.maxTemperature).step(1).name('Temperature').onFinishChange(function() {
            obj.onTemperatureChange();
        });
        gui.add(this.simulationObject, 'displayText').name("Display text");
    }

    onTemperatureChange(side) {
        const newColor = this.scaleTemperature(this.simulationObject.temperature / this.simulationObject.maxTemperature);
        const newColorHex = newColor.get('rgb.r')*16*16*16*16 + newColor.get('rgb.g')*16*16 + newColor.get('rgb.b');
        this.thermosLeft.material.color.setHex(newColorHex);
        this.thermosRight.material.color.setHex(newColorHex);
    }

    onFrameRenderered() {
        for (const childMediator of this.childMediators.values()) {
            childMediator.onFrameRenderered();
        }
    }
}
