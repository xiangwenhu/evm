import { ETargetEVM } from "../../src/index";


const win = window as any;

const evm = new ETargetEVM({
    isInWhiteList(target) {
      return target === document.body || target.id
    }
  });

  function clickFn(e) {
    console.log(this === e.target);
  }


  evm.watch();
  document.getElementById("btn").addEventListener("click", clickFn);
  document.getElementById("btn").addEventListener("click", clickFn);
  // document.getElementById("btn").addEventListener("click", clickFn, true);
  // document.getElementById("btn").addEventListener("click", clickFn, true);

  win.evm = evm;
  // document.getElementById("btn").addEventListener("click", clickFn);

  // setTimeout(function () {
  //   console.log("remove click 5000")
  //   document.getElementById("btn").removeEventListener("click", clickFn)
  // }, 5000)

  // setTimeout(function () {
  //   console.log("remove click 13000")
  //   document.getElementById("btn").removeEventListener("click", clickFn)
  // }, 13000)

  setTimeout(async function () {
    // console.log("-------");
    const data = await evm.getExtremelyItems();
    console.log("statistics:", data);
  }, 3000)

  function onResize() {
    console.log("resize")
   }

  // document.body.addEventListener("resize", onResize);

  // document.body.addEventListener("resize", onResize);

  // setTimeout(function () {
  //   window.removeEventListener("resize", onResize);
  // }, 5000)