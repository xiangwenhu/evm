
import BaseEvm from "../BaseEvm";
import { BaseEvmOptions, EVMBaseEventListener, ListenerWrapper } from "../types";
import { boolenTrue, isFunction, isObject } from "../util";

const DEFAULT_OPTIONS = {
  isInWhiteList: boolenTrue
}

const ADD_PROPERTIES = ["addListener", "addEventListener", "on", "prependListener"];
const REMOVE_PROPERTIES = ["removeListener", "removeEventListener", "off"];

export default class EventsEVM extends BaseEvm {

  protected orgEt: any;
  protected rpList: {
    proxy: object;
    revoke: () => void;
  }[] = [];
  protected et: any;

  constructor(options: BaseEvmOptions = DEFAULT_OPTIONS, et: any) {
    super({
      ...DEFAULT_OPTIONS,
      ...options
    });

    if (et == null || !isObject(et.prototype)) {
      throw new Error("参数et的原型必须是一个有效的对象")
    }
    this.orgEt = { ...et };
    this.et = et;

  }

  #getListenr(listener: Function | ListenerWrapper) {

    //?? isFunction
    if (typeof listener == "function") {
      return listener
    }

    if (isObject(listener) && isFunction(listener.listener)) {
      return listener.listener
    }
    return null;
  }

  #innerAddCallback: EVMBaseEventListener = (target, event, listener, options) => {
    const fn = this.#getListenr(listener)
    if (!isFunction(fn as Function)) {
      return;
    }
    return super.innerAddCallback(target, event, fn as Function, options);
  }

  #innerRemoveCallback: EVMBaseEventListener = (target, event, listener, options) => {
    const fn = this.#getListenr(listener)
    if (!isFunction(fn as Function)) {
      return;
    }
    return super.innerRemoveCallback(target, event, fn as Function, options);
  }


  watch() {
    super.watch();
    let rp;
    // addListener addEventListener on prependListener
    rp = this.checkAndProxy(this.et.prototype, this.#innerAddCallback, ADD_PROPERTIES);
    if (rp !== null) {
      this.rpList.push(rp);
    }
    // removeListener removeEventListener off
    rp = this.checkAndProxy(this.et.prototype, this.#innerRemoveCallback, REMOVE_PROPERTIES);
    if (rp !== null) {
      this.rpList.push(rp);
    }

    return () => this.cancel();
  }

  cancel() {
    super.cancel();
    this.restoreProperties(this.et.prototype, this.orgEt.prototype, ADD_PROPERTIES);
    this.restoreProperties(this.et.prototype, this.orgEt.prototype, REMOVE_PROPERTIES);
    this.rpList.forEach(rp => rp.revoke());
    this.rpList = [];
  }
}