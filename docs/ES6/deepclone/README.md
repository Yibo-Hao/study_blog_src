---
title:JS专精-JSON格式/JSON对象/深拷贝/函数作为参数
---

# JS专精-JSON格式/JSON对象/深拷贝/函数作为参数

深拷贝:拷贝前后的两个对象之间没有任何互相引用
## 序列化和反序列化

### JSON格式

* JSON：JavaScript Object Notation 【JavaScript 对象表示法】
* JSON不是编程语言是标记语言，跟HTML、XML、Markdown 一样，用来展示数据不涉及编译就普普通通放在内存中。
* JSON是一种轻量级的数据交换格式。易于人阅读和编写。同时也易于机器解析和生成。JSON采用完全独立于语言的文本格式， 这些特性使JSON成为理想的数据交换语言。

### 交互
客户端与服务端的交互数据无非就是两种，数组，对象。对象是一个无序的“‘名称/值’对”集合。数组是值（value）的有序集合。

### JSON 对值的类型和格式有严格的规定

* 复合类型的值只能是数组或对象，不能是函数、正则表达式对象、日期对象。
* 原始类型的值只有四种：字符串、数值（必须以十进制表示）、布尔值和null（不能使用NaN, Infinity, -Infinity和undefined）。
* 字符串必须使用双引号表示，不能使用单引号。
* 对象的键名必须放在双引号里面。
* 数组或对象最后一个成员的后面，不能加逗号。

### 数组和对象

![](https://user-gold-cdn.xitu.io/2020/5/21/17237327348aebe8?w=1280&h=588&f=png&s=160493)

![](https://user-gold-cdn.xitu.io/2020/5/21/1723733137b9fba9?w=1280&h=346&f=png&s=93462)
* 值（value）可以是双引号括起来的字符串（string）、数值(number)、true、false、 null、对象（object）或者数组（array）。这些结构可以嵌套。


## JSON 对象
JSON对象是 JavaScript 的原生对象，用来处理 JSON 格式数据。它有两个静态方法：JSON.stringify()和JSON.parse()

### JSON.stringify
JSON.stringify方法用于将一个值转为 JSON 字符串。该字符串符合 JSON 格式，并且可以被JSON.parse方法还原。
```
JSON.stringify('abc') // ""abc""
JSON.stringify(1) // "1"
JSON.stringify(false) // "false"
JSON.stringify([]) // "[]"
JSON.stringify({}) // "{}"

JSON.stringify([1, "false", false])
// '[1,"false",false]'

JSON.stringify({ name: "张三" })
// '{"name":"张三"}'
```

### 错误
* 如果对象的属性是undefined、函数或 XML 对象，该属性会被JSON.stringify过滤忽略。
* 如果数组的成员是undefined、函数或 XML 对象，则这些值被转成null。
* 不可以环引用会出错
* 不支持new Date() 会转换成ISO8601字符串
* 不支持正则表达式会变成空对象

###  JSON.parse()
JSON.parse方法用于将 JSON 字符串转换成对应的值。
```
JSON.parse('{}') // {}
JSON.parse('true') // true
JSON.parse('"foo"') // "foo"
JSON.parse('[1, 5, "false"]') // [1, 5, "false"]
JSON.parse('null') // null

var o = JSON.parse('{"name": "张三"}');
o.name // 张三
```
### 错误
如果发生错误，json语法不符合规则，就会出错，或者
```
try {
  JSON.parse("'String'");
} catch(e) {
  console.log('parsing error');
}
```
try catch js代码来消化错误

### 总结
* json格式和json对象不一样，一个是数据格式，一个是js库，**json格式都是字符串**
* 我们拿到json字符串，再变成js对象
* json是xml的升级版，比xml可以更好的体现出数据结构

## 递归克隆

JS的七种数据类型，除了object之外赋值只是简单的赋值而已，object赋值的地址，date，regExp，set，map都是对象的子类型

### instanceof运算符

instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。[]instanceof Object 是正确的。Object的prototype属性出现在了[]实例原型链上

### 函数的深拷贝

```
function deepClone(source) {
//////
if (source instanceof Function) {
      const dist = function() {
        return source.bind(this)(...arguments);
      };
      return dist;
  }
////
}
```
上面很好理解：我们调用dist时source.bind(this)会返回一个新的函数，bind中的this是dist调用时决定的，重新调用dist会重新绑定this，之后我们再修改source并不会影响source.bind(this)返回的新函数，自然不会影响dist
```
function deepClone(source) {
//////
if (source instanceof Function) {
      const dist = function() {
        return source.apply(this,arguments);
      };
      return dist;
  }
////
}
```
再看看上面代码你可能会有一个错觉我们修改source会影响dist函数。其实不会下面我们分析一下：
```
let a = function(a, b) {
  return a + b;
};
let b = deepClone(a);
```
1. 我们把a代表的函数地址（#101）传入deepClone
2. deepClone接受到函数（#101），dist使用apply调用函数（#101）
3. 我们修改a = function(a,b){a+2*b}
4. 此时**变量**a代表的函数地址改变（#102），但是 deepClone的参数仍是（#101）
5. 函数深拷贝其实很容易因为你无法在不创建新函数的情况下去修改一个原来的函数，函数作为参数一但传进去只要外部的函数（deepClone）不重新调用就不会改变

### 深拷贝
```
function deepClone(source) {
  if (source instanceof Object) {
    if (source instanceof Array) {
      const dist = [];
      for (let key in source) {
        dist[key] = deepClone(source[key]);
      }
      return dist;
    } else if (source instanceof Function) {
      const dist = function() {
        console.log(source === a);
        return source.bind(this)(...arguments);
      };
      return dist;
    } else {
      const dist = {};
      for (let key in source) {
        dist[key] = deepClone(source[key]);
      }
      return dist;
    }
  } else return source;
}
```

### 环的深拷贝

采用缓存[source, dist]存到数组中，根据source找dist即可
```
let cache = [];
function findCache(source) {
  for (let i = 0; i < cache.length; i++) {
    if (cache[i][0] === source) {
      return cache[i][1];
    }
  }
  return undefined;
}
function deepClone(source) {
  if (source instanceof Object) {
    let cacheDist = findCache(source);
    if (cacheDist) {
      return cacheDist;
    } else {
      let dist;
      if (source instanceof Array) {} 
      else if (source instanceof Function) {} 
      else {
        dist = {};
        cache.push([source, dist]);
        for (let key in source) {
          if (source.hasOwnProperty(key)) {
            dist[key] = deepClone(source[key]);
          }
        }
      }
      return dist;
    }
  } else return source;
}
```

### 日期和正则
```
    if (source instanceof RegExp) {
        dist = new RegExp(source.source, source.flags);
      } else if (source instanceof Date) {
        dist = new Date(source);
    } 
```

### for in
for...in 循环只遍历可枚举属性（包括它的原型链上的可枚举属性）。需要hasOwnProperty进行筛选


### 面向对象
```
class Clone {
  cache = [];
  deepClone(source) {}
  findCache(source) {}
}
```