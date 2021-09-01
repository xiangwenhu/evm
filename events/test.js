const EventEmitter = require("events");


const emitter = new EventEmitter();

emitter.once("one-event", function(event) {
    console.log("one-event-1")
})

emitter.on("one-event", function(event) {
    console.log("one-event-2")
})

emitter.emit("one-event")
console.log("=====")
emitter.emit("one-event")