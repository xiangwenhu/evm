import EventEmitter from "eventemitter3";
import install from "../../../src/index";
import { EventType, TypeListenerOptions } from '../../../src/types';

const evm = install({
    evmOptions: {
        eTarget: {
            isInWhiteList(target: any, event: EventType, listener: Function, options: TypeListenerOptions) {
                return target.id === "btn1"
            }
        },
        events: {
            et: EventEmitter
        }
    }
});

evm.start();

document.getElementById('btnRender')?.addEventListener("click", function(){
    evm.render.render
})