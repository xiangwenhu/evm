
import EventEmitter from "./EventEmitter";
import EvmEventsMap from "./EventsMap";
import { boolenFalse, isFunction, isObject, createRevocableProxy, createApplyHanlder, hasOwnProperty, checkAndProxy, restoreProperties, createPureObject, delay, getFunctionContent, isBuiltinFunctionContent } from "./util";
import { BaseEvmOptions, EventsMapItem, TypeListenerOptions } from "./types";

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
  protected watched: boolean = false;
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
      console.log("evm::clean up ------------------");
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
      console.warn(toString.call(target), " ExtremelyItems: type:", event, " name:" + listener.name, " options: " + options, " content:" + listener.toString().slice(0, 100));
    }

    // console.log("add:", Object.prototype.toString.call(target), event);

    let weakRefTarget;
    if (!this.eventsMap.hasByTarget(target)) {
      weakRefTarget = new WeakRef(target);
      this.#listenerRegistry.register(target, { weakRefTarget });
    }

    this.eventsMap.addListener(weakRefTarget ? weakRefTarget : target, event, listener, options);
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


  /**
   * 检查属性，并产生代理
   * @param prototype 
   * @param callback 
   * @param ckProperties 
   * @param proxyProperties 
   * @returns 
   */
  protected checkAndProxy = checkAndProxy;

  /**
   * 还原属性方法
   */
  protected restoreProperties = restoreProperties;

  protected async gc() {
    if (window.gc && isFunction(window.gc)) {
      window.gc();
    }

    const { run } = delay(undefined, 1000);

    await run();
  }

  async statistics() {

    await this.gc();

    const data = this.data;
    const keys = [...data.keys()];
    const d = keys.map(wr => {
      const el = wr.deref();
      if (!el) return null;

      const events = data.get(wr);
      if (!events) {
        return createPureObject();
      }
      return {
        constructor: el?.constructor?.name,
        type: toString.call(el),
        // id: el.id,
        // class: el.className,
        events: Object.keys(events).reduce((obj, cur) => {
           const items = events[cur].map(e => {
            const fn = e.listener.deref();
            if (!fn) return null;
            return fn.name;
          }).filter(Boolean)
          
          if (items.length > 0) {
            obj[cur] = items;
          }

          return obj
        }, Object.create(null))
      }
    })

    return d;
  }

  #getExtremelyListeners(eventsInfo: EventsMapItem[] = []) {
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
      listenerStr = getFunctionContent(listener)
      if(isBuiltinFunctionContent(listenerStr)) {
        continue;
      }
      listenerKeyStr = listenerStr + ` %s----%s ${eInfo.options}`
      info = map.get(listenerKeyStr);
      if (!info) {
        map.set(listenerKeyStr, {
          listener: listener.toString(),
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

    await this.gc();

    const data = this.data;
    const keys = [...data.keys()];
    const d = keys.map(wr => {
      const el = wr.deref();
      if (!el) return null;

      const eventsObj = data.get(wr);

      if (!eventsObj) {
        return createPureObject();
      }

      let exItems: EventsMapItem[];
      const events = Object.keys(eventsObj).reduce((obj, cur: string) => {
        exItems = this.#getExtremelyListeners(eventsObj[cur]);
        if (exItems.length > 0) {
          obj[cur] = exItems;
        }
        return obj
      }, Object.create(null));

      return Object.keys(events).length > 0 ? createPureObject({
        type: toString.call(el),
        constructor: el?.constructor?.name,
        // id: el.id,
        // class: el.className,
        events
      }) : null
    }).filter(Boolean)

    return d;
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
    if (this.watched) {
      return console.error("watched")
    }
    this.watched = true;
  }

  cancel() {
    this.watched = false;
  }

  get data() {
    return this.eventsMap.data;
  }

}