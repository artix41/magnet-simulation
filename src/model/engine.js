import SimulationObject from './simulationObject';
import Magnet from './magnet'

export default class Engine extends SimulationObject {
    constructor() {
        super();
        this.className = 'Engine';
        this.magnet = undefined;
    }

    addMagnet(magnet) {
        this.magnet = magnet;
        this.emit("MagnetAdded", { magnet });
    }

    [Symbol.iterator]() {
        return [];
    }
}
