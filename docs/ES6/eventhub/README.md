---
title:JS专精-EventHub/ts实现
---
# JS专精-EventHub/ts实现

## 发布订阅模式
在发布订阅模式中，发布者和订阅者之间多了一个发布通道；一方面从发布者接收事件，另一方面向订阅者发布事件；订阅者需要从事件通道订阅事件。

订阅模式中，可以抽离出调度中心单独成一个文件，可以对一系列的订阅事件进行统一管理。

## 常见的订阅和发布
应用其实你已经使用过发布订阅模式了。
```
document.body.addEventListener( 'click', function(){
  console.log('clicked')
}, false );

document.body.click(); // 模拟用户点击
```
**监听就是订阅，点击就是发布**，点击body，body向订阅者发布被点击的消息就是发布，发布也可以理解为触发事件

## 类比
用户订阅了“xxx”日纸，当“xxx”日报发布时，把“xxx”日报送到用户手里。

事件是报纸，监听xxx事件就是“用户订阅xxx日报”，用户点击就是“xxx”日报发布，点击时触发的回调就是发布方送到用户手中。

我们可以推测出**发布需要触发订阅传的回调函数**

## API
* on-订阅（需要传入回调）
* emit-发布（需要传入回调函数的参数）
* off-取消订阅

## TypeScript实现
```
class EventHub {
  private cache: {[key:string]:Array<(...data) => void>} = {};
  on(eventName: string, fn: (data: unknown)=>void) {
    this.cache[eventName] = this.cache[eventName] || [];
    this.cache[eventName].push(fn);
  }
  emit(eventName: string, ...data) {
    (this.cache[eventName] || []).forEach(fn => {
      fn(...data);
    });
  }
  off(eventName: string, fn) {
    this.cache[eventName] = this.cache[eventName] || [];
    let index = undefined;
    for (let i = 0; i < this.cache[eventName].length; i++) {
      if (this.cache[eventName][i] === fn) {
        index = i;
        break;
      }
    }
    if (index === undefined) {
      return;
    } else {
      this.cache[eventName].splice(index, 1);
    }
  }
}

export default EventHub;

```
* on 把回调 fn push到对应事件名的数组中
* emit 调用对应事件名数组中的所有函数，并把emit的参数作为回调的参数
* emit的两个作用：①触发xxx事件②通知订阅方（通过调用on的回调函数）

## emit支持多参数
```
  emit(eventName: string, ...data) {
    (this.cache[eventName] || []).forEach(fn => {
      fn(...data);
    });
  }
```
TS的小注意点`...data: number[]`实际上是给data加类型，...只是运算符