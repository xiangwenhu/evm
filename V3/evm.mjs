
import EventEmitter from "../EventEmitter.mjs";
import EvmEventsMap from "./evmEventsMap.mjs";
import {
  createRevocableProxy, createApplyHanlder, isFunction,
  isSameStringifyObject, boolenFalse
} from "./util.mjs"

// 保留原始的原型
const orgEventTargetPro = { ...EventTarget.prototype };


const DEFAUL_OPTIONS = {
  /**
   * 选项相同判断函数
   */
  // isSameOptions: isSameStringifyObject,
  /**
   * 白名单判断函数
   */
  isInWhiteList: boolenFalse
}


const toString = Object.prototype.toString

export default class EVM {
  #ep = EventTarget.prototype;
  #rvAdd;
  #rvRemove;
  #emitter = new EventEmitter();
  #eventsMap = new EvmEventsMap();
  constructor(options = {}) {
    this.options = {
      ...DEFAUL_OPTIONS,
      ...options
    };
  }

  #listenerRegistry = new FinalizationRegistry(
    ({ weakRefTarget }) => {
      console.log("clean up ------------------");
      if (!weakRefTarget) {
        return;
      }
      this.#eventsMap.remove(weakRefTarget);
      console.log("length", [...this.#eventsMap.data.keys()].length);
    }
  )

  #innerAddCallback = (target, event, listener, options) => {

    const { isInWhiteList, isSameOptions } = this.options;
    const argList = [target, event, listener, options];

    if (!isInWhiteList(target, event, listener, options)) {
      return;
    }

    if (!isFunction(listener)) {
      return console.warn("EVM::innerAddCallback listener must be a function");
    }

    const eItems = this.#eventsMap.getExtremelyItems(...argList, isSameOptions);
    if (Array.isArray(eItems) && eItems.length > 0) {
      console.warn(event, target, " hasSamgeItems: type:", event, " name:" + listener.name, "options: " + options);
    }

    // console.log("add:", Object.prototype.toString.call(target), event);

    if (!this.#eventsMap.hasByTarget(target)) {
      let weakRefTarget = new WeakRef(target);
      argList[0] = weakRefTarget;
      this.#listenerRegistry.register(target, { weakRefTarget });
    }

    this.#eventsMap.add(...argList);
    // this.#emitter.emit("on-add", ...argList);

  }

  #innerRemoveCallback = (target, event, listener, options) => {

    const argList = [target, event, listener, options];
    if (!isFunction(listener)) {
      return console.warn("EVM::innerAddCallback listener must be a function");
    }

    if (!this.#eventsMap.hasByTarget(target)) {
      return;
    }
    // console.log("remove:", Object.prototype.toString.call(target), event);

    this.#eventsMap.remove(...argList);
    // this.#emitter.emit("on-remove", ...argList)
  }


  onAdd(fn) {
    this.#emitter.on("on-add", fn)
  }

  offAdd(fn) {
    this.#emitter.off("on-add", fn)
  }

  onRemove(fn) {
    this.#emitter.on("on-remove", fn)
  }

  offRemove() {
    this.#emitter.off("on-remove", fn)
  }

  onAlarm(fn) {
    this.#emitter.on("on-alarm", fn)
  }

  offAlarm(fn) {
    this.#emitter.off("on-alarm", fn)
  }

  offAll() {
    this.#emitter.offAll();
  }


  watch() {
    this.#rvAdd = createRevocableProxy(this.#ep.addEventListener,
      createApplyHanlder(this.#innerAddCallback));
    this.#ep.addEventListener = this.#rvAdd.proxy;

    this.#rvRemove = createRevocableProxy(this.#ep.removeEventListener,
      createApplyHanlder(this.#innerRemoveCallback));
    this.#ep.removeEventListener = this.#rvRemove.proxy;

    return () => this.cancelWatch();
  }

  cancelWatch() {
    if (this.#rvAdd) {
      this.#rvAdd.revoke();
    }
    this.#ep.addEventListener = orgEventTargetPro.addEventListener;

    if (this.#rvRemove) {
      this.#rvRemove.revoke();
    }
    this.#ep.removeEventListener = orgEventTargetPro.removeEventListener;
  }

  get data() {
    return this.#eventsMap.data;
  }

  statistics() {

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
          obj[cur] = events[cur].length
          return obj
        }, Object.create(null))
      }
    })

    return d;
  }

}