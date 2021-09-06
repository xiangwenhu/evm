import { createPureObject, isSameStringifyObject, copyListenerOption } from "./util.mjs"

export default class EvmEventsMap {

    #map = new Map();

    /**
     * 
     * @param target  Node节点
     * @returns 
     */
    getKeyFromTarget(target) {
        return ([...this.#map.keys()].find(wrKey => {
            const key = wrKey.deref();
            if (!key) return false;
            return key === target;
        }) || [])[0];
    }

    /**
     * 添加
     * @param target Node节点或者 WeakRef(Node)
     * @param event 事件类型，比如click, resize等
     * @param listener 事件处理程序
     */
    add(target, event, listener, options) {

        const map = this.#map;

        let t;
        // target 如果是 WeakRef, 直接使用
        let wrTarget = target instanceof WeakRef ? target : this.getKeyFromTarget(target);


        if (!wrTarget) {
            wrTarget = new WeakRef(target);
        }
        t = this.#map.get(wrTarget);
        if (!t) {
            t = createPureObject();
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
    remove(target, event, listener, options) {
        const wp = this.#map;

        let wrTarget = target instanceof WeakRef ? target : this.getKeyFromTarget(target);
        if (!wrTarget) {
            return console.error('EvmEventsMap:: remove faild, target is not found');
        }

        const t = wp.get(wrTarget);
        if (!t[event]) {
            return console.error(`EvmEventsMap:: remove faild, event (${event}) is not found`);
        }

        // options 不能比同一个对象，比字符串的值
        const index = t[event].findIndex(l => {

            const fun = l.deref();
            if (!fun) {
                return false;
            }

            return fun === listener && isSameStringifyObject(l.options, options)
        });

        if (index >= 0) {
            t[event].splice(index, 1);
        }
        if (t[event].length === 0) {
            delete t[event];
        }
        if (Object.keys(t).length === 0) {
            wp.delete(target);
        }
        return this;
    }

    /**
     * 
     * @param wrTarget WeakRef(Node)
     * @returns 
     */
    remove(wrTarget) {
        return this.#map.delete(wrTarget);
    }

    /**
     * 
     * @param target  Node
     * @returns 
     */
    removeByTarget(target) {
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
    hasByTarget(target) {
        return !!this.getKeyFromTarget(target)
    }

    /**
     * 
     * @param wrTarget WeakRef(Node)
     * @returns 
     */
    has(wrTarget) {
        return this.#map.has(wrTarget);
    }


    get data() {
        return this.#map
    }
}