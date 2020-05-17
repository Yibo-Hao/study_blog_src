---
title:JS专精-函数/闭包
---

# JS 专精-函数/闭包

## 函数的影响因素

> 重点：所有函数的问题都可以归结到这两个因素上

- 定义时输入的参数 params
- 定义时的环境 env

## 定义时的环境

根据 JS 的词法环境，函数的词法环境中的外部引用是函数在定义时的环境而不是调用时的环境，<strong>函数调用时才会创建函数词法环境 t</strong>

```
let x = 'x'
let a = '1'
function f1(x){
    return x + a
};
{
    let a = '2'
    f1('x') //值为"x+1"
}
```

```
function multiply(e, f) {
 var g = 20;
 return e * f * g;
}
multiply(20, 30);//此时创建的词法环境如下

FunctionExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 标识符在这里绑定
      Arguments: { 0: 20, 1: 30, length: 2 },
    },
    outer: <GlobalLexicalEnvironment>,
  ThisBinding: <Global Object or undefined>,
},
VariableEnvironment: {
  EnvironmentRecord: {
    Type: "Declarative",
        // 标识符在这里绑定
        g: undefined
  },
  outer: <GlobalLexicalEnvironment>,
      ThisBinding: <Global Object or undefined>
}
}
```

那么我们看下面代码：

```
let x = 'x'
let a = '1'
function f1(x){
    return x + a
};
a = "2"
{
    let a = '2'
    f1('x') //值为"x+2"
}
```

此时由于在函数调用之前，所以全局词法环境更新了，导致函数词法环境的外部引用更新了

## 闭包

并不是所有语言都会有闭包这种操作（函数访问外部变量），ruby 就不允许。

```
for(var i=0;i<6;i++){
    setTimeout(()=>console.1og(i),1000) // 箭头函数访问了i
}
```

函数执行时词法环境的外部引用是全局词法环境，执行时 i 已经更新到了 6。也可以简单理解为始终只有一个 i，深刻理解就是函数的词法环境中的外部引用始终是同一个词法环境

```
for(let i=0;i<6;i++){
    setTimeout(()=>console.1og(i),1000) // 箭头函数访问了i
}
```

```
for(let i=0;i<6;i++){
    let i = 隐藏作用域中的i // 看这里看这里看这里
    setTimeout(()=>console.1og(i),1000) // 箭头函数访问了i
}
```

1. for 循环的小括号是一个作用域，而花括号又是一个作用域，而小括号的作用域是包裹住了大括号作用域的。
2. for( let i = 0; i< 5; i++) { 循环体 } 在每次执行循环体之前，JS 引擎会把 i 在循环体的上下文中重新声明及初始化一次。
3. 所以函数上下文的词法环境中的外部引用不是同一个词法环境
4. 块级上下文和函数上下文创建是一样的

## 闭包的作用

- 闭包可以维持一个变量不死，但不能维持这个变量的值。
- 对象是穷人的闭包，对象也可以来维持住一个变量
- 如果一门语言不支持闭包，你可以用对象代理
- 闭包是穷人的对象
- 如果一门语言不支持对象，你可以用闭包代理

## this

在讲 this 之前回忆函数的声明方式，

1. new Function
2. function f(){}
3. let a = function(){}
4. let a = ()=>{}

前两种会在词法环境里被声明成函数。而后两种则是变量只是赋值而已。

**根据之前的词法环境分析法**在函数调用时才会创建函数上下文，上下文里的词法环境里的 this 绑定，才会确定 this 的值。箭头函数没有 this 只是定义时的 this。this 和外部引用一样是会更新的。

## 小结

现在我们回过头来看函数的两大因素，env 和 params，对应函数词法。我们得出 this 和外部引用都属于环境是会改变的，而参数一但传入就不会改变。这里的改变不改变只是说函数调用之前而不是函数调用时。

## 三种 this

- fn(1,2) ----window
- obj.method('hi') ---obj
- array[0]('hi') 等价于 array.0() ---array

重点：this 只有在调用时才会确定

window.length 就是浏览器窗口和 iframe 的个数，arguments.length 表示的是实际上向函数传入了多少个参数,这个数字可以比形参数量大,也可以比形参数量
