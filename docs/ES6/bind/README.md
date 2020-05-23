---
title:JS专精-实现bind/apply/call
---

# JS专精-实现bind/apply/call

## 实现bind代码
```
export default function myBind(context, ...args) {
  const fn = this;
  args = args ? args : [];
  return function(...newFnArgs) {
    return fn.call(context, ...args, ...newFnArgs);
  };
}
```
```
let bind = Function.prototype.bind;
bind.call(f1,this,arguments)
```
* 函数也是可以调用函数的，比如f1.bind()，自然bind的this就是函数
* bind是返回一个绑定好的函数
* 参数一但传进来变成函数词法环境静态的一部分，不会改变的，所以达到了绑定的效果

## 支持 new 的 bind
要让bind返回的函数支持new操作，new操作会做下面四件事

1. 创建空对象obj
2. `obj.__proto__ = F1.prototype` 
3. F1.call(obj)
4. return obj

注意事项：
* 如果构造函数自带return，那么new的return obj不会实现
* 对于 new 来说， bind 绑定的 this 不影响构造函数里的 this。
* `let f1 = F1.bind(undefined,xxx)`

我们现在要让 f1 支持 new：

* `new f1` 由于源代码是返回一个函数调用导致new的时候无法返回实例对象，所以我们要判断当f1函数（bind返回的函数）前加new时，要返回一个实例。
* 我们根据new的四个过程发现f1.call(obj)和`obj.__proto__ = F1.prototype` 所以添加判断this instanceof newFn
* 但是我们想要的是fn的原型而不是newFn的原型
* 我们new的其实是newFn但是返回的却是new fn，根据new newFn来判断this instanceof newFn，判断成功返回new fn，new newFn只是缺少了四步new过程的最后一步而已。

```
Function.prototype.myBind = function (context, ...args) {
    const fn = this
    args = args ? args : []
    return function newFn(...newFnArgs) {
        if (this instanceof newFn) {
            return new fn(...args, ...newFnArgs)
        }
        return fn.apply(context, [...args,...newFnArgs])
    }
}
```

## 实现call
this拿到f.call的f函数，context.this来调用函数
```
    function myCall(context, ...args) {
    context = context || window
    args = args ? args : []
    const key = Symbol()
    context[key] = this
    const result = context[key](...args)
    delete context[key]
    return result
}
```

## 实现apply
```
    myApply = function myApply (context, args) {
    context = context || window
    args = args ? args : []
    const key = Symbol()
    context[key] = this
    const result = context[key](...args)
    delete context[key]
    return result
}
```
因为context是别人传过来的

## 小结
* call实现总结：this只有在调用时才知道，所以使用this拿到f，用context调用f即可===>context[key] = f
* bind实现技术总结：利用参数传进来的this不会改变，利用call调用即可