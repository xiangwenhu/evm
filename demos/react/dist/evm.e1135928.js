// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"V3/EventEmitter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function isListener(listener) {
  if (typeof listener === 'function') {
    return true;
  }

  return false;
}

var pureObject = Object.create(null);

var _events = /*#__PURE__*/new WeakMap();

var _addListener = /*#__PURE__*/new WeakSet();

var _removeListener = /*#__PURE__*/new WeakSet();

var EventEmitter = /*#__PURE__*/function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    _removeListener.add(this);

    _addListener.add(this);

    _events.set(this, {
      writable: true,
      value: pureObject
    });
  }

  _createClass(EventEmitter, [{
    key: "on",
    value: function on(event, listener) {
      _classPrivateMethodGet(this, _addListener, _addListener2).call(this, event, listener, false);

      return this;
    }
  }, {
    key: "once",
    value: function once(event, listener) {
      _classPrivateMethodGet(this, _addListener, _addListener2).call(this, event, listener, true);

      return this;
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      _classPrivateMethodGet(this, _removeListener, _removeListener2).call(this, event, listener);

      return this;
    }
  }, {
    key: "offAll",
    value: function offAll(eventName) {
      if (eventName && _classPrivateFieldGet(this, _events)[eventName]) {
        _classPrivateFieldGet(this, _events)[eventName] = [];
      } else {
        _classPrivateFieldSet(this, _events, pureObject);
      }

      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var listeners = _classPrivateFieldGet(this, _events)[event];

      if (!listeners) return;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];

        if (!listener) {
          continue;
        }

        listener.listener.apply(this, args); // TODO??

        if (listener.once && _classPrivateMethodGet(this, _removeListener, _removeListener2).call(this, event, listener.listener)) {
          i--;
        }
      }

      return this;
    }
  }]);

  return EventEmitter;
}();

exports.default = EventEmitter;

function _addListener2(event, listener, once) {
  if (!event || !listener) return false;

  if (!isListener(listener)) {
    throw new TypeError('listener must be a function');
  }

  var listeners = _classPrivateFieldGet(this, _events)[event] = _classPrivateFieldGet(this, _events)[event] || [];
  listeners.push({
    listener: listener,
    once: once
  });
  return true;
}

function _removeListener2(event, listener) {
  var listeners = _classPrivateFieldGet(this, _events)[event];

  if (!listeners) return false;
  var index = listeners.findIndex(function (l) {
    return l.listener === listener;
  }); // 如果不是 -1， ~-1 =  -(-1 + 1) = 0

  if (~index) {
    listeners.splice(index, 1);
    return true;
  }

  return false;
}
},{}],"V3/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPureObject = createPureObject;
exports.createRevocableProxy = createRevocableProxy;
exports.createApplyHanlder = createApplyHanlder;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * 创建纯净对象
 * @returns 
 */
function createPureObject() {
  return Object.create(null);
}
/**
 * 创建可取消的代理
 * @param obj 
 * @param handler 
 * @returns 
 */


function createRevocableProxy(obj, handler) {
  return Proxy.revocable(obj, handler);
}
/**
 * 创建拦截函数调用的代理
 * @param callback 
 * @returns 
 */


function createApplyHanlder(callback) {
  return {
    apply: function apply(target, ctx, args) {
      callback.apply(void 0, _toConsumableArray([ctx].concat(args)));
      return Reflect.apply.apply(Reflect, arguments);
    }
  };
}
},{}],"V3/evmEventsMap.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("./util.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var _wp = /*#__PURE__*/new WeakMap();

var EvmEventsMap = /*#__PURE__*/function () {
  function EvmEventsMap() {
    _classCallCheck(this, EvmEventsMap);

    _wp.set(this, {
      writable: true,
      value: new WeakMap()
    });
  }

  _createClass(EvmEventsMap, [{
    key: "add",
    value: function add(target, event, fn) {
      var wp = _classPrivateFieldGet(this, _wp);

      var t = wp.get(target);

      if (!t) {
        t = (0, _util.createPureObject)();
        wp.set(target, t);
      }

      if (!t[event]) {
        t[event] = [];
      }

      t[event].push(fn);
    }
  }, {
    key: "remove",
    value: function remove(target, event, fn) {
      var wp = _classPrivateFieldGet(this, _wp);

      var t = wp.get(target);

      if (!t) {
        return;
      }

      if (!t[event]) {
        return;
      }

      var index = t[event].findIndex(function (f) {
        return f === fn;
      });

      if (index >= 0) {
        t[event].splice(index, 1);
      }

      if (t[event].length === 0) {
        delete t[event];
      }

      if (Object.keys(t).length === 0) {
        wp.delete(target);
      }
    }
  }, {
    key: "getData",
    value: function getData() {
      return _classPrivateFieldGet(this, _wp);
    }
  }]);

  return EvmEventsMap;
}();

exports.default = EvmEventsMap;
},{"./util.js":"V3/util.js"}],"V3/evm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _EventEmitter = _interopRequireDefault(require("./EventEmitter.js"));

var _evmEventsMap = _interopRequireDefault(require("./evmEventsMap.js"));

var _util = require("./util.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 保留原始的原型
var orgEventTargetPro = _objectSpread({}, EventTarget.prototype);

var _ep = /*#__PURE__*/new WeakMap();

var _rvAdd = /*#__PURE__*/new WeakMap();

var _rvRemove = /*#__PURE__*/new WeakMap();

var _emitter = /*#__PURE__*/new WeakMap();

var _eventsMap = /*#__PURE__*/new WeakMap();

var _innerAddCallback = /*#__PURE__*/new WeakMap();

var _innerRemoveCallback = /*#__PURE__*/new WeakMap();

var EVM = /*#__PURE__*/function () {
  function EVM() {
    var _this = this;

    _classCallCheck(this, EVM);

    _ep.set(this, {
      writable: true,
      value: EventTarget.prototype
    });

    _rvAdd.set(this, {
      writable: true,
      value: void 0
    });

    _rvRemove.set(this, {
      writable: true,
      value: void 0
    });

    _emitter.set(this, {
      writable: true,
      value: new _EventEmitter.default()
    });

    _eventsMap.set(this, {
      writable: true,
      value: new _evmEventsMap.default()
    });

    _innerAddCallback.set(this, {
      writable: true,
      value: function value() {
        var _classPrivateFieldGet2, _classPrivateFieldGet3;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        (_classPrivateFieldGet2 = _classPrivateFieldGet(_this, _eventsMap)).add.apply(_classPrivateFieldGet2, args);

        (_classPrivateFieldGet3 = _classPrivateFieldGet(_this, _emitter)).emit.apply(_classPrivateFieldGet3, ["on-add"].concat(args));
      }
    });

    _innerRemoveCallback.set(this, {
      writable: true,
      value: function value() {
        var _classPrivateFieldGet4, _classPrivateFieldGet5;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        (_classPrivateFieldGet4 = _classPrivateFieldGet(_this, _eventsMap)).remove.apply(_classPrivateFieldGet4, args);

        (_classPrivateFieldGet5 = _classPrivateFieldGet(_this, _emitter)).emit.apply(_classPrivateFieldGet5, ["on-remove"].concat(args));
      }
    });
  }

  _createClass(EVM, [{
    key: "onAdd",
    value: function onAdd(fn) {
      _classPrivateFieldGet(this, _emitter).on("on-add", fn);
    }
  }, {
    key: "offAdd",
    value: function offAdd(fn) {
      _classPrivateFieldGet(this, _emitter).off("on-add", fn);
    }
  }, {
    key: "onRemove",
    value: function onRemove(fn) {
      _classPrivateFieldGet(this, _emitter).on("on-remove", fn);
    }
  }, {
    key: "offRemove",
    value: function offRemove() {
      _classPrivateFieldGet(this, _emitter).off("on-remove", fn);
    }
  }, {
    key: "offAll",
    value: function offAll() {
      _classPrivateFieldGet(this, _emitter).offAll();
    }
  }, {
    key: "watch",
    value: function watch() {
      var _this2 = this;

      _classPrivateFieldSet(this, _rvAdd, (0, _util.createRevocableProxy)(_classPrivateFieldGet(this, _ep).addEventListener, (0, _util.createApplyHanlder)(_classPrivateFieldGet(this, _innerAddCallback))));

      _classPrivateFieldGet(this, _ep).addEventListener = _classPrivateFieldGet(this, _rvAdd).proxy;

      _classPrivateFieldSet(this, _rvRemove, (0, _util.createRevocableProxy)(_classPrivateFieldGet(this, _ep).removeEventListener, (0, _util.createApplyHanlder)(_classPrivateFieldGet(this, _innerRemoveCallback))));

      _classPrivateFieldGet(this, _ep).removeEventListener = _classPrivateFieldGet(this, _rvRemove).proxy;
      return function () {
        return _this2.cancelWatch();
      };
    }
  }, {
    key: "cancelWatch",
    value: function cancelWatch() {
      if (_classPrivateFieldGet(this, _rvAdd)) {
        _classPrivateFieldGet(this, _rvAdd).revoke();
      }

      _classPrivateFieldGet(this, _ep).addEventListener = orgEventTargetPro.addEventListener;

      if (_classPrivateFieldGet(this, _rvRemove)) {
        _classPrivateFieldGet(this, _rvRemove).revoke();
      }

      _classPrivateFieldGet(this, _ep).removeEventListener = orgEventTargetPro.removeEventListener;
    }
  }, {
    key: "getData",
    value: function getData() {
      return _classPrivateFieldGet(this, _eventsMap).getData();
    }
  }]);

  return EVM;
}();

exports.default = EVM;
},{"./EventEmitter.js":"V3/EventEmitter.js","./evmEventsMap.js":"V3/evmEventsMap.js","./util.js":"V3/util.js"}],"node_modules/_parcel-bundler@1.12.5@parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55287" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/_parcel-bundler@1.12.5@parcel-bundler/src/builtins/hmr-runtime.js","V3/evm.js"], null)
//# sourceMappingURL=/evm.e1135928.js.map