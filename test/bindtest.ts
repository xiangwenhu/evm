import * as bindUtil from "../src/bindUtil";



bindUtil.doBind();
bindUtil.doBind();



// toString()
function log(this: any) {
    console.log("this", this);
}

console.log(log.bind({}).bind({}).toString());


// this + 参数

function sum(this:any, num1: number, num2: number, num3: number): number {
    console.log("this:", this)
    return num1 + num2 + num3;
}

const boundSum1 = sum.bind({a:1}, 1).bind({b:2}, 2);

console.log(boundSum1(3));