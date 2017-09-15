import SimulationObject from './simulationObject';

export default class Text extends SimulationObject {
    constructor() {
        super();
        this.className = 'Text';
        this.heightText = 1;
        this.positionTextTop = {
            y: 750,
            z: -700
        };
        this.defaultSize = {top: 40, bottom: 30};
        this.listTexts = [
            {
                id: 0,
                size: this.defaultSize,
                textTop: `                      On a cold winter's day, a freezing magnet feels attracted by his metallic companion. \nIf you look at the heart of this magnet, you can see hundreds of tiny magnets, all oriented in the same direction...`,
                textBottom: "Turn on the heating of the room (top-right panel) to see what happens to the magnet and all his components."
            },
            {
                id: 1,
                size: this.defaultSize,
                textTop: `The magnet has lost its magnetism and its components are now changing continuously of orientation.\n It means you passed what is called the Curie temperature, above which a magnet becomes paramagnetic.`,
                textBottom: `Press Enter to know more about the physics of the model.`
            },
            {
                id: 2,
                size: {top: 40, bottom:this.defaultSize.bottom},
                textTop: '                        You can now see one of the limits of the Ising Model: while the phenomenon should be reversible and the\n magnetism maximum at low temperature, the magnet is actually stuck with some red and blue regions and cannot evolve anymore.\n                                        This is a consequence of taking only into account the neighborhood of each atom.',
                textBottom: `Press Enter to know more about the physics of the model.`
            },
            {
                id: 3,
                size: this.defaultSize,
                textTop: '                        You are now in the opposite state of the inital one.\n The magnet randomly chooses to converge either in a blue state or a red state.\n                 This is what physicists call spontaneous symmetry breaking.',
                textBottom: `Press Enter to know more about the physics of the model.`
            },
            {
                id: 4,
                size: this.defaultSize,
                textTop: 'You came back to the initial state. This is a consequence of the reversibility of the phenomenon.\n                        However, the Ising model sometimes fail to capture this reversibility.\nTry to increase and decrease the temperature again to see if you still come back to the initial state.',
                textBottom: `Press Enter to know more about the physics of the model.`
            }
        ];
        this.currentTextId = -1;
    }

    [Symbol.iterator]() {
        return [];
    }
}
