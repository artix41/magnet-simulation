import SimulationObject from './simulationObject';
import Magnet from './magnet';

export default class Engine extends SimulationObject {
    constructor() {
        super();
        this.className = 'Engine';
        this.magnet = undefined;
        this.maxTemperature = 100;
        this.temperature = {left: this.maxTemperature, right: 0};

        this.sizeFloor = {x: 1800, y: 0, z: 500};
        this.sizeMagnet = {x:200, y:75, z:75};
        this.positionMagnet = {x: 0, y: 0, z: 0};
        this.nbParticules = {x:12, y:6, z:6};
        this.sizeThermos = {x: 10, y: 500, z: this.sizeFloor.z};
        this.sizeMetal = {x: 20, y: this.sizeThermos.y * 0.9, z: this.sizeFloor.z / 2};
        this.sizeRope = {radius: 3, length: this.sizeThermos.y - this.sizeMagnet.y - 100};
    }

    addMagnet(magnet) {
        this.magnet = magnet;
        this.emit("MagnetAdded", { magnet });
    }

    getTemperatureField(x) {
        return this.temperature.left + x * (this.temperature.right - this.temperature.left) / this.sizeFloor.x;
    }

    [Symbol.iterator]() {
        return [];
    }
}
