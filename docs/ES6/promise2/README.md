---
title：手写 Promise2-重置版
---

# 手写 Promise-重置版

## 一步步写

上一篇写的不好又舍不得删。

## 微任务

因为 promise.then 必须是微任务，但是浏览器又没有除了 then 的微任务了。

```javascript
function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    let counter = 1;
    let observe = new MutationObserver(fn);
    let node = document.createTextNode(String(counter));
    observe.observe(node, {
      characterData: true
    });
    counter += 1;
    node.data = String(counter);
  }
}
```

## 三个状态

```javascript
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = null;
    this.reason = null;
    let resolve = value => {
      if ((this.state = "pending")) {
        this.state = "fulfilled";
        this.value = value;
      }
    };
    let reject = reason => {
      if ((this.state = "pending")) {
        this.state = "rejected";
        this.reason = reason;
      }
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
}
```

我们管当前这个 promise 叫原生 promise，为什么 resolve 不是异步函数呢，因为我们现在把异步要素放在了 executor 里，是开发者自己的异步操作不需要我们来强行异步
我们只需要立即执行 executor 以及定义好 resolve 和 reject 函数即可

## then

```
  then(onFulfilled, onRejected){
    if (this.state === "fulfilled"){}
    if (this.state === "rejected"){}
    if (this.state === "pending"){}
  }
```

then 接受两个函数，分别在原生 promise fulfilled 或者 rejected 时调用。麻烦就在 pending 状态时，原生 promise 的结果还没出来。我们需要暂时把回调存起来,等待原生 promise 结果出来，遍历调用。所以要在 resolve/reject 中遍历。

```
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
```

```
    let resolve = value => {
      if ((this.state = "pending")) {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => {
          fn(this.value);
        });
      }
    };
```

```
    if (this.state === "pending") {
      this.onResolvedCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
```

## then 的参数

```javascript
onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
onRejected =
  typeof onRejected === "function"
    ? onRejected
    : err => {
        throw err;
      };
```

如果两个参数不为函数那么直接忽略

## then 的作用

- then 接受的两个函数要接受原生 promise 的结果，但是如果原生 promise 没有结果就要把回调推入数组，等待原生 promise 结果
- then 还要开启链式调用，新建一个新的 promise 以及给新的 promise 传入 executor,then 要返回一个已经被解决或者待解决的新的 promise

## 关于 then 为什么要异步

“平台代码”是指引擎，环境，和 promise 实现代码。实际上，这个要求确保 onFulfilled 和 onRejected 都在下一轮的事件循环中（一个新的栈）被异步调用。可以用宏任务，例如：setTimeout，setImmediate 或者微任务，例如：MutationObsever 或 process.nextTick 实现。 由于 promise 的实现被当做平台代码，所以它本身可能包含一个任务队列或 “trampoline” 的处理程序

```javascript
if (this.state === "rejected") {
  nextTick(() => {
    try {
      let x = onRejected(this.reason);
      resolvePromise(promise2, x, resolve, reject); // 结束新的 promise
    } catch (e) {
      reject(e); //结束新的 promise
    }
  });
}
```
## 关于多个then


## resolvePromise

- x 不能是 null
- x 是普通值 直接 resolve(x)      //结束新 promise 并且把新promise结果存到新 promise 实例中
- x 是对象或者函数（包括 promise），let then = x.then，如果取 then 报错，则走 reject()
- 如果 then 是个函数，则用 call 执行 then，第一个参数是 this，后面是成功的回调和失败的回调
```javascript
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  let called;
  if (x != null && (typeof x === "object" || typeof x === "function")) {...} else {
    resolve(x);
  }
}
```
```javascript
      if (typeof then === "function") {       //x是一个promise
        then.call(
            x,
            y => {
              if (called) return;
              called = true;
              resolvePromise(promise2, y, resolve, reject);
            },
            err => {
              if (called) return;
              called = true;
              reject(err);
            }
        );
      }
```
## 注意事项
* then接受两个函数
* 当onRejected执行成功时，返回的新 promise 也会变成fulfilled状态，导致有四种可能性
* 导致多个then链的情况及其复杂，我们尽量then忽略onRejected，只传入onResolve函数
* 用catch来捕获错误

## value的流向
1. executor 中计算出来的值（不是返回值），作为resolve()的参数
2. resolve 函数中把参数value，传到this.value
3. then的onfulfilled，用this.value作为参数

## promise.all的问题
* 当其中一个promise被reject后就会被终止，无法得知其他promise的情况
* 我们可以用allsetted，但是兼容性不好
```js
Promise.all([
    task().then(()=>{"OK"},()=>{"not OK"})
    task2().then(()=>{"OK"},()=>{"not OK"})
    task3().then(()=>{"OK"},()=>{"not OK"})
]).then((result)=>{console.log(result);})
```
用到了当onRejected执行成功时相当于错误被捕获了，变成了fulfilled状态