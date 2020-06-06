---
title:刷题
---

# 刷题

## Promise 串行

页面有两个按钮 A 和 B，以及一个输入框，A 按钮点击后发送一个请求，返回一个字符串 A，B 也发请求，但返回字符串 B，返回后会把字符串赋值给输入框，但是 A、B 发送的两个请求返回的时间不同,点击两个按钮的顺序也不一定，B 要比 A 先返回，而最终效果要求是输入框字符的顺序是 A B。

一句话解释：先点击哪个哪个的结果先拿到，即使可能后面点击的先结束

```js
let PromiseA = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("字符串A");
    }, 5000);
  });
};
let PromiseB = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("字符串B");
    }, 3000);
  });
};
let eventArray = [];
let orderArray = [];
function ask() {
  let lastN = orderArray[orderArray.length - 1][0];
  let lastS = orderArray[orderArray.length - 1][1];
  if (eventArray[0][0] === lastN) {
    eventArray[0][1].call(null, lastS);
    eventArray.shift();
    orderArray.pop();
    ask();
  }
}
ButtonA.onclick = () => {
  let n = Math.random();
  PromiseA().then(result => {
    orderArray.push([n, result]);
  });
  eventArray.push([
    n,
    s => {
      input1.value = s;
    }
  ]);
};
ButtonB.onclick = () => {
  let n = Math.random();
  PromiseB().then(result => {
    orderArray.push([n, result]);
    ask();
  });
  eventArray.push([
    n,
    s => {
      input1.value = s;
    }
  ]);
};
```

需求：依次点击 A B，虽然 B 比 A 先结束，但是仍然先显示 A--串行
代码逻辑：

1. 点击按钮我们做两件事情：

- 点击按钮时，把需要一个随机数和本来应该在 then 中执行的回调推入 eventArray 数组
  这步代码是同步的，因此点击时立马执行，**eventArray 真实地反映了点击顺序**
- 点击按钮时，还需要一个异步函数接受 promise 成功后返回的结果，Promise().then 接受的函数，要把一个随机数和 promise 返回的结果推入 orderArray，**orderArray 真实地反映了 PromiseA 和 PromiseB 哪个先结束**
- 在点击两个按钮后 eventArray 的顺序已经确定
- 在每次 orderArray 推入新值都要执行一个 ask 函数，目的是为了判断**这次**推入的和 eventArray**第一个**是否一致。

## async

```js
let a = 0;
let test = async () => {
  a = a + (await 10);
  console.log(a)
};
test()
console.log(++a)
```
* 打印出来1,10，
* async中await后面的代码是异步代码，test中的log在console.log(++a)之后执行
* 执行到 a = a + (await 10); 时 a + 属于同步代码，等到await才开始异步的