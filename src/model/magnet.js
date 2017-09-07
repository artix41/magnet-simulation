import SimulationObject from './simulationObject';
import Particule from './particule';

export default class Magnet extends SimulationObject {
    constructor(nbParticulesX, nbParticulesY, nbParticulesZ) {
        super();
        this.className = 'Magnet';

        this.nbParticules = {
            x: nbParticulesX,
            y: nbParticulesY,
            z: nbParticulesZ
        };
        var obj = this;
        this.matrixParticules = _.times(this.nbParticules.x,0).map(function() {
            return _.times(obj.nbParticules.y, 0).map(function () {
                return _.times(obj.nbParticules.z, 0);
            });
        });
        for (var x = 0; x < this.nbParticules.x; x++) {
            for (var y = 0; y < this.nbParticules.x; y++) {
                for (var z = 0; z < this.nbParticules.x; z++) {
                    this.matrixParticules[x][y][z] = new Particule(1);
                }
            }
        }
    }
}
