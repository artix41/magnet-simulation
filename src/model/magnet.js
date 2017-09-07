import SimulationObject from './simulationObject';
import Particule from './particule';

export default class Magnet extends SimulationObject {
    constructor(size, nbParticules) {
        super();
        this.className = 'Magnet';

        this.size = size;
        this.nbParticules = nbParticules;

        var obj = this;
        this.matrixParticules = _.times(this.nbParticules.x,0).map(function() {
            return _.times(obj.nbParticules.y, 0).map(function () {
                return _.times(obj.nbParticules.z, 0);
            });
        });
    }

    addParticules(nbParticules) {
        const length = this.size.x / (this.nbParticules.x+2);
        const marginX = this.size.x / (this.nbParticules.x+2)+2;
        const marginY = this.size.y / this.nbParticules.y;
        const marginZ = this.size.z / this.nbParticules.z;
        for (var x = 0; x < this.nbParticules.x; x++) {
            for (var y = 0; y < this.nbParticules.y; y++) {
                for (var z = 0; z < this.nbParticules.z; z++) {
                    const position = {
                        x: length + x*marginX - this.size.x / 2,
                        y: 5 + y*marginY - this.size.y / 2,
                        z: 2 + z*marginZ - this.size.z / 2
                    };
                    const particule = new Particule(2*+(Math.random() > 0.5) - 1, position);
                    particule.magnet = this;
                    this.matrixParticules[x][y][z] = particule;
                    this.emit("ParticuleAdded", {particule});
                }
            }
        }
    }

    [Symbol.iterator]() {
        return _.flattenDeep(this.matrixParticules);
    }
}
