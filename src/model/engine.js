import SimulationObject from './simulationObject';

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
}
