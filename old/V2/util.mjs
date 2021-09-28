
/**
 * 创建纯净对象
 * @returns 
 */
export function createPureObject() {
    return Object.create(null);
}

/**
 * 创建可取消的代理
 * @param obj 
 * @param handler 
 * @returns 
 */
export function createRevocableProxy(obj, handler) {
    return Proxy.revocable(obj, handler);
}

/**
 * 创建拦截函数调用的代理
 * @param callback 
 * @returns 
 */
export function createApplyHanlder(callback) {
    return {
        apply(target, ctx, args) {
            callback(...[ctx].concat(args));
            return Reflect.apply(...arguments);
        }
    }
}

export function isFunction(fn) {
    return typeof fn === 'function'
}

export function isSameStringifyObject(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}

export function isSameFunction(fn1, fn2, compareContent = false) {

    if (!isFunction(fn1) || !isFunction(fn2)) {
        return false;
    }

    if (!compareContent) {
        return fn1 === fn2;
    }

    return fn1 === fn2 || fn1.toString() === fn2.toString();
}

export function boolenFalse() {
    return false;
}