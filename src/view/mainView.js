import RenderingContext from './renderingContext';

export default class MainView {
    constructor(controller, engine) {
        this.controller = controller;
        this.engine = engine;
        this.renderingContext = this.createRenderingContext();
    }

    createRenderingContext() {
        const domContainer = document.createElement('div');

        document.body.appendChild(domContainer);

        return RenderingContext.getDefault(domContainer);
    }

    initialize() {
        this.render();
    }

    render() {
        requestAnimationFrame(() => this.render());
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
    }

    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
