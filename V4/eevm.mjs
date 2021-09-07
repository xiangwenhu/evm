
import BaseEvm from "./baseEvm.mjs";
import { createApplyHanlder, createRevocableProxy, delay, isFunction } from "./util.mjs";

// 保留原始的原型
const orgEventTargetPro = { ...EventTarget.prototype };

const toString = Object.prototype.toString

export default class EEVM  extends BaseEvm {

  constructor(options = {}){
    super(options);
  }

  #ep = EventTarget.prototype;
  #rvAdd;
  #rvRemove;

  watch() {
    this.#rvAdd = createRevocableProxy(this.#ep.addEventListener,
      createApplyHanlder(this.innerAddCallback));
    this.#ep.addEventListener = this.#rvAdd.proxy;

    this.#rvRemove = createRevocableProxy(this.#ep.removeEventListener,
      createApplyHanlder(this.innerRemoveCallback));
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

  async statistics() {

    if (isFunction(window.gc)) {
      window.gc();
    }

    const { run } = delay(undefined, 1000);

    await run();

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

}