import Observable from '../observable';

export default class SimulationObject extends Observable {
    constructor(name, properties = {}) {
        super();
        this.name = name;
        this.properties = properties;
    }
}
