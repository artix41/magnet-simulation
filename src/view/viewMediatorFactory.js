import EngineViewMediator from './mediator/engineViewMediator';

export default class ViewMediatorFactory {
    getMediator(simulationObject) {
        switch (simulationObject.className) {
            case 'Engine':
                return new EngineViewMediator(simulationObject, this);
        }
    }
}
