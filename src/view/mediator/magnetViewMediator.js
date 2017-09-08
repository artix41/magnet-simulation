import ViewMediator from './viewMediator';

export default class MagnetViewMediator extends ViewMediator {
    constructor(magnet, mediatorFactory) {
        super(magnet, mediatorFactory);
        this.simulationObject.addObserver("ParticuleAdded", (e) => this.onParticuleAdded(e));
        this.then = Date.now();
        this.fps = 1;
        this.interval = 1000 / this.fps;
    }

    makeObject3D() {
        console.log(this.simulationObject.engine);
        this.rope = this.createRope(-this.simulationObject.engine.sizeRope.length, 0);

        this.pivot = this.createPivot(this.simulationObject.engine.sizeThermos.y);
        this.pivot.add(this.rope);

        const container = new THREE.Object3D();

        const size = this.simulationObject.size;
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshPhongMaterial({color: 0x6C7A89, transparent: true, opacity: 0.5});
        const magnet = new THREE.Mesh(geometry, material);
        magnet.position.setY(0);

        this.rope.add(magnet);
        container.add(this.pivot);
        return container;
    }

    onParticuleAdded(e) {
        this.addChild(e.particule);
    }

    createPivot(height) {
        const geometry = new THREE.SphereGeometry( 30, 32, 32 );
        const material = new THREE.MeshPhongMaterial({color: 0x0, overdraw: true});
        const pivot = new THREE.Mesh(geometry, material);

        pivot.position.setY(height);

        return pivot;
    }

    createRope(minZ, maxZ) {
        const geometry = new THREE.CylinderGeometry(this.simulationObject.engine.sizeRope.radius, this.simulationObject.engine.sizeRope.radius, maxZ - minZ, 32);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, this.simulationObject.engine.sizeRope.length/2, 0));

        const texture = new THREE.TextureLoader().load('images/textures/rope.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(4,20);
        const material = new THREE.MeshBasicMaterial({map: texture});
        const rope = new THREE.Mesh(geometry, material);

        rope.position.setY(minZ);

        return rope;
    }

    onFrameRenderered() {
        const now = Date.now();
        const delta = now - this.then;
        this.simulationObject.thetaPoint -= 0.001
        this.object3D.children[0].rotation.z += this.simulationObject.thetaPoint;

        if (delta > this.interval) {
            this.then = now - (delta % this.interval);
            const matrixParticules = this.simulationObject.matrixParticules;
            const nbParticules = this.simulationObject.nbParticules;

            for(var x = 0; x < nbParticules.x; x++) {
                for(var y = 0; y < nbParticules.y; y++) {
                    for(var z = 0; z < nbParticules.z; z++) {
                        matrixParticules[x][y][z].spin = 2*+(Math.random() > 0.5) - 1;
                    }
                }
            }
            for (const childMediator of this.childMediators.values()) {
                childMediator.onFrameRenderered();
            }
        }
    }
}
