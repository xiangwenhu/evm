import './style.css'
import { ETargetEVM } from "../../../src/index"

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`
const evm = new ETargetEVM({
  isInWhiteList(target: any, event: string) {
    return target.id === "btn1"
  }
});

evm.watch();



setInterval(async function () {
  // console.log("-------");
  const data = await evm.getExtremelyItems();
  console.log("statistics:", data);
}, 3000)

const btn1El: HTMLButtonElement = document.getElementById("btn1") as HTMLButtonElement;


function onClick1(){
  console.log("onclick")
}

function onClick2(){
  console.log("onclick")
}

// 添加完全一样的内容，报警
btn1El.addEventListener("click", onClick1);
btn1El.addEventListener("click", onClick2);