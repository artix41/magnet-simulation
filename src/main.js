/* Thanks to Lucas Majerowicz for the MVC structure of the code
(cf: http://hecodes.com/2016/07/using-mvc-pattern-for-building-complex-three-js-applications/) */

import EngineController from './controller/engineController';
import Engine from './model/engine';
import Magnet from './model/magnet';

const engine = new Engine();
const engineController = new EngineController(engine);
