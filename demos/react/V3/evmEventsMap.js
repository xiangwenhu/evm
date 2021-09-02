import { createPureObject } from "./util.js"

export default class EvmEventsMap {

    #wp = new WeakMap();

    add(target, event, fn) {
        const wp = this.#wp;
        let t = wp.get(target);
        if (!t) {
            t = createPureObject();
            wp.set(target, t);
        }
        if (!t[event]) {
            t[event] = [];
        }
        t[event].push(fn);
    }

    remove(target, event, fn) {
        const wp = this.#wp;
        let t = wp.get(target);
        if (!t) {
            return;
        }
        if (!t[event]) {
            return;
        }
        const index = t[event].findIndex((f) => f === fn);
        if (index >= 0) {
            t[event].splice(index, 1);
        }
        if (t[event].length === 0) {
            delete t[event];
        }
        if (Object.keys(t).length === 0) {
            wp.delete(target);
        }
    }

    getData() {
        return this.#wp
    }
}