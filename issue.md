

## EventEmitter

1. once
   once底层肯定是调用on(addListener)， 如果避免监听
2. removeAllListeners
其可能不走挨个删除，所以必须监听此事件。

3. prependListener 并未走原型 addListener
需要代理