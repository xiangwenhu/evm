import { EnumEVMType } from "../types";
import { $, createEle } from "./util";
import BaseEvm from "../BaseEvm";
import { delay, executeGC } from "../util";


const cssText = `
._evm_root_{
    font-size: 12px;
    height: 500px;
    overflow-y:auto;
    position:fixed;
    top: 10px;
    right: 10px
}

._evm_controls div{
    text-align: right;
}

/* Border styles */
.evm-table td {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: rgb(235, 242, 224);
}

.evm-table {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: rgb(235, 242, 224);
}


.evm-table td, .evm-table th {
    padding: 5px 10px;
    font-size: 12px;
    color: rgb(149, 170, 109);
}

.evm-table tr:nth-child(even) {
    background: rgb(230, 238, 214)
}
.evm-table tr:nth-child(odd) {
    background: #FFF
}
`
export default class UIRender {

    #working: boolean = true;

    #root: HTMLDivElement;

    #controlsEl: HTMLDivElement;

    #contentEl: HTMLDivElement;

    private evm: Record<EnumEVMType, BaseEvm>;
    constructor(evm: Record<EnumEVMType, BaseEvm>) {
        this.evm = evm;
        this.initStyle();
        this.initContainer();
        // this.schedule();
    }


    initStyle() {
        const styleEl = document.createElement("style");
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
    }


    initContainer() {
        this.#root = createEle("div", {
            class: "_evm_root_"
        });
        document.body.appendChild(this.#root);
        this.initControls();
        this.#contentEl = createEle("div", {
            class: "_evm_controls"
        })

        this.#root.append(this.#contentEl);

    }

    initControls() {
        this.#controlsEl = createEle("div", {
            class: "_evm_controls"
        })
        this.#root.append(this.#controlsEl);

        this.#controlsEl.innerHTML = `
            <div>
                <button type="button" id="_evm_btn_query">获取数据</button>
            </div>
        `
        this.#controlsEl.querySelector("#_evm_btn_query").addEventListener("click", () => {
            this.render();
        })
    }

    async render() {
        const data = await this.getData();
        console.log("i am rendering", data);

        let htmlStr = this.createSingleEvmHTMLString(data.eTarget, 'eTarget');
        htmlStr += this.createSingleEvmHTMLString(data.events, 'events');
        htmlStr += this.createSingleEvmHTMLString(data.cEvents, 'cEvents');
        this.#contentEl.innerHTML = htmlStr;
    }

    createSingleEvmHTMLString(data: any, title: string = ''): string {
        if (!data) {
            return ''
        }
        return `
        <h3>${title}</h3>
        <table class="evm-table">
            <thead>
                <tr>
                    <td>类型</td>
                    <td>事件</td>
                    <td>详情</td>
                </tr>
            </thead>
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
                <table class="evm-table">
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