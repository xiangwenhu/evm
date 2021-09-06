
import EventEmitter from "../EventEmitter.mjs";
import EvmEventsMap from "./evmEventsMap.mjs";
import {
  createRevocableProxy, createApplyHanlder, isFunction,
  isSameStringifyObject, isSameFunction, boolenFalse
} from "./util.mjs"

// 保留原始的原型
const orgEventTargetPro = { ...EventTarget.prototype };


const DEFAUL_OPTIONS = {
  /**
   * 选项相同判断函数
   */
  isSameOptions: isSameStringifyObject,
  /**
   * 白名单判断函数
   */
  isInWhiteList: boolenFalse
}

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

    const { isInWhiteList } = this.options;
    const argList = [target, event, listener, options];

    if (!isInWhiteList(target, event, listener, options)) {
      return;
    }

    if (!isFunction(listener)) {
      return console.warn("EVM::innerAddCallback listener must be a function");
    }

    // const sameItems = this.#getSameItems(...argList);
    // if (Array.isArray(sameItems) && sameItems.length > 0) {
    //   // console.warn(event, target, " hasSamgeItems:", sameItems);
    // }

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
    this.#eventsMap.remove(...argList);
    // this.#emitter.emit("on-remove", ...argList)
  }

  #getSameItems(target, event, listener, options) {

    if (!this.#eventsMap.hasListener(target, event, listener, options)) {
      return null;
    }
    const { isSameOptions } = this.options;
    const listeners = this.#eventsMap.data.get(target)[event];
    const items = listeners.filter(l => isSameFunction(l.listener, listener, true) && isSameOptions(l.options, options));
    return items;
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

  getAlarmData() {

  }

}