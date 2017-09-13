import RenderingContext from './renderingContext';
import EngineViewMediator from './mediator/engineViewMediator';
import ViewMediatorFactory from './viewMediatorFactory';
import DescriptionPanel from './controls/descriptionPanel';

export default class MainView {
    constructor(controller, engine) {
        this.controller = controller;
        this.engine = engine;
        this.descriptionPanel = new DescriptionPanel();
        this.renderingContext = this.createRenderingContext();
        this.engineViewMediator = new EngineViewMediator(engine, new ViewMediatorFactory);
        this.then = Date.now();
        this.fps = 100;
        this.interval = 1000 / this.fps;
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

        this.engine.magnet.addObserver('PositionChange', (e) => this.controller.setDescriptionPanelText(e.temperature, e.magnetization));

        window.addEventListener('resize', (e) => this.onWindowResize(), false);

        console.log("test4")
        this.render();
        console.log("test5")
    }

    render() {
        this.renderingContext.controls.update();

        requestAnimationFrame(() => this.render());

        const now = Date.now();
        const delta = now - this.then;
        if (delta > this.interval) {
            this.then = now - (delta % this.interval);
            this.engineViewMediator.onFrameRenderered();
        }

        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
    }

    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
