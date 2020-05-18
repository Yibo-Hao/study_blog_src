---
title:JS专精-柯里化/闭包隐藏变量的原因
---

# JS专精-柯里化/闭包隐藏变量的原因

## 什么是柯里化？
柯里化其实是函数式编程的一个过程，在这个过程中我们能把一个带有多个参数的函数转换成一系列的嵌套函数。它返回一个新函数，这个新函数期望传入下一个参数。

它不断地返回新函数（像我们之前讲的，这个新函数期望当前的参数），直到所有的参数都被使用。参数会一直保持 alive（通过闭包），当柯里化函数链中最后一个函数被返回和调用的时候，它们会用于执行。
```
function multiply(a, b, c) {
    return a * b * c;
}
multiply(1,2,3); 
```
柯里化：
```
function multiply(a) {
    return (b) => {
        return (c) => {
            return a * b * c
        }
    }
}
multiply(1)(2)(3)
```
JS没有尾递归优化，所以return之后之前压入的上下文并没有弹出，参数自然也不会死亡。

## 闭包能够隐藏变量的原因

```
function createA(){
    let a = 1;
    return ()=>{
        a += 1;
    }
}
let myfunction = createA()
```
只要里面的函数存在且使用了外部作用域的变量（该函数词法环境存在外部引用）那么外部作用域就不会消亡。

调用好createA之后，返回的函数记作fn使用了createA中的变量，fn的词法环境的外部引用导致了createA词法环境不消亡。之后**更新全局上下文**，使得fn永远存在也使得被fn引用的变量a永远存在。

**只要记住全局上下文始终存在就可以理解闭包的含义**，createA返回的函数更新了全局上下文，使的该函数和被该函数引用的外部变量始终存在

## 通用的柯里化函数
让我们开发一个函数，它能接受任何函数并返回一个柯里化版本的函数。
```
let currify = (fn, params = []) => {
  return arg => {
    const params2 = params.concat(arg);
    if (params2.length === fn.length) {
      return fn(...params2);
    } else {
      return currify(fn, params2);
    }
  };
};
const addTwo = function(a, b) {
  return a + b;
};
let newAddTwo = currify(addTwo);
newAddTwo(1)(2);
```
* currify返回一个函数f1赋值给一个变量
* 调用f1时我们传入一个参数赋值给形参arg
* 如果参数个数不一致继续返回函数我们继续传参
* 注意可以柯里化的函数形参一定是有限个(...arg)=>{arg.reduce((sum,n)=>{sum+n,0})}不可以柯里化，柯里化一定要知道函数什么时候结束。

## tips
* 函数中 arguments.length 指的是实参的个数
* 函数的 length 指的是形参的个数
* 浏览器的 length 指浏览器页面和iframe的个数


## 柯里化作用
举个例子，你有一个商店 ，你想给你的顾客 10% 的折扣：
```
function discount(price, discount) {
    return price * discount
}
const price = discount(500,0.10)
```
虽然代码多了但是控制性更强了，逻辑更简单了
```
function discount(discount) {
    return (price) => {
        return price * discount;
    }
}
const tenPercentDiscount = discount(0.1);
tenPercentDiscount(500); // $50
```
tenPercentDiscount函数就是1折优惠函数