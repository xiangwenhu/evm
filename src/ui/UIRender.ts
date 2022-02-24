import { EnumEVMType } from "../types";
import { $, createEle } from "./util";
import BaseEvm from "../BaseEvm";
import { delay, executeGC } from "../util";

export default class UIRender {

    #working: boolean = true;

    #root: HTMLDivElement;

    private evm: Record<EnumEVMType, BaseEvm>;
    constructor(evm: Record<EnumEVMType, BaseEvm>) {
        this.evm = evm;
        this.initContainer();
        this.schedule();
    }


    initContainer() {
        this.#root = createEle("div", {
            class: "_evm_root_"
        });
        this.#root.style.cssText = "position:fixed; right:0, top:0;"
        document.body.appendChild(this.#root);
    }

    async render() {
        const data = await this.getData();
        console.log("i am rendering", data);
        const htmlStr = this.renderSingleEVM(data.eTarget)
        this.#root.innerHTML = htmlStr;
    }

    renderSingleEVM(data: any) {
        return `
        <table>
            <tr><td>类型</td><td>事件</td><td>详情</td></tr>
            ${data.map(this.renderItem)}
        </table> 
        `
    }

    renderItem(item: any) {
        return `
            <tr>
            <td>${item.constructor}</td>
            <td>${item.key}</td>
            <td>
                <table>
                    <thead>
                        <tr>
                            <td>函数名</td>
                            <td>数量</td>
                            <td>内容</td>
                        </tr>
                    </thead>
                    <tbody>
           ${item.events.map((v: any) => {
            return `
                <tr>
                    <td>${v.name}</td>
                    <td>${v.count}</td>
                    <td title="${v.content}">${v.content.slice(0, 30)}</td>
                </tr>
                `
        }).join('')}
                    </tbody>
                </table>
            </td>
        `
    }

    async schedule() {
        if (!this.#working) {
            return;
        }
        const d = delay(undefined, 5000);
        await d.run();
        this.render();
        this.schedule();
    }

    async getData() {
        await executeGC();
        const data = Object.create(null);
        if (this.evm.cEvents) {
            data["cEvents"] = await this.evm.cEvents.getExtremelyItems(false)
        }
        if (this.evm.eTarget) {
            data["eTarget"] = await this.evm.eTarget.getExtremelyItems(false)
        }
        if (this.evm.events) {
            data["events"] = await this.evm.events.getExtremelyItems(false)
        }
        return data;
    }

}