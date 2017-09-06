import SimulationObject from './simulationObject';

export default class Engine extends SimulationObject {
    constructor(name, properties) {
        super(name, properties);
        this.className = 'Engine';
    }
}
