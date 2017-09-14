import ViewMediator from './viewMediator';

export default class TextViewMediator extends ViewMediator {
    constructor(textModel, mediatorFactory) {
        super(textModel, mediatorFactory);

        this.textMeshList = [];
        var loader = new THREE.FontLoader();
        var obj = this;
		loader.load('../../../fonts/optimer.json', function (font) {
            for (var idText = 0; idText < obj.simulationObject.listTexts.length; idText++) {
                obj.textMeshList.push(obj.createText(font, idText));
            }
            obj.loadText(0);
        });
    }
    loadText(id) {
        this.removeCurrentText();
        this.simulationObject.currentTextId = id;
        this.object3D.add(this.textMeshList[id].top);
        this.object3D.add(this.textMeshList[id].bottom);
    }
    removeCurrentText() {
        if(this.simulationObject.currentTextId >= 0) {
            this.object3D.remove(this.textMeshList[this.simulationObject.currentTextId].top);
            this.object3D.remove(this.textMeshList[this.simulationObject.currentTextId].bottom);
        }
    }
    createText(font, id) {
        const currentText = this.simulationObject.listTexts[id];
        var geometryTop = new THREE.TextGeometry(currentText.textTop, {
			font: font,
			size: currentText.size.top,
			height: this.simulationObject.heightText,
			curveSegments: 4,
		});
        var geometryBottom = new THREE.TextGeometry(currentText.textBottom, {
			font: font,
			size: currentText.size.bottom,
			height: this.simulationObject.heightText,
			curveSegments: 4,
		});
        geometryTop.computeBoundingBox();
        geometryBottom.computeBoundingBox();
        var centerOffsetTop = -0.5 * (geometryTop.boundingBox.max.x - geometryTop.boundingBox.min.x);
        var centerOffsetBottom = -0.5 * (geometryBottom.boundingBox.max.x - geometryBottom.boundingBox.min.x);

        var materials = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
        var textMesh = {
            top: new THREE.Mesh(geometryTop, materials),
            bottom: new THREE.Mesh(geometryBottom, materials)
        };

        textMesh.top.position.setZ(-700);
        textMesh.top.position.setY(750);
        textMesh.top.position.setX(centerOffsetTop)

        textMesh.bottom.position.setZ(250);
        textMesh.bottom.position.setY(-200);
        textMesh.bottom.position.setX(centerOffsetBottom);
        textMesh.bottom.rotation.x = -Math.PI/8;

		return textMesh;
    }

    onFrameRenderered() {
        var obj = this;
        if (this.simulationObject.currentTextId >= 0) {
            this.textMeshList[this.simulationObject.currentTextId].top.traverse(function (object) { object.visible = obj.simulationObject.engine.displayText; } );
            this.textMeshList[this.simulationObject.currentTextId].bottom.traverse(function (object) { object.visible = obj.simulationObject.engine.displayText; } );
        }

        if (this.simulationObject.magnet.magnetization > 0 && this.simulationObject.currentTextId == 0) {
            this.loadText(1)
        }
    }
}
