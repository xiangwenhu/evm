
let oriBind: any, isOverride = false;

const symbolKey = `__xyz_symbol_key_zyx__(~!@#$%^&*()_+)__`;

export const SymbolForBind = Symbol.for(`${symbolKey}`);

export function undoBind() {
    if (!isOverride) {
        return;
    }
    delete oriBind[SymbolForBind];
    Function.prototype.bind = oriBind;
}

const { hasOwnProperty } = Object.prototype;
export function doBind() {
    oriBind = Function.prototype.bind;
    if (hasOwnProperty.call(oriBind, SymbolForBind) || isOverride) {
        return undoBind();
    }

    const overridedBind = (
        function (oriBind) {
            return function overridedBind(this: any) {
                if (typeof this !== "function") {
                    throw new Error("必须是一个函数")
                }
                // 已经被bind过了
                if (this.hasOwnProperty.call(this, SymbolForBind)) {
                    return this;
                }
                const fun = oriBind.apply(this as any, arguments as any);
                fun[SymbolForBind] = this;
                isOverride = true;
                return fun;
            }

        }
    )(oriBind);

    (overridedBind as any)[SymbolForBind] = true;
    Function.prototype.bind = overridedBind;
    return undoBind();
}
