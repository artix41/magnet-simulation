import EngineViewMediator from './mediator/engineViewMediator';
import MagnetViewMediator from './mediator/magnetViewMediator';
import ParticuleViewMediator from './mediator/particuleViewMediator';
import TextViewMediator from './mediator/textViewMediator';

export default class ViewMediatorFactory {
    getMediator(simulationObject) {
        switch (simulationObject.className) {
            case 'Engine':
                return new EngineViewMediator(simulationObject, this);
            case 'Magnet':
                return new MagnetViewMediator(simulationObject, this);
            case 'Particule':
                return new ParticuleViewMediator(simulationObject, this);
            case 'Text':
                return new TextViewMediator(simulationObject, this);
        }
    }
}
