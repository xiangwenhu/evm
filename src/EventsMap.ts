import { TypeListenerOptions, EventsMapItem, EventType } from "./types";
import { createPureObject, isSameStringifyObject, copyListenerOption, isSameFunction } from "./util"

export default class EvmEventsMap {

    #map = new Map<WeakRef<Object>, Map<EventType, EventsMapItem[]>>();

    /**
     * 
     * @param target 被弱引用的对象
     * @returns 
     */
    getKeyFromTarget(target: object) {
        const keys = this.keys();

        const index = keys.findIndex(wrKey => {
            const key = wrKey.deref();
            if (!key) return false;
            return key === target;
        });

        return keys[index];
    }

    keys() {
        return [...this.#map.keys()];
    }

    /**
     * 添加
     * @param target object或者 WeakRef(object)
     * @param event 事件类型，比如message,click等
     * @param listener 事件处理程序
     */
    addListener(target: Object, event: EventType, listener: Function, options: TypeListenerOptions) {

        const map = this.#map;

        let t: Map<EventType, EventsMapItem[]> | undefined;
        // target 如果是 WeakRef, 直接使用
        let wrTarget = target instanceof WeakRef ? target : this.getKeyFromTarget(target);


        if (!wrTarget) {
            wrTarget = new WeakRef(target);
        }
        t = this.#map.get(wrTarget);
        if (!t) {
            t = createPureObject() as Map<EventType, EventsMapItem[]>;
            map.set(wrTarget, t);
        }

        if (!t.has(event)) {
            t.set(event, []);
        }
        const eventsInfo = t.get(event);
        if (!eventsInfo) {
            return this;
        }
        eventsInfo.push({
            listener: new WeakRef(listener),
            options: copyListenerOption(options)
        });
        return this;
    }

    /**
     * 添加
     * @param target object或者 WeakRef(object)
     * @param event 事件类型，比如message,click等
     * @param listener 事件处理程序
     */
    removeListener(target: Object, event: EventType, listener: Function, options: TypeListenerOptions) {
        const map = this.#map;

        let wrTarget = target instanceof WeakRef ? target : this.getKeyFromTarget(target);
        if (!wrTarget) {
            return console.error('EvmEventsMap:: remove faild, target is not found');
        }

        const t = map.get(wrTarget);

        if (!t) {
            return
        }
        if (!t.has(event)) {
            return console.error(`EvmEventsMap:: remove faild, event (${event}) is not found`);
        }

        // options 不能比同一个对象，比字符串的值
        const eventsInfo = t.get(event);
        if (!eventsInfo) {
            return this;
        }
        const index = eventsInfo.findIndex(l => {
            const fun = l.listener.deref();
            if (!fun) {
                return false;
            }
            return fun === listener && isSameStringifyObject(l.options, options)
        });

        if (index >= 0) {
            eventsInfo.splice(index, 1);
        }

        const hasItem = eventsInfo.some(l => l.listener.deref());
        if (!hasItem) {
            t.delete(event);
        }
        if (Object.keys(t).length === 0) {
            map.delete(wrTarget);
        }
        return this;
    }

    /**
     * 
     * @param wrTarget WeakRef(object)
     * @returns 
     */
    remove(wrTarget: WeakRef<object>) {
        return this.#map.delete(wrTarget);
    }

    /**
     * 
     * @param target  object
     * @returns 
     */
    removeByTarget(target: object) {
        const wrTarget = this.getKeyFromTarget(target);
        if (!wrTarget) {
            return;
        }
        return this.#map.delete(wrTarget);
    }

    /**
     * 
     * @param target  object
     * @returns 
     */
    hasByTarget(target: object) {
        return !!this.getKeyFromTarget(target)
    }

    /**
     * 
     * @param wrTarget WeakRef(object)
     * @returns 
     */
    has(wrTarget: WeakRef<object>) {
        return this.#map.has(wrTarget);
    }

    /**
     * 获取关联的事件信息信息
     * @param target 
     * @returns 
     */
    getEventsObj(target: object) {
        let wrTarget = this.getKeyFromTarget(target);
        if (!wrTarget) {
            return null;
        }
        const eventsObj = this.#map.get(wrTarget);
        return eventsObj;
    }


    /**
     * 是有已经有listener
     * @param target 
     * @param event 
     * @param listener 
     * @param options 
     * @returns 
     */
    hasListener(target: Object, event: EventType, listener: Function, options: TypeListenerOptions) {
        let wrTarget = this.getKeyFromTarget(target);
        if (!wrTarget) {
            return false;
        }
        const t = this.#map.get(wrTarget);
        if (!t) return false;
        const wrListeners = t.get(event);

        if (!Array.isArray(wrListeners)) {
            return false;
        }

        return wrListeners.findIndex(lobj => {
            const l = lobj.listener.deref();
            if (!l) {
                return false;
            }
            return l === listener && isSameStringifyObject(options, lobj.options)
        }) > -1

    }

    /**
     * 获取极可能是有问题的事件监听信息
     * @param target 
     * @param event 
     * @param listener 
     * @param options 
     * @returns 
     */
    getExtremelyItems(target: Object, event: EventType, listener: Function, options: TypeListenerOptions) {

        const eventsObj = this.getEventsObj(target);
        if (!eventsObj) {
            return null;
        }
        const listenerObjs = eventsObj.get(event);
        if (!listenerObjs) {
            return null;
        }
        const items = listenerObjs.filter(l => isSameFunction(l.listener.deref(), listener, true) && isSameStringifyObject(l.options, options));
        return items;
    }

    get data() {
        return this.#map
    }
}