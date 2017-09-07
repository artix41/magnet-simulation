import ViewMediator from './viewMediator';

export default class ParticuleViewMediator extends ViewMediator {
    constructor(particule, mediatorFactory) {
        super(particule, mediatorFactory);
    }

    makeObject3D() {
        const container = new THREE.Object3D();

        const magnet = this.simulationObject.magnet;
        const length = magnet.size.x / (magnet.nbParticules.x+2);
        const radius = 5;

        var geometry = new THREE.CylinderGeometry(0, radius, length, 16, 2);
		//geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, length/2, 0));

        var color = 0;
        if (this.simulationObject.spin > 0) {
            color = 0xff0000;
        }
        else {
            color = 0x0000ff;
        }
		var material = new THREE.MeshPhongMaterial({overdraw: true, color: color});

        const mesh = new THREE.Mesh(geometry, material);

        container.add(mesh);

        const position = this.simulationObject.position;
        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.z = this.simulationObject.spin * Math.PI/2;

        return container;
    }
}
