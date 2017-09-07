import SimulationObject from './simulationObject';

export default class Particule extends SimulationObject {
    constructor(spin, position) {
        super();
        this.className = 'Particule';
        this.spin = spin;
        this.position = position;
    }

    [Symbol.iterator]() {
        return [];
    }
}
