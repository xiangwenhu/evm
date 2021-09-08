
import EventEmitter from "../EventEmitter.mjs";
import EvmEventsMap from "./evmEventsMap.mjs";
import { boolenFalse, isFunction } from "./util.mjs";


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
  #emitter = new EventEmitter();
  #eventsMap = new EvmEventsMap();
  constructor(options = {}) {
    this.options = {
      ...DEFAUL_OPTIONS,
      ...options
    };

    this.innerAddCallback = this.innerAddCallback.bind(this);
    this.innerRemoveCallback = this.innerRemoveCallback.bind(this);
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

  innerAddCallback(target, event, listener, options) {

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
      console.warn(toString.call(target), " ExtremelyItems: type:", event, " name:" + listener.name, "options: " + options);
    }

    // console.log("add:", Object.prototype.toString.call(target), event);

    if (!this.#eventsMap.hasByTarget(target)) {
      let weakRefTarget = new WeakRef(target);
      argList[0] = weakRefTarget;
      this.#listenerRegistry.register(target, { weakRefTarget });
    }

    this.#eventsMap.addListener(...argList);
    // this.#emitter.emit("on-add", ...argList);

  }

  innerRemoveCallback(target, event, listener, options) {

    const { isInWhiteList, isSameOptions } = this.options;
    if (!isInWhiteList(target, event, listener, options)) {
      return;
    }

    const argList = [target, event, listener, options];
    if (!isFunction(listener)) {
      return console.warn("EVM::innerAddCallback listener must be a function");
    }

    if (!this.#eventsMap.hasByTarget(target)) {
      return;
    }
    // console.log("remove:", Object.prototype.toString.call(target), event);

    this.#eventsMap.removeListener(...argList);
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
    throw new Error("not implemented")
  }

  cancelWatch() {
    throw new Error("not implemented")
  }

  get data() {
    return this.#eventsMap.data;
  }

  async statistics() {
    throw new Error("not implemented")
  }

}