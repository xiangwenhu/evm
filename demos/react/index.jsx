import ReactDom from 'react-dom';
import React from 'react';
import App from "./App";

window.__evm_ready__  ?render() : setTimeout(render, 3000)

function render(){
     ReactDom.render(<App />, document.getElementById("root"))
}