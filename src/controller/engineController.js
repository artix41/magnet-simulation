import MainView from '../view/mainView';

export default class EngineController {
    constructor(engine) {
        this.engine = engine;
        this.view = new MainView(this, engine);
        this.view.initialize();
    }
}
