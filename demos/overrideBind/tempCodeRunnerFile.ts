const symbolKey = typeof window !== "undefined"  ? URL.createObjectURL(new Blob([""])).split("/").pop()
: `_bind_${Math.random()}_${Date.now()}`

console.log("symbolKey:", symbolKey);

const sss= Symbol.for(symbolKey);