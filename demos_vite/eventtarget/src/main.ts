import './style.css'
import { ETargetEVM } from "../../../src/index"

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
const evm = new ETargetEVM({
  isInWhiteList(target: Object, event: string) {
    return target === window
  }
});

evm.watch();



setInterval(async function () {
  // console.log("-------");
  const data = await evm.getExtremelyItems();
  console.log("statistics:", data);
}, 3000)

const btn1El: HTMLButtonElement = document.getElementById("btn1");


function onClick1(){
  console.log("onclick")
}

function onClick2(){
  console.log("onclick")
}

btn1El.addEventListener("cl")