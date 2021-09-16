// import { createFunProxy } from "./util";

// function bindCb(target: any, event: string, listener: Function, options: object) {
//     console.log(target, event, listener, options);
// }

// const proxy = createFunProxy(Function.prototype.bind, bindCb);


function log(this: any) {
    console.log("name:", this.name);
}

// Function.prototype.bind = proxy.proxy as any;

var oriBind = Function.prototype.bind;
var SymbolOriBind = Symbol.for("oriBind");
Function.prototype.bind = function () {
    var f = oriBind.apply(this as any, arguments as any);
    f[SymbolOriBind] = this;
    return f;
}

const boundLog: any = log.bind({ name: "哈哈" });
console.log(boundLog[SymbolOriBind].toString());


boundLog();


