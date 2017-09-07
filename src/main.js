import 'lodash';
import EngineController from './controller/engineController';
import Engine from './model/engine';
import Magnet from './model/magnet';

const engine = new Engine();
const engineController = new EngineController(engine);
//const magnet = new Magnet(10,10,10);
