import SimulationObject from './simulationObject';

export default class Text extends SimulationObject {
    constructor() {
        super();
        this.className = 'Text';
        this.heightText = 1;
        this.positionTextTop = {
            y: 750,
            z: -700
        }
        this.defaultSize = {top: 40, bottom: 30};
        this.listTexts = [
            {
                id: 0,
                size: this.defaultSize,
                textTop: `                      On a cold winter's day, a freezing magnet feels attracted by his metallic companion. \nIf you look at the heart of this magnet, you can see hundreds of little magnets, all oriented in the same direction...`,
                textBottom: "Turn on the heating of the room (top-right panel) to see what happens to the magnet and all his components"
            },
            {
                id: 1,
                size: this.defaultSize,
                textTop: `The magnet has lost its magnetism and its components are now changing continuously of orientation.\n It means you passed what is called the Curie temperature, above which a magnet becomes paramagnetic`,
                textBottom: `Press Enter to know more about the physics of the model`
            }
        ];
        this.currentTextId = -1;
    }

    [Symbol.iterator]() {
        return [];
    }
}
