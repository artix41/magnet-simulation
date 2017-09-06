(function () {
'use strict';

var babelHelpers = {};




var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





















babelHelpers;

var RenderingContext = function () {
    function RenderingContext(scene, camera, renderer, controls) {
        classCallCheck(this, RenderingContext);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
    }

    createClass(RenderingContext, null, [{
        key: "getDefault",
        value: function getDefault(containerElement) {
            var width = window.innerWidth,
                height = window.innerHeight;
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
            var renderer = new THREE.WebGLRenderer();
            var controls = new THREE.TrackballControls(camera);

            camera.position.z = 20;
            renderer.setSize(width, height);
            scene.add(new THREE.AmbientLight(0x333333));

            var light = new THREE.DirectionalLight(0xffffff, 1);

            light.position.set(15, 15, 15);
            scene.add(light);

            containerElement.appendChild(renderer.domElement);

            return new RenderingContext(scene, camera, renderer, controls);
        }
    }]);
    return RenderingContext;
}();

var MainView = function () {
    function MainView(controller, engine) {
        classCallCheck(this, MainView);

        this.controller = controller;
        this.engine = engine;
        this.renderingContext = this.createRenderingContext();
    }

    createClass(MainView, [{
        key: 'createRenderingContext',
        value: function createRenderingContext() {
            var domContainer = document.createElement('div');

            document.body.appendChild(domContainer);

            return RenderingContext.getDefault(domContainer);
        }
    }, {
        key: 'initialize',
        value: function initialize() {
            this.render();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this = this;

            requestAnimationFrame(function () {
                return _this.render();
            });
            this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);
        }
    }, {
        key: 'onWindowResize',
        value: function onWindowResize() {
            this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
            this.renderingContext.camera.updateProjectionMatrix();

            this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }]);
    return MainView;
}();

var EngineController = function EngineController(engine) {
    classCallCheck(this, EngineController);

    this.engine = engine;
    this.view = new MainView(this, engine);
    this.view.initialize();
};

var Observable = function () {
    function Observable() {
        classCallCheck(this, Observable);

        this.observers = new Map();
    }

    createClass(Observable, [{
        key: "addObserver",
        value: function addObserver(label, callback) {
            this.observers.has(label) || this.observers.set(label, []);
            this.observers.get(label).push(callback);
        }
    }, {
        key: "emit",
        value: function emit(label, e) {
            var observers = this.observers.get(label);

            if (observers && observers.length) {
                observers.forEach(function (callback) {
                    callback(e);
                });
            }
        }
    }]);
    return Observable;
}();

var SimulationObject = function (_Observable) {
    inherits(SimulationObject, _Observable);

    function SimulationObject(name) {
        var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        classCallCheck(this, SimulationObject);

        var _this = possibleConstructorReturn(this, (SimulationObject.__proto__ || Object.getPrototypeOf(SimulationObject)).call(this));

        _this.name = name;
        _this.properties = properties;
        return _this;
    }

    return SimulationObject;
}(Observable);

var Engine = function (_SimulationObject) {
    inherits(Engine, _SimulationObject);

    function Engine(name, properties) {
        classCallCheck(this, Engine);

        var _this = possibleConstructorReturn(this, (Engine.__proto__ || Object.getPrototypeOf(Engine)).call(this, name, properties));

        _this.className = 'Engine';
        return _this;
    }

    return Engine;
}(SimulationObject);

var engine = new Engine('Curie Engine');
var engineController = new EngineController(engine);

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uL3NyYy92aWV3L3JlbmRlcmluZ0NvbnRleHQuanMiLCIuLi9zcmMvdmlldy9tYWluVmlldy5qcyIsIi4uL3NyYy9jb250cm9sbGVyL2VuZ2luZUNvbnRyb2xsZXIuanMiLCIuLi9zcmMvb2JzZXJ2YWJsZS5qcyIsIi4uL3NyYy9tb2RlbC9zaW11bGF0aW9uT2JqZWN0LmpzIiwiLi4vc3JjL21vZGVsL2VuZ2luZS5qcyIsIi4uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmluZ0NvbnRleHQge1xuICAgIGNvbnN0cnVjdG9yKHNjZW5lLCBjYW1lcmEsIHJlbmRlcmVyLCBjb250cm9scykge1xuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XG4gICAgICAgIHRoaXMuY2FtZXJhID0gY2FtZXJhO1xuICAgICAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0RGVmYXVsdChjb250YWluZXJFbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGgsIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgY29uc3Qgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDQ1LCB3aWR0aCAvIGhlaWdodCwgMC4wMSwgMTAwMCk7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgY29uc3QgY29udHJvbHMgPSBuZXcgVEhSRUUuVHJhY2tiYWxsQ29udHJvbHMoY2FtZXJhKTtcblxuICAgICAgICBjYW1lcmEucG9zaXRpb24ueiA9IDIwO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICBzY2VuZS5hZGQobmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDMzMzMzMykpO1xuXG4gICAgICAgIGNvbnN0IGxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDEpO1xuXG4gICAgICAgIGxpZ2h0LnBvc2l0aW9uLnNldCgxNSwxNSwxNSk7XG4gICAgICAgIHNjZW5lLmFkZChsaWdodCk7XG5cbiAgICAgICAgY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgICByZXR1cm4gbmV3IFJlbmRlcmluZ0NvbnRleHQoc2NlbmUsIGNhbWVyYSwgcmVuZGVyZXIsIGNvbnRyb2xzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUmVuZGVyaW5nQ29udGV4dCBmcm9tICcuL3JlbmRlcmluZ0NvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWluVmlldyB7XG4gICAgY29uc3RydWN0b3IoY29udHJvbGxlciwgZW5naW5lKSB7XG4gICAgICAgIHRoaXMuY29udHJvbGxlciA9IGNvbnRyb2xsZXI7XG4gICAgICAgIHRoaXMuZW5naW5lID0gZW5naW5lO1xuICAgICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLmNyZWF0ZVJlbmRlcmluZ0NvbnRleHQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVSZW5kZXJpbmdDb250ZXh0KCkge1xuICAgICAgICBjb25zdCBkb21Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvbUNvbnRhaW5lcik7XG5cbiAgICAgICAgcmV0dXJuIFJlbmRlcmluZ0NvbnRleHQuZ2V0RGVmYXVsdChkb21Db250YWluZXIpO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgcmVuZGVyKCkge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gdGhpcy5yZW5kZXIoKSk7XG4gICAgICAgIHRoaXMucmVuZGVyaW5nQ29udGV4dC5yZW5kZXJlci5yZW5kZXIodGhpcy5yZW5kZXJpbmdDb250ZXh0LnNjZW5lLCB0aGlzLnJlbmRlcmluZ0NvbnRleHQuY2FtZXJhKTtcbiAgICB9XG5cbiAgICBvbldpbmRvd1Jlc2l6ZSgpe1xuICAgICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgICAgICB0aGlzLnJlbmRlcmluZ0NvbnRleHQucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTWFpblZpZXcgZnJvbSAnLi4vdmlldy9tYWluVmlldyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVuZ2luZUNvbnRyb2xsZXIge1xuICAgIGNvbnN0cnVjdG9yKGVuZ2luZSkge1xuICAgICAgICB0aGlzLmVuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgdGhpcy52aWV3ID0gbmV3IE1haW5WaWV3KHRoaXMsIGVuZ2luZSk7XG4gICAgICAgIHRoaXMudmlldy5pbml0aWFsaXplKCk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT2JzZXJ2YWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIGFkZE9ic2VydmVyKGxhYmVsLCBjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm9ic2VydmVycy5oYXMobGFiZWwpIHx8IHRoaXMub2JzZXJ2ZXJzLnNldChsYWJlbCwgW10pO1xuICAgICAgICB0aGlzLm9ic2VydmVycy5nZXQobGFiZWwpLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGVtaXQobGFiZWwsIGUpIHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZXJzID0gdGhpcy5vYnNlcnZlcnMuZ2V0KGxhYmVsKTtcblxuICAgICAgICBpZiAob2JzZXJ2ZXJzICYmIG9ic2VydmVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG9ic2VydmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCBPYnNlcnZhYmxlIGZyb20gJy4uL29ic2VydmFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW11bGF0aW9uT2JqZWN0IGV4dGVuZHMgT2JzZXJ2YWJsZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgcHJvcGVydGllcyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IFNpbXVsYXRpb25PYmplY3QgZnJvbSAnLi9zaW11bGF0aW9uT2JqZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIGV4dGVuZHMgU2ltdWxhdGlvbk9iamVjdCB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgcHJvcGVydGllcykge1xuICAgICAgICBzdXBlcihuYW1lLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgdGhpcy5jbGFzc05hbWUgPSAnRW5naW5lJztcbiAgICB9XG59XG4iLCJpbXBvcnQgRW5naW5lQ29udHJvbGxlciBmcm9tICcuL2NvbnRyb2xsZXIvZW5naW5lQ29udHJvbGxlcic7XG5pbXBvcnQgRW5naW5lIGZyb20gJy4vbW9kZWwvZW5naW5lJztcblxuY29uc3QgZW5naW5lID0gbmV3IEVuZ2luZSgnQ3VyaWUgRW5naW5lJyk7XG5jb25zdCBlbmdpbmVDb250cm9sbGVyID0gbmV3IEVuZ2luZUNvbnRyb2xsZXIoZW5naW5lKTtcbiJdLCJuYW1lcyI6WyJSZW5kZXJpbmdDb250ZXh0Iiwic2NlbmUiLCJjYW1lcmEiLCJyZW5kZXJlciIsImNvbnRyb2xzIiwiY29udGFpbmVyRWxlbWVudCIsIndpZHRoIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImhlaWdodCIsImlubmVySGVpZ2h0IiwiVEhSRUUiLCJTY2VuZSIsIlBlcnNwZWN0aXZlQ2FtZXJhIiwiV2ViR0xSZW5kZXJlciIsIlRyYWNrYmFsbENvbnRyb2xzIiwicG9zaXRpb24iLCJ6Iiwic2V0U2l6ZSIsImFkZCIsIkFtYmllbnRMaWdodCIsImxpZ2h0IiwiRGlyZWN0aW9uYWxMaWdodCIsInNldCIsImFwcGVuZENoaWxkIiwiZG9tRWxlbWVudCIsIk1haW5WaWV3IiwiY29udHJvbGxlciIsImVuZ2luZSIsInJlbmRlcmluZ0NvbnRleHQiLCJjcmVhdGVSZW5kZXJpbmdDb250ZXh0IiwiZG9tQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiYm9keSIsImdldERlZmF1bHQiLCJyZW5kZXIiLCJhc3BlY3QiLCJ1cGRhdGVQcm9qZWN0aW9uTWF0cml4IiwiRW5naW5lQ29udHJvbGxlciIsInZpZXciLCJpbml0aWFsaXplIiwiT2JzZXJ2YWJsZSIsIm9ic2VydmVycyIsIk1hcCIsImxhYmVsIiwiY2FsbGJhY2siLCJoYXMiLCJnZXQiLCJwdXNoIiwiZSIsImxlbmd0aCIsImZvckVhY2giLCJTaW11bGF0aW9uT2JqZWN0IiwibmFtZSIsInByb3BlcnRpZXMiLCJFbmdpbmUiLCJjbGFzc05hbWUiLCJlbmdpbmVDb250cm9sbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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
