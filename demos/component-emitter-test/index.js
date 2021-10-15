const Emitter = require('component-emitter');
const emitter = new Emitter();

const EVM = require('../../dist/evm');


const evm = new EVM.CEventsEVM({
    overrideBind: true,
}, Emitter);
evm.watch();

function onEvent1(data) {
    console.log("event1", data)
}

const onEvent1Bound = onEvent1.bind();


const onEvent1_2 = onEvent1;
function onEvent1_3(data) {
    console.log("event1", data)
}

const keys = [];
for (var p in emitter) {
    keys.push(p);
}

// addEventListener, on, once,
// removeEventListener, removeAllListeners, removeListener, off
console.log("emitter:keys", keys.join(","))



emitter.on("event1", onEvent1Bound)
emitter.on("event1", onEvent1_2)
emitter.on("event1", onEvent1_3)

// emitter.on("event2", onEvent1)
// emitter.on("event2", onEvent1_2)
// emitter.on("event2", onEvent1_3)



emitter.emit("event1", {
    type: "event1",
    data: "data",
})


// emitter.off("event1");
emitter.off("event1");

evm.getExtremelyItems()
    .then(function (res) {
        console.log("res:", res.length);
        res.forEach(r => {
            console.log(r.type, r.constructor, r.events);
        })
    })


// 输出结果
/*
[object Object] Emitter Map(1) {
    'event1' => [
        {
        name: 'onEvent1',
        content: 'function onEvent1(data) {\r\n    console.log("event1", data)\r\n}',
        count: 3,
        options: undefined
        }
    ]
    }
*/