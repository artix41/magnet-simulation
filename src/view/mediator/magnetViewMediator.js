import ViewMediator from './viewMediator';

export default class MagnetViewMediator extends ViewMediator {
    constructor(magnet, mediatorFactory) {
        super(magnet, mediatorFactory);
        this.simulationObject.addObserver("ParticuleAdded", (e) => this.onParticuleAdded(e));
    }

    makeObject3D() {
        const container = new THREE.Object3D();

        const size = this.simulationObject.size;
        const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
        const material = new THREE.MeshPhongMaterial({color: 0x6C7A89, transparent: true, opacity: 0.5});
        const mesh = new THREE.Mesh(geometry, material);

        container.add(mesh);
        mesh.position.setY(this.simulationObject.size.z / 2 + 100);
        return container;
    }

    onParticuleAdded(e) {
        this.addChild(e.particule)
    }

    onFrameRenderered() {
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
