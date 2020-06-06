---
title:async
---

# async

async 函数完全可以看作多个异步操作，包装成的一个 Promise 对象，而 await 命令就是内部 then 命令的语法糖。

## 基本用法

async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。

```js
function fetchUser() {
  return new Promise((resolve, reject) => {
    fetch("https://api.github.com/users/superman66").then(
      data => {
        resolve(data.json());
      },
      error => {
        reject(error);
      }
    );
  });
}
/**
 * Promise 方式
 */
function getUserByPromise() {
  fetchUser().then(
    data => {
      console.log(data);
    },
    error => {
      console.log(error);
    }
  );
}
getUserByPromise();
/**
 * async 方式
 */
async function getUserByAsync() {
  let user = await fetchUser();
  return user;
}
getUserByAsync().then(v => console.log(v));
```

## 语法

- async 函数返回一个 Promise 对象，async 函数内部 return 返回的值。会成为 then 方法回调函数的参数。
- await 命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。
- 当函数执行的时候，一旦遇到 await 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。

```js
async function f() {
  // 等同于
  // return 123;
  return await 123; //但是是异步的
}
```

## await 的错误处理

async 函数中只要一个 await 出现 reject 状态，则后面的 await 都不会被执行。

```js
let a;
async function correct() {
  try {
    await Promise.reject("error");
  } catch (error) {
    console.log(error);
  }
  a = await 1;
  return a;
}

correct().then(v => console.log(a)); // 1
```

方法二：

```js
async function fn() {
  const response = await ajax().then(null, e => {
    throw e;
  });
}
fn();
```

## 小知识

- await 会等后面异步代码结束，这就导致了 await 下面的代码会变成异步的
- await 天生串行，但是当 await 在 for 循环中时会变成并行

```js
async function fn() {
  let array = [ajax1, ajax2, ajax3];
  for (let i = 0; i < array.length; i++) {
    await array[i]();
  }
}
//不等于
await ajax1();
await ajax2();
await ajax3();
```

- JS 的网络请求是由浏览器做的，浏览器可以同时进行很多网络请求
- async中同步函数放前面