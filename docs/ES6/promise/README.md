---
title：手写 Promise
---

# 手写 Promise

## Promise 基本调用

- `new Promise((resolve, reject)=>{})`传入一个参数（函数）
- resolve 和 reject 都是函数

```javascript
class Promise {
  constructor(executor) {
    let resolve = () => {};
    let reject = () => {};
    executor(resolve, reject);
  }
}
```

我们调用`new Promise((resolve, reject)=>{})`传入一个函数定义(executor)，Promise 中调用 executor，调用时传入两个参数。

## Promise 三个状态

- new Promise((resolve, reject)=>{resolve(value)}) resolve 为成功，接收参数 value，状态改变为 fulfilled，不可再次改变。
- new Promise((resolve, reject)=>{reject(reason)}) reject 为失败，接收参数 reason，状态改变为 rejected，不可再次改变。
- 若是 executor 函数报错 直接执行 reject();

```javascript
class Promise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
}
```

## then 方法

- Promise 有一个叫做 then 的方法，里面有两个参数：onFulfilled,onRejected,成功有成功的值，失败有失败的原因
- 当状态 state 为 fulfilled，则执行 onFulfilled，传入 this.value。当状态 state 为 rejected，则执行 onRejected，传入 this.reason
- onFulfilled,onRejected 如果他们是函数，则必须分别在 fulfilled，rejected 后被调用，value 或 reason 依次作为他们的第一个参数

```javascript
class Promise {
  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onRejected(this.reason);
    }
  }
}
```

现在基本可以实现简单的同步代码，但是当 resolve 在 setTomeout 内执行，then 时 state 还是 pending 等待状态

## 异步问题

```javascript
class Promise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onRejected(this.reason);
    }
    if (this.state === "pending") {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}
```

- 和发布订阅模式类似，回调必须在 emit 时执行，回调必须在 resolve 时执行
- 当 state 是 pending 时，说明异步函数正在进行中，异步函数完成后调用 resolve(value)，value 传到 this.value，this.value 作为 onFulfilled 的参数

## 链式调用

- 为了达成链式，我们默认在第一个 then 里返回一个 promise。then 里面返回一个新的 promise,称为 promise2：`promise2 = new Promise((resolve, reject)=>{})`
- 当我们在第一个 then 中 return 了一个参数（参数未知，需判断）。这个 return 出来的新的 promise 就是 onFulfilled()或 onRejected()的值
- 首先，要看 x 是不是 promise。
- 如果是 promise，则取它的结果，作为新的 promise2 成功的结果
- 如果是普通值，直接作为 promise2 成功的结果
- 所以要比较 x 和 promise2
- resolvePromise 的参数有 promise2（默认返回的 promise）、x（我们自己 return 的对象）、resolve、reject
- resolve 和 reject 是 promise2 的

```javascript
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try {
      executor(resolve, reject); 
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  let called;
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;
      if (typeof then === "function") {
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
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}
```

## 代码逻辑

- Promise 接受 executor 回调函数作为参数
- executor 有两个 resolve，reject 回调函数
- executor 定义在外部内部调用，resolve 定义在内部外部调用
- 异步请求为例：请求写在 executor 里，成功时调用 resolve，反之定义 reject
- 外部调用 resolve 后如果状态是 pending 那么发生改变，表明请求成功了！
- then 接受两个函数，onFulfilled, onRejected
- 调用 then 时**原始 promise**可能有三种状态，如果是 fulfilled 就执行 onfulfilled 函数，
  如果是 rejected 就执行 onrejected，如果是 pending 说明异步请求正在执行中，我们把回调推
  入数组中，当**原始 promise**resolve 或者 reject 时调用
- then 返回的 promise 反应的是 then 接受的异步函数是否成功，所以 then 和原始 promise 以及下一个 promise
  有关分别反应刚开始的异步是否成功以及 then 本身的异步是否成功。
- 这就揭示了 then 的两个作用接受上一个 promise 结束的值（value/reason）以及开启并结束下一个 promise
  resolvePromise 负责结束，在 resolvePromise 里经过判断后调用下一个 promise 的 resolve 或者 rejected
- onFulfilled 或 onRejected 不能同步被调用，必须异步调用。因为异步要按顺序来不可以先执行 then
  再等原始的 promise 指向完
- then 返回的 promise 是一个已经传入 executor 的 promise，executor 执行 onfulfilled 后会执行 resolve，反之

## this 的小知识

```
new Promise((resolve, reject) => {
  /// this ?
})
```

```
(resolve, reject) => {
  /// this ?
}
```

如果一个参数是函数记为 fn，那么 fn 不属于 new Promise 的一部分，自然 this 也不是新的实例，
相当于 fn 定义在外部，然后 new Promise(fn)。

参数不属于函数一部分。

## MutationObserver-手写浏览器微任务

原本目的监听 DOM 树的更新，如果更新执行回调，但是它是微任务比 seTimeout 优先级高
很多

```javascript
function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    let counter = 1;
    let observer = new MutationObserver(fn);
    let textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    counter += 1;
    textNode.data = String(counter);
  }
}
```

- disconnect()
  阻止 MutationObserver 实例继续接收的通知，直到再次调用其 observe()方法，该观察者对象包含的回调函数都不会再被调用。
- observe()
  配置 MutationObserver 在 DOM 更改匹配给定选项时，通过其回调函数开始接收通知。
- takeRecords()
  从 MutationObserver 的通知队列中删除所有待处理的通知，并将它们返回到 MutationRecord 对象的新 Array 中。

把then里的setTimeout改成nextTick