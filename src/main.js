import 'lodash';
import EngineController from './controller/engineController';
import Engine from './model/engine';
import Magnet from './model/magnet';

const engine = new Engine();
const engineController = new EngineController(engine);

const size = {x:400, y:150, z:150};
const nbParticules = {x:12, y:6, z:6};
const magnet = new Magnet(size, nbParticules);

engine.addMagnet(magnet);
magnet.addParticules();
