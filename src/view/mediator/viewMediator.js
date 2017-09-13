import Observable from '../../observable.js';

export default class ViewMediator extends Observable {
    constructor(simulationObject, mediatorFactory) {
        super();
        this.simulationObject = simulationObject;
        this.mediatorFactory = mediatorFactory;
        this.object3D = this.makeObject3D();
        this.childMediators = new Map();
        this.object3D.traverse((object3D) => {
            object3D.mediator = this;
        });
    }

    makeObject3D() {
        const container = new THREE.Object3D();

        container.add(new THREE.Object3D());
        return container;
    }

    addChild(child) {
        // get the mediator of the child and save it (for rendering and removing purpose)
        const mediator = this.mediatorFactory.getMediator(child);
        this.childMediators.set(child, mediator);


        this.object3D.children[0].add(mediator.object3D);

        // for (const childofChild of child) {
        //     mediator.addChild(childofChild);
        // }
    }

    removeChild(child) {
        const mediator = this.childMediators.get(child);

        if (mediator) {
            this.object3D.children[0].remove(mediator.object3D);
            this.childMediators.delete(child);
        }
    }

    onFrameRenderered() {
        for (const childMediator of this.childMediators.values()) {
            childMediator.onFrameRenderered();
        }
    }
}
