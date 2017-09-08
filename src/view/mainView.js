import RenderingContext from './renderingContext';
import EngineViewMediator from './mediator/engineViewMediator';
import ViewMediatorFactory from './viewMediatorFactory';

export default class MainView {
    constructor(controller, engine) {
        this.controller = controller;
        this.engine = engine;
        this.renderingContext = this.createRenderingContext();
        this.engineViewMediator = new EngineViewMediator(engine, new ViewMediatorFactory);
    }

    createRenderingContext() {
        const domContainer = document.createElement('div');

        document.body.appendChild(domContainer);

        return RenderingContext.getDefault(domContainer);
    }

    initialize() {
        const scene = this.renderingContext.scene;
        const object3D = this.engineViewMediator.object3D;

        scene.add(object3D);

        window.addEventListener('resize', (e) => this.onWindowResize(), false);

        this.render();
    }

    render() {
        this.renderingContext.controls.update();
        requestAnimationFrame(() => this.render());
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
    }

    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
