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
        mesh.position.setY(this.simulationObject.size.z / 2);
        return container;
    }

    onParticuleAdded(e) {
        this.addChild(e.particule)
    }
}
