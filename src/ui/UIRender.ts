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
        document.body.appendChild(this.#root);
    }

    async render() {
        const data = await this.getData();
        console.log("i am rendering", data);
    }

    async schedule() {
        if (!this.#working) {
            return;
        }
        const d = delay(undefined, 10000);
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