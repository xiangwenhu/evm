const bindUtil = (function () {

    let oriBind: any, isOverride = false;

    const symbolKey = typeof window !== "undefined"  ? URL.createObjectURL(new Blob([""])).split("/").pop()
        : `_bind_${Math.random()}_${Date.now()}_`;

    console.log("symbolKey:", symbolKey);
    const SymbolOriBind = Symbol.for(`${symbolKey}`);

    function undoBind() {
        if (!isOverride) {
            return;
        }
        Function.prototype.bind = oriBind;
    }

    function doBind() {
        oriBind = Function.prototype.bind;
        Function.prototype.bind = function () {
            var fun = oriBind.apply(this as any, arguments as any);
            fun[SymbolOriBind] = this;
            isOverride = true;
            return fun;
        }
        return undoBind();
    }
    return {
        doBind,
        undoBind,
        symbolKey: SymbolOriBind
    }
})();


function log(this: any) {
    console.log("name:", this.name);
}

bindUtil.doBind();

const boundLog: any = log.bind({ name: "哈哈" });
console.log(boundLog[bindUtil.symbolKey].toString());
boundLog();

bindUtil.undoBind();
const boundLog2: any = log.bind({ name: "哈哈" });
console.log(boundLog2.toString(), ", has symbolKey :" , Object.prototype.hasOwnProperty(bindUtil.symbolKey));
boundLog2();

