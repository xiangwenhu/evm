import { TypeListenerOptions, EventsMapItem } from "./types";
import { createPureObject, isSameStringifyObject, copyListenerOption, isSameFunction } from "./util"

export default class EvmEventsMap {

    #map = new Map<WeakRef<Object>, Record<string, EventsMapItem[]>>();

    /**
     * 
     * @param target  Node节点
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
     * @param target Node节点或者 WeakRef(Node)
     * @param event 事件类型，比如click, resize等
     * @param listener 事件处理程序
     */
    addListener(target: Object, event: string, listener: Function, options: TypeListenerOptions) {

        const map = this.#map;

        let t: Record<string, EventsMapItem[]> | undefined;
        // target 如果是 WeakRef, 直接使用
        let wrTarget = target instanceof WeakRef ? target : this.getKeyFromTarget(target);


        if (!wrTarget) {
            wrTarget = new WeakRef(target);
        }
        t = this.#map.get(wrTarget);
        if (!t) {
            t = createPureObject() as Record<string, EventsMapItem[]>;
            map.set(wrTarget, t);
        }
        if (!t[event]) {
            t[event] = [];
        }
        t[event].push({
            listener: new WeakRef(listener),
            options: copyListenerOption(options)
        });
        return this;
    }

    /**
     * 删除
     * @param target Node节点或者 WeakRef(Node)
     * @param event 事件类型，比如click, resize等
     * @param listener 事件处理程序
     * @returns undefined
     */
    removeListener(target: Object, event: string, listener: Function, options: TypeListenerOptions) {
        const map = this.#map;

        let wrTarget = target instanceof WeakRef ? target : this.getKeyFromTarget(target);
        if (!wrTarget) {
            return console.error('EvmEventsMap:: remove faild, target is not found');
        }

        const t = map.get(wrTarget);

        if (!t) {
            return
        }
        if (!t[event]) {
            return console.error(`EvmEventsMap:: remove faild, event (${event}) is not found`);
        }

        // options 不能比同一个对象，比字符串的值
        const index = t[event].findIndex(l => {
            const fun = l.listener.deref();
            if (!fun) {
                return false;
            }
            return fun === listener && isSameStringifyObject(l.options, options)
        });

        if (index >= 0) {
            t[event].splice(index, 1);
        }

        const hasItem = t[event].some(l => l.listener.deref());
        if (!hasItem) {
            delete t[event];
        }
        if (Object.keys(t).length === 0) {
            map.delete(wrTarget);
        }
        return this;
    }

    /**
     * 
     * @param wrTarget WeakRef(Node)
     * @returns 
     */
    remove(wrTarget: WeakRef<object>) {
        return this.#map.delete(wrTarget);
    }

    /**
     * 
     * @param target  Node
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
     * Node
     * @param target Node节点
     * @returns 
     */
    hasByTarget(target: object) {
        return !!this.getKeyFromTarget(target)
    }

    /**
     * 
     * @param wrTarget WeakRef(Node)
     * @returns 
     */
    has(wrTarget: WeakRef<object>) {
        return this.#map.has(wrTarget);
    }

    getEventsObj(target: object) {
        let wrTarget = this.getKeyFromTarget(target);
        if (!wrTarget) {
            return null;
        }
        const eventsObj = this.#map.get(wrTarget);
        return eventsObj;
    }


    hasListener(target: Object, event: string, listener: Function, options: TypeListenerOptions) {
        let wrTarget = this.getKeyFromTarget(target);
        if (!wrTarget) {
            return false;
        }
        const t = this.#map.get(wrTarget);
        if (!t) return false;
        const wrListeners = t[event];

        if (!Array.isArray(wrListeners)) {
            return false;
        }

        return wrListeners.findIndex(lobj => {
            const l = lobj.listener.deref();
            if (!l) {
                return false;
            }
            return l === listener && isSameStringifyObject(options, l.options)
        }) > -1

    }

    getExtremelyItems(target: Object, event: string, listener: Function, options: TypeListenerOptions) {

        const eventsObj = this.getEventsObj(target);
        if (!eventsObj) {
            return null;
        }
        const listenerObjs = eventsObj[event];
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