import ReactDom from 'react-dom';
import React from 'react';
import App from "./App";

import install from "../../src/index";

const evm = install({
     evmOptions: {
          eTarget: {
          }
     }
});

evm.start();

function render(){
     ReactDom.render(<App />, document.getElementById("root"))
}