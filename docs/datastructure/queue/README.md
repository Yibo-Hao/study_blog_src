---
title:队列
---
# 队列

## 基本概念 
队列是一种列表，不同的是队列只能在队尾插入元素，在队首删除元素。队列用于存储按
顺序排列的数据，先进先出，队列是一种先进先出（First-In-First-Out，FIFO）的数据结构。  
浏览器/操作系统中的事件处理就是队列的数据结构，而函数调用栈使用栈数据结构。

## 队列的基本操作
* 插入操作也叫做入队 enqueue() 
* 删除操作也叫做出队 dequeue()
* 是读取队首队尾的元素 front(),back()。
* 队列中存储了多少元素使用 length 属性
* 清空队列中的所有元素，可以使用 clear() 方法
* toString() 方法显示队列内的所有元素

## 队列的顺序存储-JavaScript实现
线性表的顺序存储和链式存储，对于队列来说，也是同样适用的。
```
function Queue() {
  this.dataSource = [];
  this.enqueue = enqueue;
  this.dequeue = dequeue;
  this.front = front;
  this.back = back;
  this.toString = toString;
  this.clear = clear;
  this.empty = empty;
}

function enqueue(element) {
  this.dataSource.push(element);
}
function dequeue() {
  return this.dataSource.shift();
}
function front() {
  return this.dataSource[0];
}
function back() {
  return this.dataSource[this.dataSource.length - 1];
}
function toString() {
  let retStr = "";
  for (let i = 0; i < this.dataSource.length; ++i) {
    retStr += this.dataSource[i] + "\n";
  }
  return retStr;
}
function empty() {
  return this.dataSource.length === 0;
}
function clear() {
  this.dataSource = [];
}
```

## 使用队列来解决问题-基数排序
基数排序将数据集扫描两次，第一次按个位上的数字进行排序，第二次按十位上的数字进行排序。每个数字根据对应位上的数值被分在不同的盒子里。使用队列代表盒子。
```
function distribute(nums,queues,n,digit) {
    for (let i = 0;i<n;n++){
        if (digit === 1){
            queues[nums[i]%10].enqueue(nums[i])
        }else{
            queues[Math.floor(nums[i]/10)].enqueue(nums[i])
        }
    }
}
function collect(queues, nums) {
    let i = 0;
    for (let digit = 0; digit < 10; ++digit) {
        while (!queues[digit].empty()) {
            nums[i++] = queues[digit].dequeue();
        }
    }
}
```
下面是实例：
```
let nums = [45, 78, 78, 89, 45, 45, 42, 14, 48];
let queues = [];
for (let i = 0; i < 10; ++i) {
  queues[i] = new Queue();
}
distribute(nums, queues, 1);
collect(queues,nums);
distribute(nums, queues, 10);
collect(queues,nums);
```
先把nums数据放到queues里，再把queues数据按顺序放回nums里，进行两次就排好了

