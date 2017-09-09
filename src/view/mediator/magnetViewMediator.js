import ViewMediator from './viewMediator';
//import 'nsolvejs';

export default class MagnetViewMediator extends ViewMediator {
    constructor(magnet, mediatorFactory) {
        super(magnet, mediatorFactory);
        this.simulationObject.addObserver("ParticuleAdded", (e) => this.onParticuleAdded(e));
        this.then = Date.now();
        this.fps = 1;
        this.dt = 1000 / this.fps;

        function f(x) {
            return x-Math.cos(x) ;
        }
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
        this.changeMotion();
        this.simulationObject.position.x = this.simulationObject.engine.sizeRope.length * Math.sin(this.object3D.children[0].rotation.z);

        const now = Date.now();
        const delta = now - this.then;
        if (delta > this.dt) {
            this.then = now - (delta % this.dt);
            this.simulationObject.magnetization = this.changeSpins();
            this.simulationObject.temperature = this.simulationObject.engine.getTemperatureField(this.simulationObject.position.x);
        }

        this.simulationObject.emit("PositionChange", {
            temperature: this.simulationObject.temperature,
            magnetization: this.simulationObject.magnetization
        })
    }

    changeMotion() {
        //this.simulationObject.thetaPoint -= 0.
        const object3D = this.object3D.children[0];
        const magnet = this.simulationObject;

        const F = -40;
        const g = 100;
        const l = magnet.engine.sizeRope.length;
        const m = magnet.mass;
        const prevTheta = magnet.prevTheta;
        const theta = magnet.theta;
        const h = 0.2;

        const nextTheta = this.newtonSolver(function(x) {
            return x + prevTheta - 2 * theta - h*h * (F/(m*l) * Math.cos(x) - g / l * Math.sin(x));
        }, h, Math.PI * 2 - h, theta+h, 10);
        //console.log(nextTheta);

        magnet.prevTheta = magnet.theta;
        magnet.theta = nextTheta;
        object3D.rotation.z = magnet.theta;
        object3D.rotation.z %= 2 * Math.PI;
    }

    changeSpins() {
        const matrixParticules = this.simulationObject.matrixParticules;
        const nbParticules = this.simulationObject.nbParticules;

        var magnetization = 0;
        for(var x = 0; x < nbParticules.x; x++) {
            for(var y = 0; y < nbParticules.y; y++) {
                for(var z = 0; z < nbParticules.z; z++) {
                    matrixParticules[x][y][z].spin = 2*+(Math.random() > 0.5) - 1;
                    magnetization += matrixParticules[x][y][z].spin
                }
            }
        }
        magnetization /= nbParticules.x * nbParticules.y * nbParticules.z;

        for (const childMediator of this.childMediators.values()) {
            childMediator.onFrameRenderered();
        }
        return magnetization;
    }

    newtonSolver(f, a, b, xInit, nbIter) {
        var x = xInit;
        var h = 0.000001
        for (var iter=0; iter < nbIter; iter++) {
            var fx = f(x);
            var fprimex = (f(x+h)-f(x))/h;
            x -= fx/fprimex;
        }
        return x;
    }
}
