// 保留原始的原型
const orgEventTargetPro = { ...EventTarget.prototype };

const ep = EventTarget.prototype;

// Proxy.revocable返回值
let rvAdd, rvRemove;
// 是否已监听
let isWatched = false;
// 默认的回调
let _callback = () => { };

function createRevocableProxy(obj, handler) {
    return Proxy.revocable(obj, handler);
}

function createApplyHanlder(callback) {
    return {
        apply(target, ctx, args) {
            callback(...[ctx].concat(args));
            return Reflect.apply(...arguments);
        }
    }
}

export function watch(addCallback = _callback, removeCallback = _callback) {

    function innerAddCallback() {
        addCallback(...arguments);
    }

    function innerRemoveCallback() {
        removeCallback(...arguments);
    }

    if (isWatched) {
        return;
    }

    rvAdd = createRevocableProxy(ep.addEventListener, createApplyHanlder(innerAddCallback));
    ep.addEventListener = rvAdd.proxy;

    rvRemove = createRevocableProxy(ep.removeEventListener, createApplyHanlder(innerRemoveCallback));
    ep.removeEventListener = rvRemove.proxy;
}

export function cancelWatch() {
    rvAdd.revoke();
    rvRemove.revoke();
    ep.addEventListener = orgEventTargetPro.addEventListener;
    ep.removeEventListener = orgEventTargetPro.removeEventListener;
}

