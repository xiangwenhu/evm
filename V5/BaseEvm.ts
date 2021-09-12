
import EventEmitter from "./EventEmitter";
import EvmEventsMap from "./EventsMap";
import { boolenFalse, isFunction, isObject , createRevocableProxy, createApplyHanlder, hasOwnProperty} from "./util";
import { BaseEvmOptions, TypeListenerOptions } from "./types";

const DEFAUL_OPTIONS: BaseEvmOptions = {
  /**
   * 选项相同判断函数

  /**
   * 白名单判断函数
   */
  isInWhiteList: boolenFalse
}


const toString = Object.prototype.toString

export default class EVM {
  private emitter = new EventEmitter();
  private eventsMap = new EvmEventsMap();

  private options: BaseEvmOptions;

  constructor(options = {}) {
    this.options = {
      ...DEFAUL_OPTIONS,
      ...options
    };

    this.innerAddCallback = this.innerAddCallback.bind(this);
    this.innerRemoveCallback = this.innerRemoveCallback.bind(this);
  }

  #listenerRegistry = new FinalizationRegistry<{ weakRefTarget: WeakRef<object> }>(
    ({ weakRefTarget }) => {
      console.log("clean up ------------------");
      if (!weakRefTarget) {
        return;
      }
      this.eventsMap.remove(weakRefTarget);
      console.log("length", [...this.eventsMap.data.keys()].length);
    }
  )

  innerAddCallback(target: Object, event: string, listener: Function, options: TypeListenerOptions) {

    const { isInWhiteList } = this.options;

    if (!isInWhiteList(target, event, listener, options)) {
      return;
    }

    if (!isFunction(listener)) {
      return console.warn("EVM::innerAddCallback listener must be a function");
    }

    // EventTarget  https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#multiple_identical_event_listeners
    // 多次添加，覆盖
    if (isObject(target) && target instanceof EventTarget && this.eventsMap.hasListener(target, event, listener, options)) {
      return console.log(`EventTarget 注册了多个相同的 EventListener， 多余的丢弃！${toString.call(target)} ${event} ${listener.name} 多余的丢弃`);
    }

    const eItems = this.eventsMap.getExtremelyItems(target, event, listener, options);
    if (Array.isArray(eItems) && eItems.length > 0) {
      console.warn(toString.call(target), " ExtremelyItems: type:", event, " name:" + listener.name, "options: " + options);
    }

    // console.log("add:", Object.prototype.toString.call(target), event);

    let weakRefTarget = new WeakRef(target);
    if (!this.eventsMap.hasByTarget(target)) {
      weakRefTarget = new WeakRef(target);
      this.#listenerRegistry.register(target, { weakRefTarget });
    }

    this.eventsMap.addListener(weakRefTarget, event, listener, options);
    // this.#emitter.emit("on-add", ...argList);

  }

  innerRemoveCallback(target: Object, event: string, listener: Function, options: TypeListenerOptions) {

    const { isInWhiteList } = this.options;
    if (!isInWhiteList(target, event, listener, options)) {
      return;
    }

    if (!isFunction(listener)) {
      return console.warn("EVM::innerAddCallback listener must be a function");
    }

    if (!this.eventsMap.hasByTarget(target)) {
      return;
    }
    // console.log("remove:", Object.prototype.toString.call(target), event);

    this.eventsMap.removeListener(target, event, listener, options);
    // this.#emitter.emit("on-remove", ...argList)
  }

  protected createFunProxy(oriFun: Function, callback: Function) {
    if (!isFunction(oriFun)) {
      return console.log("createFunProxy:: oriFun should be a function");
    }

    const rProxy = createRevocableProxy(oriFun,
      createApplyHanlder(callback));

    return rProxy;
  }


  onAdd(fn: Function): void {
    this.emitter.on("on-add", fn)
  }

  offAdd(fn: Function) {
    this.emitter.off("on-add", fn)
  }

  onRemove(fn: Function) {
    this.emitter.on("on-remove", fn)
  }

  offRemove(fn: Function) {
    this.emitter.off("on-remove", fn)
  }

  onAlarm(fn: Function) {
    this.emitter.on("on-alarm", fn)
  }

  offAlarm(fn: Function) {
    this.emitter.off("on-alarm", fn)
  }

  watch() {
    throw new Error("not implemented")
  }

  cancel() {
    throw new Error("not implemented")
  }

  data() {
    return this.eventsMap.data;
  }

  async statistics() {
    throw new Error("not implemented")
  }

}