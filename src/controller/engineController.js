import MainView from '../view/mainView';

export default class EngineController {
    constructor(engine) {
        this.engine = engine;
        this.view = new MainView(this, engine);
        this.view.initialize();
    }

    setDescriptionPanelText(temperature, magnetization) {
        var textTemperature = "Magnet temperature: " + temperature.toFixed(0).toString();
        var textMagnetization = "Magnetization: " + magnetization.toFixed(2).toString();
        this.view.descriptionPanel.text = textTemperature + "<br />" + textMagnetization;
    }
}
