; (function () {

    try {
        let theObject = {}

        const registry = new FinalizationRegistry(heldValue => {
            console.log("heldValue", heldValue);
            alert("heldValue");
        });

        registry.register(theObject, "some value");

        setTimeout(() => {
            console.log("clear theObject")
            theObject = null;
        }, 1000)

        gc()

    } catch (e) {
        console.log("error", e)
    }
})()

console.log("FinalizationRegistry");