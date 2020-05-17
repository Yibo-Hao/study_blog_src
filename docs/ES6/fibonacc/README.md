---
title：递归/尾递归/记忆化/react的记忆化
---

# JS专精-递归/尾递归/记忆化/react的记忆化

## 递归实现
```
function fibonacc(n) {
  if (n === 0) {
    n = 0;
  } else if (n === 1) {
    n =  1;
  } else {
    n =  fibonacc(n - 1) + fibonacc(n - 2);
  }
  return n
}
```

## 调用栈
* JS引擎解析出全局上下文和可执行代码
* 然后把全局上下文压入栈，执行可执行代码遇到函数调用
* 把函数解析成同样两部分，把函数上下文压入栈
* 执行完之后弹栈更新全局上下文
* 递归就是不停地压栈，压到顶之后开始弹并且更新上一级上下文。
* 注意只压上下文


## 优化递归-尾递归
```
function fibonacc2(n) {
  return fibonacc3(2, n, 1, 0);
}
function fibonacc3(start, end, prev1, prev2) {
  if (start === end) {
    start = prev1 + prev2;
  } else {
    fibonacc3(start + 1, end, prev1 + prev2, prev2);
  }
}
```
注意单纯地把递归放到函数末尾并不是尾递归看下面代码：
```
function fibonacc(n) {
  if (n === 0) {
    return 0;
  } else if (n === 1) {
    return  1;
  } else {
    return  fibonacc(n - 1) + fibonacc(n - 2);
  }
}
```
fibonacc(n-1)结束后仍需要它的返回值来进行相加，所以必须保存fibonacc(n)的环境以供处理返回值。

* **尾递归：进入下一个函数不再需要上一个函数的环境了，得出结果以后直接返回。**  
* **非尾递归，下一个函数结束以后此函数还有后续，所以必须保存本身的环境以供处理返回值。**
* 尾递归通常会多一个参数，这个参数是上一次调用函数得到的结果，尾递归每次调用都在收集结果

但是JS就算下一个函数不再需要上一个函数的环境，仍然会压栈，所以JS没有尾递归操作。


## 循环代替递归

```
function fibonacc4(n) {
  let fibArray = [0, 1];
  for (let i = 0; i <= n - 2; i++) {
    fibArray[i + 2] = fibArray[i + 1] + fibArray[i];
  }
  return fibArray[fibArray.length - 1];
}
```

## 记忆化
虽然上一段代码是用数组实现的，也把算下来的值记录下来了，但这不是记忆化，比如说一次n是5另一次是4,第二次仍需要完整地计算一遍
```
function memozi(fn) {
  const cache = {};
  return function(n) {
    if (cache[n] == null) {
      cache[n] = fn(n);
      return cache[n];
    } else {
      return cache[n];
    }
  };
}

const fibfn = memozi(function (n) {
  if (n === 0) {
    return 0;
  } else if (n === 1) {
    return 1;
  } else {
    return fibfn(n - 1) + fibfn(n - 2);
  }
});
```
* 使用一个哈希表完整地记录下来所有的计算结果
* 计算第n个，就要去记忆里去找fibfn(n - 1) + fibfn(n - 2)
* 我们使用memozi返回的函数即可，如果这个函数在记忆查找无果那么就会调用memozi的回调函数来进行计算
* 记忆化：当memozi里面的回调没有变化时，就会从记忆中寻找值


## Raect记忆化
上面记忆化代码是否很像React的memo钩子。

React每次数据改变父组件函数会重新执行，而里面的子组件函数也会重新运行。虽然DOM没有更新但是子组件里面的代码会重新执行（得出的DOM仍和上次一样所以没有更新页面）。
```
child2 = React.memo(child)
```
但是
```
<child2 onClick = {()=>{}}/>
```
即使已经记忆化，点击child2时child2仍会重新执行，因为onClick的函数每次点击时就会创建新的函数，child2认为不一样了就会重新执行
```
let x = ()=>{}
<child2 onClick = {x}/>
```
这样仍会重新执行child2，因为父组件会重新执行，每次都会重新声明x。

我们需要函数的记忆化：我们们使用n来作为记忆索引，只要n不变那么这个函数就不变
```
let x = React.useCallback(()=>{},[n])
```

## 小结
* fibonacc的记忆化依靠n（第几个数）来索引
* React索引依靠我们提供数据来索引