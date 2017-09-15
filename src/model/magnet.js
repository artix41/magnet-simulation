import SimulationObject from './simulationObject';
import Particule from './particule';
import _ from 'lodash';

export default class Magnet extends SimulationObject {
    constructor(size, position, nbParticules) {
        super();
        this.className = 'Magnet';

        this.size = size;
        this.nbParticules = nbParticules;
        this.position = position;
        this.mass = 1;
        this.kb = 0.1; // boltzmann constant
        this.g = 100
        this.couplingConstant = 1;
        this.theta = 0;
        this.prevTheta = 0;
        this.magnetization = 0;
        this.temperature = 0;
        this.force = 0;

        this.matrixParticules = _.times(nbParticules.x,0).map(function() {
            return _.times(nbParticules.y, 0).map(function () {
                return _.times(nbParticules.z, 0);
            });
        });
    }

    setMagnetization(m) {
        this.magnetization = m;
        const F = 100;
        this.force =  F * Math.pow(Math.abs(m),3);
        this.force *= Math.sign(m);
    }

    addParticules() {
        const length = this.engine.sizeParticules.length + this.engine.marginParticules.x;
        const diameter = this.engine.sizeParticules.radius + this.engine.marginParticules.y;

        for (var x = 0; x < this.nbParticules.x; x++) {
            for (var y = 0; y < this.nbParticules.y; y++) {
                for (var z = 0; z < this.nbParticules.z; z++) {
                    const position = {
                        x: length + length*x - this.size.x / 2,
                        y: diameter + y*diameter - this.size.y / 2 - this.engine.sizeRope.length,
                        z: diameter + z*diameter - this.size.z / 2
                    };
                    const particule = new Particule(-1, position);
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
