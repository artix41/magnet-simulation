import SimulationObject from './simulationObject';

export default class Particule extends SimulationObject {
    constructor(spin) {
        super();
        this.className = 'Particule';
        this.spin = spin;
    }
}
