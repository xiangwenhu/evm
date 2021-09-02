
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