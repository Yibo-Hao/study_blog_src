---
title:Vue-数据响应式-数据的监听和代理
---

# Vue-数据响应式-数据的监听和代理

## 写在前面
vue的核心在于main.js文件里面的new vue，它根据接受的选项对象，把视图、数据和事件结合一起渲染到屏幕上  
```
const vm = new vue(options) //核心代码
```

vm实例有什么属性，共有属性__proto__(vue构造函数的prototype)。

vue构造函数的prototype有什么属性，以及构造函数本身有什么属性。
    
## options.data
```
import Vue from "vue";

Vue.config.productionTip = false;
let mydata = {
    n : 0
}
new Vue({
  data: mydata,
  template: `
    <div>
        {{n}}   
      </div>
  `,
  methods: {
    add(){
        mydata.n +=1    
    }
  }
}).$mount("#app");
```
我们可以在new vue 外面对mydata进行更新，vue会自动把数据渲染到页面上。

在一般情况下，我们不会有mydata对象，直接在data上写出n属性即可，add函数里用this代替mydata，因为vue实例代理了data里的属性，变成了vm.n，this就是指vm，vm也代理了add函数，变成了vm.add

下面我们看看Vue是怎么实现把data（或者说mydata）里的属性放到vm上的
## ES6 getter和setter
```
let obj1 = {      
    firstName: "gao",      
    name(){
        return this.firstName
    }
}
//我们 obj1.name() 调用它
```
```
let obj1 = {      
    firstName: "gao",      
    get name(){
        return this.firstName
    }
}

//我们 obj1.name 调用它
```
这样我们就去掉了方法调用的括号获取了obj1的firstName属性，这就是getter语法，**用于获取一个值**
```
let obj1 = {      
    firstName: "gao",      
    get name(){
        return this.firstName
    }
    set name(xxx){
        this.firstName = xxx[0] 
    }
}
//obj1.name = "高园园"
```
这样我们就提供setter设置了obj1的firstName属性，setter语法没有把参数放在函数括号里，而是直接赋值

* getter用于获取一个虚拟属性的值
* setter用于赋与虚拟属性值
* getter和setter创建了一个虚拟属性，虚拟属性不能在其他地方调用，并不存在一个name属性但确实对它可以读和写
* 通常这个虚拟属性和该对象的其他属性挂钩，你读的是虚拟属性实际上是其他属性的结合，你写的是虚拟属性实际是对其他属性的赋值
* 我们在对象定义的时候就把get xxx和 set xxx属性定义好了，我们定义完对象后没有办法再加get xxx和 set xxx属性
* 所以Object.defineProperty 出现了，在一个对象再定义完之后，想添加新的虚拟属性 


## Object.defineProperty(obj, prop, descriptor)
* obj：要在其上定义属性的对象。
* prop：要定义或修改的虚拟属性的名称。
* descriptor将被定义或修改的属性描述符。
* 返回值是被传递给函数的对象
* 默认情况下，使用 Object.defineProperty() 添加的属性值是不可修改（immutable）的。

除了上面那个代码，还需要创建一个变量_xxx来放虚拟属性，和上面分析的一样虚拟属性和该对象的其他属性挂钩，只不过挂钩的是外部的属性，因为虚拟属性并不存在
```
let _xxx  = 0

Object.defineProperty(data, 'xxx', {    
    get() {
      return _xxx;
    },
    set(value) {
      _xxx = value
    }
  });

//返回data对象
```
```
var o = {};

o.a = 1;
// 等同于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: true,
  configurable: true,
  enumerable: true
});

// 另一方面，
Object.defineProperty(o, "a", { value : 1 });
// 等同于：
Object.defineProperty(o, "a", {
  value: 1,
  writable: false,
  configurable: false,
  enumerable: false
});
```
configurable为false是情况如下：
```
var o = {};
Object.defineProperty(o, 'a', {
  get() { return 1; },
  configurable: false
});

Object.defineProperty(o, 'a', {
  configurable: true
}); // throws a TypeError
```

## Vue对data做了些啥
getter和setter属性的代理
```
let data1  = {}

Object.defineProperty(data1, 'n', {
        value : 0
  });
// 我们给data1 设置了n属性值为0
```

```
let data2 = {}

data2._n=0   //与虚拟属性挂钩

Object.defineProperty(data2, 'n', {
    get(){
        return this. _n 
    }，
    set(value){
        if(value < 0) return        
        this._ n = value
    }) 
//data2.n = -1 是无效的
```
* get给虚拟属性n赋值为this._n。直接data2.n就可以拿到
* set要求必须给虚拟属性一个值，如果这个值小于0就没啥，大于0就把这个值给this._n。使用data2.n = value
* 这个时候有问题，如果 _n 可以直接赋值为负数导致我们的代码无效了，我们能不能不在对象上面暴露与虚拟属性挂钩的属性？
```
let data3 = proxy({ data:{n:0} })             //匿名对象

function proxy({data}){        //析构
    
    const obj = {}

    0bject.defineProperty(obj, 'n', {
        get(){
            return data.n 
        }，
        set(value){
            if(value < 0) return        
            data.n = value
    })
    return obj  
} 
```
* obj就是代理，之后不管你对obj.n做什么，它都会对data.n做一遍，obj代理了匿名对象的data属性，析构赋值是要点
* data3就是obj，代理的n就是数据的n，
* data3.n 进行读写，实际上是对obj进行读写，只暴露了代理对象没有办法接触到真实对象（匿名对象里的data属性），obj的虚拟属性是n和匿名对象的data属性挂钩，obj又等于data3
* data3.n就是 obj的虚拟属性n

如果我们一定要给匿名对象里的data属性名字呢？
```
let myData5 = {n:0} 
let data5 = proxy({ data:myData5 } )   //匿名对象
//这个时候修改myData5.n = -1会导致代码失效
```
```
function proxy2({data}){ 
    let value = data.n  
    Object.defineProperty(data, 'n', {      //把mydata5的n变成虚拟的，和value挂钩                get(){      
            return value    
        },      
        set(newValue){      
            if(newValue<0)return      
            value = newValue    
        }  
        })  // data.n本来存在，接着继续get和set 属性n，虚拟属性就会覆盖原来的属性  
        const obj = {}  
        Object.defineProperty(obj, 'n', {    
          get(){      
          return data.n    
        },    
        set(value){      
        if(value<0)return      
        data.n = value    
        }  
    })    
    return obj 
}
```
* 先监听后代理，监听防止我们直接修改myData5的值，修改data5相当于修改obj
* 监听mydata（data）中的n：先把data的n偷来当原始值，再从data中删掉n，再给data一个虚拟的n。这个虚拟属性n的值就是之前偷来的n的值，如果给虚拟属性n一个大于0的值就把该值给之前偷来的n值。这样data中的n有任何改变我们都知道看得见。只有满足我们的条件我们才会允许data中的n改变。
* 所以虽然刚开始myData5（data）被声明在前面了，但是只要一对他执行proxy2函数，就把它的n偷来了，还把他在原来的位置删掉了，我们给还了它一个虚假的n，虚假的n被我们用get set监控着。它要是在外面想改变自己的虚假的n，必须经过我们的同意满足我们的条件才行。
* obj（data5）就是代理 ，obj（data5）的n就是data（mydata）的n
---
```
vm = new Vue({data: myData}) 和 let data5 = proxy({ data:myData5 } )
```
这两个看起来是不是很相似呢

1. 首先，会马上对myData的所有属性进行监控,也就是对myData进行改造
防止myData的属性在外面变了，vm不知道，知道属性变了就可以调用render(data),UI = render(data)

做法： 先把myData的属性n偷来变成我的value，在他的原位置删掉，我给你再补偿一个虚假的n，这个虚拟的n一直被我用get（value） set（value）控制，你在外面修改n，其实是我给你的虚拟的n，

你对data的任何修改，我Vue必须知道，不然我怎么对数据去渲染

2. 其次，会让vm成为改造后的myData的代理(proxy)所以vm就是data的代理，vm的n就是myData的（虚假的）n；对vm的n赋值，就相当于对myData的（虚假的）n赋值；  完全不直接操作myData的你，而是操作vm的n。而且this就是vm。所以this.n === vm.n === myData.假n，mydata传入之前和传入之后是不一样的  

现在就有两种方式修改数据，操作myData和操作vm
代理逻辑:vm=函数调用，函数接受实际数据对象，创建一个空对象，在空对象创建虚拟属性，虚拟属性与实际数据挂钩，函数调用返回这个对象，vm就代理了data上的属性 

vue对method也做了同样的处理，

**监听和代理分别是对客户对原数据对象和对实例操作的限制**即this.n和对data直接操作的限制



## 啥是代理(设计模式)
* 对myData对象的属性读写，全权由另一个对象vm负责
* 那么vm就是myData的代理(类比房东租房)
* 比如myData.n不用，偏要用vm.n来操作myData.n

## 数据响应式
“响应式”，是指当数据改变后，Vue会通知到使用该数据的代码。例如，视图渲染中使用了数据，数据改变后，视图也会自动更新。

* options.data
* 会被Vue监听
* 会被Vue实例代理
* 每次对data的读写都会被Vue监控，或者对实例的读写都会被监控
* Vue会在data变化时更新UI（因为UI用到了data，data变UI也变）
* 变化的代码放在set函数里

## 定义
1. Vue的data是响应式

const vm = new Vue({data: {n: 0}) 我如果修改vm.n(或者data.n),那么因为视图是对数据的渲染，所以视图中的n（UI中的n）也会改变做出反应也就是响应。这就是数据响应式。

2. 如何实现数据响应式 Vue 2通过Object.defineProperty（和get set)实现对数据的监听从而实现数据响应式

## Vue的data的局限性
如果数据中有新增加的内容，那该怎么去监听？

监听数据的话，用Object.defineProperty(obj, 'n' ,.})的话，数据中必须要有真的n
```
new vue({
   template:`{{n}}`   
   data:{}
})
```
Vue会给出一个警告：属性或者方法n没有定义在实例上，但是却被你在渲染时引用了
但是由于vue只会监测第一层，所以产生以下代码绕过了警告

* vue对于undefined或者null就不会显示
* data中定义了obj，obj中有个a，所以obj和obj.a都被Vue监听&代理了（vm.obj===myData.obj），对a变化了因为视图因为用了a所以也会改变
* 但是并没有声明obj中还有个b，所以没有对obj.b监听&代理。所以此时对obj.b赋值并且放在视图，视图根本没变化，Vue认为根本没这样的存在。
```
methods:{
    setB(){
        this.obj.b = 1;
    }
}
data:{
    obj:{
        a:0;
    }
}
```
## 解决办法

* 方法一：那我把数据中每个key一次性都声明好，也就全部监听好了
```
obj{
    a:0,
    b:undefined
}
```
* 方法二：使用Vue.set或者this. $set
```
setB(){
Vue.set(this.obj,'b',1)

//或者,多了个$是为了防止和data中万一有个set咋办 ，$是实例方法
this.$set(this.obj,'b',1)
}
```
作用

①新增key

②自动创建代理和监听(如果没有创建过)

③触发UI更新(但并不会立刻更新)

## 数组解决办法
```
data:{
  arraty:["a","b","c"]
}
```
data中有数组怎么办?你没法提前声明所有key

* 方法一：使用Vue.set或者this. $set ，新增key,但是不会创建监听和代理，会更新UI

示例1:数组的长度可以一直增加，下标就是key 你看，你没有办法提前把数组的key都声明出来 Vue也不能检测对你新增了下标 难道每次改数组都要用Vue.set或者this.$set

* 方法二：使用新的数组的API,见官网中「变异方法」章节,这7个API都会被Vue篡改，这7个新API会调用数组原来的API并且自动增加监听和代理，并更新UI

如何篡改的：新增加一层原型，这层原型继承了数组原型，这层原型有七个API，这七个API都会调用之前的数组原型中对应的那个API，push还是按原来的push只是多执行几行代码，之后set该set的东西。

以push为例
```
class VueArray extends Array{   //新增加一层原型VueArray，继承以前的Array原型
push(...args){  //新原型的push方法
const oldLength = this.length // this就是当前数组
super.push(...args)       //会调用上一层原型（原来数组）的push方法
for(let i = oldLength; i<this.length; i++){  //把之前的下标和现在新的下标找出来，中间的不就是新增加的，那就set他们就行了。
Vue.set(this, i, this[i])
// key Vue
} } }  
```

## 总结
1. 数据的对象中想新增的key，Vue没有办法事先监听和代理，要使用set来新增key,创建监听和代理，更新UI。结论：数据的对象的话提前把属性都写出来，不要新增key
2. 但数据的数组做不到不新增key，因为数组总是要加东西的，数组中新增的key，也可用set来新增key,但是不会创建监听和代理，会更新UI；还有一种方法就是尤大篡改了7个API方便你对数组进行增删（改不用监听，查不用监听），这7个API会自动处理监听和代理，并更新UI。因此结论:数据的数组新增key最好通过7个API
