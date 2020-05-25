---
title:链表
---

# 链表

## 写在前面

数据结构就是各数据元素之间的逻辑关系，大致分为集合关系，线性关系，树关系，图关系

## 线性表存储结构

线性表在内存中的两种数据结构

- 链式存储
- 顺序存储，静态，动态

## 数组的缺陷

在很多编程语言中，数组的长度是固定的，所以当数组已被数据填满时，再要加入新的元素就会非常困难。在数组中，添加和删
除元素也很麻烦，因为需要将数组中的其他元素向前或向后平移，以反映数组刚刚进行了
添加或删除操作。

JavaScript 中数组的主要问题是，它们被实现成了对象，与其他语言的数组相比，效率很低。

除了对数据的随机访问，链表几乎可以用在任何可以使用一维数组的情况中。

## 链表的基本概念
* 为了表示数据元素与后继数据元素之间的逻辑关系，对数据元素来说不仅要存储本身的数据还要存储后继元素的位置。
* 分别称为数据域和指针域，两部分合起来称为结点
* 数据元素就是结点，一组结点组成的集合称为数据对象
* 我们把第一个结点的位置叫做头指针，为了更加方便的操作链表会在单链表的第一个结点前附加一个结点称为头结点，头结点的数据域不存储任何东西，头结点可以没有。

链表是由一组结点组成的集合。每个结点都使用一个对象的引用指向它的后继。指向另一
个结点的引用叫做链。（一个变量存了其他变量的地址就叫对其他变量的引用）

## 头结点和头指针
* 有了头结点，对第一个元素结点前插入结点和删除第一结点的操作和其他操作统一了。
* 头结点不是必要要素
* 链表中第一个结点的存储位置叫做头指针

## 链表的基本操作

* 找到值对应的结点 find(item)
* 找到值对应的前一个结点 findPrevious(item)
* 在值后面插入结点 insert(element,item)
* 移除值对应的结点 remove(item)

## 链表的JavaScript实现
每一个node为一个对象，因为js语言的实现，对象赋值，赋值的是地址
```
function Node(element) {
  this.element = element;
  this.next = null;
}
function LinkedList(head) {
  this.head = new Node(head);
  this.find = find;
  this.insert = insert;
  this.remove = remove;
  this.findPrevious = findPrevious;
  this.travel = travel()
}
function find(item) {
  let currNode = this.head;
  while (currNode.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function insert(element, item) {
  let newNode = new Node(element);
  let current = this.find(item);
  newNode.next = current.next;
  current.next = newNode;
}
function remove(item) {
  let preNode = this.findPrevious(item);
  if (preNode) {
    preNode.next = preNode.next.next;
  }
}
function findPrevious(item) {
  let currNode = this.head;
  while (currNode.next && currNode.next.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function travel(callback) {
  let currNode = this.head;
  while (currNode !== null) {
    callback(currNode);
    currNode = currNode.next;
  }
}

```

## 双向链表
管从链表的头结点遍历到尾结点很简单，但反过来，从后向前遍历则没那么简单。通过
给 Node 对象增加一个属性，该属性存储指向前驱结点的链接。
```
function DbNode(element) {
  this.element = element;
  this.next = null;
  this.previous = null;
}
function DbLinkedList(head) {
  this.head = new DbNode(head);
  this.insert = insert;
  this.find = find;
  this.remove = remove;
}
function insert(element, item) {
  let newNode = new DbNode(element);
  let current = find(item);
  newNode.next = current.next;
  newNode.previous = current;
  current.next = newNode;
}
function find(item) {
  let currNode = this.head;
  while (currNode.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function remove(item) {
  let currNode = find(item);
  if (currNode !== null) {
    currNode.previous.next = currNode.next;
    currNode.next.previous = currNode.previous;
  }
}
```
## 循环链表
循环链表和单向链表相似，结点类型都是一样的。唯一的区别是，在创建循环链表时，让
其头结点的 next 属性指向它本身。
```
function CircularLinkedList(head) {
  this.head = new Node(head);
  this.head.next = this.head;
}
```
加一行代码就可以解决,travel方法会死循环,remove方法也要考虑到移除头结点要考虑到this.head始终存在的问题。

## 循环链表解决实际问题
传说在公元 1 世纪的犹太战争中，犹太历史学家弗拉维奥·约瑟夫斯和他的 10 个同胞
被罗马士兵包围。犹太士兵决定宁可自杀也不做俘虏，于是商量出了一个自杀方案。他
们围成一个圈，从一个人开始，数到第三个人时将第三个人杀死，然后再数，直到杀光
所有人。约瑟夫和另外一个人决定不参加这个疯狂的游戏，他们快速地计算出了两个位
置，站在那里得以幸存。写一段程序将 n 个人围成一圈，并且第 m 个人会被杀掉，计算
一圈人中哪两个人最后会存活。使用循环链表解决该问题。
```
function Node(element) {
  this.element = element;
  this.next = null;
}
function LinkedList(head) {
  this.head = new Node(head);
  this.head.next = this.head;
  this.find = find;
  this.insert = insert;
  this.remove = remove;
  this.findPrevious = findPrevious;
  this.travel = travel;
  this.advance = advance;
}
function find(item) {
  let currNode = this.head;
  while (currNode.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function insert(element, item) {
  let newNode = new Node(element);
  let current = this.find(item);
  newNode.next = current.next;
  current.next = newNode;
}
function remove(item) {
  let preNode = this.findPrevious(item);
  if (preNode) {
    if (this.find(item) === this.head) {
      this.head = this.head.next;
      preNode.next = this.head;
      return;
    }
    preNode.next = preNode.next.next;
  }
}
function findPrevious(item) {
  let currNode = this.head;
  while (currNode.next && currNode.next.element !== item) {
    currNode = currNode.next;
  }
  return currNode;
}
function travel(callback) {
  let currNode = this.head;
  do {
    console.log(currNode.element);
    callback(currNode);
    currNode = currNode.next;
  } while (currNode.element !== this.head.element);
}
function advance(n) {
  let currNode = this.head;
  while (n > 0) {
    currNode = currNode.next;
    n = n - 1;
  }
  return currNode;
}

function code() {
  let list = new LinkedList(1);
  let length = 1;
  let n = 2;
  for (let i = 1; i < 10; i++) {
    list.insert(i + 1, i);
    length += 1;
  }
  while (length > 3) {
    list.remove(list.advance(n).element);
    n += 2;
    length -= 1;
  }
}
code();
```
## 引入头结点
```
function LinkedList() {
    this.head = new Node(new Symbol());
}
```
删除第一个元素结点也统一了

在引入头结点之前没有办法做到删除第一个结点，具体看remove代码，现在我们可以了因为this.head不会永远不会被删除。

## 整表删除
* 在c语言中没有垃圾回收机制，只能手动删除或者程序结束回收
* 但是我们浏览器有回收机制，对象不被引用就被回收了，把代表链表的变量赋值为null，直接清零。
* a = new LinkedList，a并不是头结点，a.head才是头结点，一般来说a和a.head都是不会被删除的。