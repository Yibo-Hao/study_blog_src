---
title:栈
---
# 栈

## 基本概念

栈是一种特殊的列表，栈内的元素只能通过列表的一端访问，这一端称为栈顶。  
栈被称为一种后入先出（LIFO，last-in-first-out）的数据结构。所以任何不在栈顶的元素都无法访问。为了得到栈底的元素，必须先拿掉上面的元素。

## 栈的基本操作

* 入栈使用 push() 方法。
* 出栈使用 pop() 方法。
* peek() 方法则只返回栈顶元素，
* 而不删除它。clear() 方法清除栈内所有元素。
* length 属性记录栈内元素的个数。
* empty 属性，用以表示栈内是否含有元素

## 经典笔试题：出栈顺序

如果我们现在是有3个整型数字元素1、2、3依次进栈，会有哪些出栈次序呢? 
* 第一种: 1、2、3进，再3、2、1出。这是最简单的最好理解的一种， 出栈次序为321。
* 第二种: 1进，1出，2进，2出，3进，3出。也就是进一个就出一个，出栈次序为123。 
* 第三种: 1进，2进，2出，1出，3进，3出。出栈次序为213。
* 同理还有 132 和 231

## 栈的顺序存储-JavaScript实现
线性表的顺序存储和链式存储，对于栈来说，也是同样适用的。 
```
function Stack() {
  this.dataSource = [];
  this.top = 0;
  this.push = push;
  this.pop = pop;
  this.peek = peek;
  this.clear = clear;
  this.empty = empty;
  this.stackLength = stackLength;
}

function push(element) {
  this.dataSource[this.top++] = element;
}
function pop() {
  return this.dataSource[--this.top];
}
function peek() {
  return this.dataSource[this.top - 1];
}
function clear() {
  this.top = 0;
}
function stackLength() {
  return this.top;
}
function empty() {
  return this.top === 0;
}
```

可以看到clear和pop的时候并没有真正去除数据，只是改变top而已

## 使用栈来解决问题-转化进制
十进制到二进制：除2取余，逆序排列
```
function mulBase(num: number, base: number) {
  let result = "";
  if (base < 2 || base > 9) {
    throw "wrong base";
  } else {
    const stack = new Stack();
    do {
      stack.push(num % base);
      num = Math.floor((num /= base));
    } while (num > 0);
    while (stack.stackLength() > 0) {
      result += stack.pop();
    }
  }
  return result;
}
```
如果把一个字符串压入栈，那么栈内就存储了一个翻转的字符串

