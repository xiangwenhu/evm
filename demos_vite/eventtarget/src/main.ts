import './style.css'
const app = document.querySelector<HTMLDivElement>('#app')!

import install from "../../../src/index";
import { EventType, TypeListenerOptions } from '../../../src/types';

const evm = install({
  evmOptions: {
    eTarget: {
      isInWhiteList(target: any, event: EventType, listener: Function, options: TypeListenerOptions) {
        return target.id === "btn1"
      }
    }
  }
});

evm.start();

const btn1El: HTMLButtonElement = document.getElementById("btn1") as HTMLButtonElement;


function onClick1() {
  console.log("onclick")
}

function onClick2() {
  console.log("onclick")
}

// 添加完全一样的内容，报警
btn1El.addEventListener("click", onClick1);
btn1El.addEventListener("click", onClick2);