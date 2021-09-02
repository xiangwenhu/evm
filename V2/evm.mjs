
import EventEmitter from "../EventEmitter.mjs";
import EvmEventsMap from "./evmEventsMap.mjs";
import { createRevocableProxy, createApplyHanlder } from "./util.mjs"

// 保留原始的原型
const orgEventTargetPro = { ...EventTarget.prototype };

export default class EVM {

  #ep = EventTarget.prototype;
  #rvAdd;
  #rvRemove;
  #emitter = new EventEmitter();
  #eventsMap = new EvmEventsMap();

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

  offAll() {
    this.#emitter.offAll();
  }

  #innerAddCallback = (...args) => {
    this.#eventsMap.add(...args);
    this.#emitter.emit("on-add", ...args)
  }

  #innerRemoveCallback = (...args) => {
    this.#eventsMap.remove(...args);
    this.#emitter.emit("on-remove", ...args)
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

  getData() {
    return this.#eventsMap.getData();
  }

}