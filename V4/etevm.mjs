
import BaseEvm from "./baseEvm.mjs";
import {
  createApplyHanlder, createRevocableProxy, delay, isFunction, boolenTrue, hasOwnProperty,
  isObject, createPureObject
} from "./util.mjs";

const toString = Object.prototype.toString

const DEFAULT_OPTIONS = {
  isInWhiteList: boolenTrue
}

const ADD_PROPERTIES = ["addListener", "addEventListener", "on", "prependListener"];
const REMOVE_PROPERTIES = ["removeListener", "removeEventListener", "off"];

export default class ETEVM extends BaseEvm {

  #watched = false;
  #orgEvPrototype;
  #rpList = [];
  #evPrototype;

  constructor(prototype = EventTarget.prototype, options = {}) {
    super({
      ...DEFAULT_OPTIONS,
      ...options
    });

    if (!isObject(prototype)) {
      throw new Error("参数prototype必须是一个有效的对象")
    }
    this.#orgEvPrototype = { ...prototype };
    this.#evPrototype = prototype;

  }

  #getListenr(listener) {
    if (isFunction(listener.listener)) {
      return listener.listener
    }
    return listener;
  }

  #innerAddCallback = (target, event, listener, options) => {
    return super.innerAddCallback(target, event, this.#getListenr(listener), options);
  }

  #innerRemoveCallback = (target, event, listener, options) => {
    return super.innerRemoveCallback(target, event, this.#getListenr(listener), options);
  }

  #createFunProxy(oriFun, callback) {
    if (!isFunction(oriFun)) {
      return console.log("createFunProxy:: oriFun should be a function");
    }

    const rProxy = createRevocableProxy(oriFun,
      createApplyHanlder(callback));

    return rProxy;
  }

  #checkAndProxy(ckProperties, callback, proxyProperties = ckProperties) {
    let fn;
    const ep = this.#evPrototype;

    // 检查方法
    for (let i = 0; i < ckProperties.length; i++) {
      if (!hasOwnProperty(ep, ckProperties[i])) {
        continue;
      }
      fn = this.#evPrototype[ckProperties[i]];
      if (isFunction(fn)) {
        break;
      }

    }

    if (!isFunction(fn)) {
      return false;
    }

    const rpProxy = this.#createFunProxy(fn, callback);
    if (!rpProxy) {
      return false;
    }

    // 替换方法
    proxyProperties.forEach(pname => {
      if (hasOwnProperty(ep, pname) && isFunction(this.#evPrototype[pname])) {
        this.#evPrototype[pname] = rpProxy.proxy
      }
    })
    // 收集
    this.#rpList.push(rpProxy);
  }

  #restoreProperties() {
    ADD_PROPERTIES.forEach(pname => {
      if (hasOwnProperty(ep, pname) && isFunction(this.#evPrototype[pname])) {
        this.#evPrototype[pname] = this.#orgEvPrototype[pname]
      }
    })

    REMOVE_PROPERTIES.forEach(pname => {
      if (hasOwnProperty(ep, pname) && isFunction(this.#evPrototype[pname])) {
        this.#evPrototype[pname] = this.#orgEvPrototype[pname]
      }
    })
  }

  watch() {

    if (this.#watched) {
      return console.error("watched")
    }

    this.#watched = true;

    // addListener addEventListener on prependListener
    this.#checkAndProxy(ADD_PROPERTIES, this.#innerAddCallback);

    // removeListener removeEventListener off
    this.#checkAndProxy(REMOVE_PROPERTIES, this.#innerRemoveCallback);

    return () => this.cancelWatch();
  }

  cancelWatch() {

    this.#restoreProperties();
    this.#rpList.forEach(rp => rp.revoke());
    this.#rpList = [];

    this.#watched = false
  }

  async #gc() {
    if (isFunction(window.gc)) {
      window.gc();
    }

    const { run } = delay(undefined, 1000);

    await run();
  }

  async statistics() {

    await this.#gc();

    const data = this.data;
    const keys = [...data.keys()];
    const d = keys.map(wr => {
      const el = wr.deref();
      if (!el) return null;

      const events = data.get(wr);
      return {
        type: toString.call(el),
        id: el.id,
        class: el.className,
        events: Object.keys(events).reduce((obj, cur) => {
          obj[cur] = events[cur].map(e => {
            const fn = e.listener.deref();
            if (!fn) return null;
            return fn.name;
          }).filter(Boolean)
          return obj
        }, Object.create(null))
      }
    })

    return d;
  }

  #getExtremelyListeners(eventsInfo = []) {
    const map = new Map();
    let listener, listenerStr, listenerKeyStr;
    let info;
    for (let i = 0; i < eventsInfo.length; i++) {
      info = 0;
      const eInfo = eventsInfo[i];
      listener = eInfo.listener.deref();
      // 被回收了
      if (!listener) {
        continue;
      }
      // 函数 + options
      listenerStr = listener.toString();
      listenerKeyStr = listenerStr + ` %s----%s ${eInfo.options}`
      info = map.get(listenerKeyStr);
      if (!info) {
        map.set(listenerKeyStr, {
          listener: listenerStr,
          count: 1,
          options: eInfo.options
        })
      } else {
        info.count++
      }
    }

    return [...map.values()].filter(v => v.count > 1);
  }

  async getExtremelyItems() {

    await this.#gc();

    const data = this.data;
    const keys = [...data.keys()];

    const d = keys.map(wr => {
      const el = wr.deref();
      if (!el) return null;

      const eventsObj = data.get(wr);
      const events = Object.keys(eventsObj).reduce((obj, cur) => {
        obj[cur] = this.#getExtremelyListeners(eventsObj[cur]);
        return obj
      }, Object.create(null));

      return Object.keys(events).length > 0 ? createPureObject({
        type: toString.call(el),
        id: el.id,
        class: el.className,
        events
      }) : null
    }).filter(Boolean)

    return d;

  }

}