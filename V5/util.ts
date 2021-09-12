import { TypeListenerOptions } from "./types";

const hasOwnP = Object.prototype.hasOwnProperty;


/**
 * 是否有某属性
 * @param obj 
 * @param property 
 * @returns 
 */
export function hasOwnProperty(obj: unknown, property: string): boolean {
    if (!isObject(obj)) {
        return false;
    }
    return hasOwnP.call(obj, property);
}


/**
 * 创建纯净对象
 * @returns 
 */
export function createPureObject(obj: unknown = undefined): object {

    const pObj = Object.create(null);
    if (!isObject(obj)) {
        return pObj;
    }

    return Object.assign(pObj, obj)
}


/**
 * 创建可取消的代理
 * @param obj 
 * @param handler 
 * @returns 
 */
export function createRevocableProxy(obj: object, handler: ) {
    return Proxy.revocable(obj, handler);
}

/**
 * 创建拦截函数调用的代理
 * @param callback 
 * @returns 
 */
export function createApplyHanlder(callback: Function) {
    return {
        apply(target: Function, ctx: object, args: unknown[]) {
            // 因为执行过程中能失败，所以callback后置执行
            const result = Reflect.apply(target, ctx, args);
            callback(...[ctx].concat(args));
            return result;
        }
    }
}

export function isFunction(fn: Function): boolean {
    return typeof fn === 'function'
}

export function isObject(obj: unknown): boolean {
    return typeof obj === "object"
}

export function isSameStringifyObject(obj1: unknown, obj2: unknown) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

/**
 * 是否是同一函数
 * @param fn1 
 * @param fn2 
 * @param compareContent 
 * @returns 
 */
export function isSameFunction(fn1: Function | undefined | null, fn2: Function | undefined | null, compareContent = false) {

    if (fn1 == undefined || fn2 == undefined) {
        return false;
    }

    if (!isFunction(fn1) || !isFunction(fn2)) {
        return false;
    }

    if (fn1.length !== fn2.length) {
        return false;
    }

    if (fn1.name !== fn2.name) {
        return false;
    }

    if (!compareContent) {
        return fn1 === fn2;
    }

    return fn1 === fn2 || fn1.toString() === fn2.toString();
}

export function boolenFalse(): false {
    return false;
}

export function boolenTrue(): true {
    return true;
}


/**
 * 忽略 signal属性 https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
 * @param option 
 */
export function copyListenerOption(option: TypeListenerOptions) {
    if (typeof option !== "object") {
        return option;
    }
    const opt = {
        ...option
    }
    delete opt.signal
    return opt;
}


/**
 * 延时执行函数
 * @param fn 
 * @param delay 
 * @param context 
 * @returns 
 */
export function delay(fn: Function = () => { }, delay: number = 5000, context: unknown = null): {
    run: (...args: any[]) => Promise<any>,
    cancel: () => void
} {
    if (!isFunction(fn)) {
        return {
            run: () => Promise.resolve(),
            cancel: () => { }
        }
    }
    let ticket: number;
    let runned = false;
    return {
        run(...args: any[]) {
            return new Promise((resolve, reject) => {
                if (runned === true) {
                    return;
                }
                runned = true;
                ticket = setTimeout(async () => {
                    try {
                        const res = await fn.apply(context, args);
                        resolve(res);
                    } catch (err) {
                        reject(err)
                    }
                }, delay)
            })
        },
        cancel: () => {
            clearTimeout(ticket);
        }
    }
}
