
import EventEmitter from "../EventEmitter.mjs";

// 保留原始的原型
const orgEventTargetPro = { ...EventTarget.prototype };

const callback = () => { };

function createRevocableProxy(obj, handler) {
  return Proxy.revocable(obj, handler);
}

function createApplyHanlder(callback) {
  return {
    apply(target, ctx, args) {
      callback(...[ctx].concat(args));
      return Reflect.apply(...arguments);
    }
  }
}


export default class EVM {

  #ep = EventTarget.prototype;
  #rvAdd;
  #rvRemove;
  #events = new EventEmitter();

  onAdd(fn) {
    this.#events.on("on-add", fn)
  }

  offAdd(fn) {
    this.#events.off("on-add", fn)
  }

  onRemove(fn) {
    this.#events.on("on-remove", fn)
  }

  offRemove() {
    this.#events.off("on-remove", fn)
  }

  offAll() {
    this.#events.offAll();
  }

  #innerAddCallback = (...args) => {
    this.#events.emit("on-add", ...args)
  }

  #innerRemoveCallback = (...args) =>  {
    this.#events.emit("on-remove", ...args)
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
    ep.addEventListener = orgEventTargetPro.addEventListener;

    if (this.#rvRemove) {
      this.#rvRemove.revoke();
    }
    ep.removeEventListener = orgEventTargetPro.removeEventListener;
  }


}