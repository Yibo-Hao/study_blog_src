---
title:浏览器的事件循环
---

# 浏览器的事件循环

## 事件队列的历史

- 浏览器 JS 引擎的异步分为宏任务和微任务
- 在以前浏览器 JS 引擎是没有微任务异步事件队列的，只有一个异步队列和函数执行栈
- 异步队列等待函数执行栈清空后开始压入执行栈
- 但是之后出现了 Promise.then 这个时候就需要一个优先级更高的异步事件队列，它需要在原来的异步队列之前先压入执行栈，这就诞生了微任务

## 异步函数执行顺序

1. 扫描代码，所有同步函数入栈，当 Stack 中执行到异步任务的时候，就将他丢给 WebAPIs,接着执行同步任务,直到 Stack 为空；
2. 此期间 WebAPIs 完成这个事件，把回调函数放入队列中等待执行（微任务放到微任务队列，宏任务放到宏任务队列）
3. 执行栈为空时，Event Loop 把微任务队列执行清空；
4. 微任务队列清空后，进入宏任务队列，取队列的第一项任务放入 Stack(栈）中执行，回到第 1 步。

![](https://user-gold-cdn.xitu.io/2020/5/9/171f814a5e1fe0c3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 宏任务和微任务

* 微任务：then 、messageChannel 、mutationObersve
* 宏任务：setTimeout、setInterval、setImmediate(只兼容 ie)，script全部代码（浏览器暂时不支持）、I/O、UI Rendering。
* script全部代码指的是先执行完所有script代码
