import EngineController from './controller/engineController';
import Engine from './model/engine';

const engine = new Engine('Curie Engine');
const engineController = new EngineController(engine);
