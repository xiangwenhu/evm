const Emitter = require('component-emitter');
const emitter = new Emitter();

const EVM = require('../../dist/evm');


const evm = new EVM.EventsEVM();
evm.watch();

function onEvent1(data) {
    console.log("event1", data)
}
const onEvent1_2 = onEvent1;
function onEvent1_3(data) {
    console.log("event1", data)
}



emitter.on("event1", onEvent1)
emitter.on("event1", onEvent1_2)
emitter.on("event1", onEvent1_3)


emitter.emit("event1", {
    type: "event1",
    data: "data",
})