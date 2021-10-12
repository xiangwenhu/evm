
let oriBind: any, isOverride = false;

const symbolKey = typeof window !== "undefined" ? URL.createObjectURL(new Blob([""])).split("/").pop()
    : `_bind_${Math.random()}_${Date.now()}_`;

export const SymbolForBind = Symbol.for(`${symbolKey}`);

export function undoBind() {
    if (!isOverride) {
        return;
    }
    Function.prototype.bind = oriBind;
}

export function doBind() {
    oriBind = Function.prototype.bind;
    Function.prototype.bind = function () {
        const fun = oriBind.apply(this as any, arguments as any);
        fun[SymbolForBind] = this;
        isOverride = true;
        return fun;
    }
    return undoBind();
}
