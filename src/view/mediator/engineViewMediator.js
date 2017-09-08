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
        };

        const floor = this.createFloor();
        this.object3D.add(floor);

        this.temperature = this.simulationObject.temperature;
        this.scaleTemperature = chroma.scale(["blue", "white", "red"]).mode('hsl');
        this.thermosLeft = this.createThermostat(this.temperature.left, -this.sizeFloor.x / 2 + this.sizeThermos.x / 2);
        this.thermosRight = this.createThermostat(this.temperature.right, this.sizeFloor.x / 2 - this.sizeThermos.x / 2);
        this.object3D.add(this.thermosLeft);
        this.object3D.add(this.thermosRight);

        const pendulumBase = this.createPendulumBase(this.sizeThermos.y);
        this.object3D.add(pendulumBase);

        this.rope = this.createRope(100 + 75 / 2, this.sizeThermos.y);
        this.object3D.add(this.rope);

        this.createGUI();
    }

    onMagnetAdded(e) {
        this.addChild(e.magnet);
    }

    createFloor() {
        const geometry = new THREE.PlaneGeometry(this.sizeFloor.x, this.sizeFloor.z, 40, 40);
        const texture = new THREE.TextureLoader().load('images/textures/floor2.jpg');

		const material = new THREE.MeshBasicMaterial({map: texture});
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;

        return floor;
    }

    createThermostat(initTemperature, positionX) {
        const normalizedTemperature = initTemperature / this.simulationObject.maxTemperature;
        const geometry = new THREE.BoxGeometry(this.sizeThermos.x, this.sizeThermos.y, this.sizeThermos.z);
        const material = new THREE.MeshPhongMaterial({color: this.scaleTemperature(normalizedTemperature).hex(), transparent: true, opacity: 0.9});
        const thermos = new THREE.Mesh(geometry, material);

        thermos.position.setY(this.sizeThermos.y / 2);
        thermos.position.setX(positionX);
        thermos.position.setZ(0);

        return thermos
    }

    createPendulumBase(height) {
        const geometry = new THREE.SphereGeometry( 30, 32, 32 );
        const material = new THREE.MeshPhongMaterial({color: 0x0, overdraw: true});
        const pendulumBase = new THREE.Mesh(geometry, material);

        pendulumBase.position.setY(height);

        return pendulumBase;
    }

    createRope(minZ, maxZ) {
        const geometry = new THREE.CylinderGeometry(3, 3, maxZ - minZ, 32);
        const texture = new THREE.TextureLoader().load('images/textures/rope.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(4,20);
        const material = new THREE.MeshBasicMaterial({map: texture});
        const rope = new THREE.Mesh(geometry, material);

        rope.position.setY(minZ + (maxZ - minZ)/2);

        return rope;
    }

    createGUI() {
        var gui = new dat.GUI({width: 400});
        var obj = this;
		gui.add(this.temperature, 'left', 0,100).step(1).name('Left Temperature').onFinishChange(function() {
            obj.onTemperatureChange('left')
        });
        gui.add(this.temperature, 'right', 0,100).step(1).name('Right Temperature').onFinishChange(function() {
            obj.onTemperatureChange('right')
        });;
    }

    onTemperatureChange(side) {
        const thermos = (side == 'left') ? this.thermosLeft : this.thermosRight;
        const temperature = (side == 'left') ? this.temperature.left : this.temperature.right;

        const newColor = this.scaleTemperature(temperature / this.simulationObject.maxTemperature);
        const newColorHex = newColor.get('rgb.r')*16*16*16*16 + newColor.get('rgb.g')*16*16 + newColor.get('rgb.b');
        thermos.material.color.setHex(newColorHex);
    }
}
