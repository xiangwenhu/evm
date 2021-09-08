

## nodejs 的 events

1. once
   once底层肯定是调用on(addListener)， 如果避免监听
2. removeAllListeners
其可能不走挨个删除，所以必须监听此事件。

3. prependListener 并未走原型 addListener
需要代理


## socket.io
客户端的Client继承与 component-emitter 
https://www.npmjs.com/package/component-emitter
https://github.com/component/emitter

其比较简单，只有简单的on , off


## MQTT
其实用的是 nodejs 的 events

