import BaseEvm from "../BaseEvm";

import { BaseEvmOptions, EVMBaseEventListener, ListenerWrapper } from "../types";
import { boolenFalse, isFunction, isObject } from "../util";

const DEFAULT_OPTIONS = {
    isInWhiteList: boolenFalse
}

const ADD_PROPERTIES = ["addEventListener"];
const REMOVE_PROPERTIES = ["removeEventListener"];

export default class ETargetEVM extends BaseEvm {

    protected orgEt: any;
    protected rpList: {
        proxy: object;
        revoke: () => void;
    }[] = [];
    protected et: any;

    constructor(options: BaseEvmOptions = DEFAULT_OPTIONS, et: any = EventTarget) {
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
        if (typeof listener == "function") {
            return listener
        }
        return null;
    }

    #innerAddCallback: EVMBaseEventListener<void, string> = (target, event, listener, options) => {
        const fn = this.#getListenr(listener)
        if (!isFunction(fn as Function)) {
            return;
        }
        return super.innerAddCallback(target, event, fn as Function, options);
    }

    #innerRemoveCallback: EVMBaseEventListener<void, string> = (target, event, listener, options) => {
        const fn = this.#getListenr(listener)
        if (!isFunction(fn as Function)) {
            return;
        }
        return super.innerRemoveCallback(target, event, fn as Function, options);
    }


    watch() {
        super.watch();
        let rp;
        // addEventListener 
        rp = this.checkAndProxy(this.et.prototype, this.#innerAddCallback, ADD_PROPERTIES);
        if (rp !== null) {
            this.rpList.push(rp);
        }
        // removeEventListener
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