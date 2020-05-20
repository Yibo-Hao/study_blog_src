# React的CSS方案

## CSS的缺陷
* 样式与状态相关的情况越来越多，需要动态、能直接访问组件state的css。
* css不是组件化。一切样式都是全局，类的命名重复，但当你使用三方插件时却无法避免命名冲突。
* 
## 关于sass题外话
* sass指预编译器和缩进式css语言
* 预编译器有两种node-sass和dart-sass，node-sass已经退出舞台了
* scss并不能解决css的问题


## Vue的解决方案
* v-bind 和 class/style 的结合,解决了依赖变化时样式发生变化  
`<div v-bind:class="{ active: isActive }"></div>`，  
`<div v-bind:class="[activeClass, errorClass]"></div>`，  
`<div v-bind:style="styleObject"></div>`  
`<div v-bind:style="[baseStyles, overridingStyles]"></div>`
* scoped css的语法

## 内联CSS
传统的inline-style
```
const textStyles = {
  color: 'white',
  backgroundColor: this.state.bgColor
};

<p style={textStyles}>inline style</p>
```
和Vue的内联样式非常相似
```
<div v-bind:style="styleObject"></div>
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```
缺陷：
* 内联样式并不支持所有的 css，媒体查询，:before和:nth-child等 pseudo selectors   

Vue可以通过计算属性计算出一个样式对象，解决了样式与状态相关的情况。切换class也可以做到


## 引入式CSS
最普通常见的方式，在 jsx 文件中引入`import './App.css'`，这种方式适合引入CSS-reset和SCSS的全局变量。  

@import-normalize 是 create-react-app 官方自带的 reset 和我们常用的 reset 的区别就在于，我们会把所有样式都清零，而normalize只是给所有标签加了一个默认样式，消除了不同浏览器对不同标签的默认样式。

normalize 并没有什么卵用。

## Css in Js
主要依赖于很多React库Radium，Aphrodite，下面介绍一下[Radium](https://github.com/FormidableLabs/radium/tree/master/docs/guides)
```
import Radium from 'radium';

const Button = () => (
    <button
        style={styles.red}>
        {this.props.children}
    </button>;
)

var styles = {
  red: {
    backgroundColor: 'red'
  }
};

Button = Radium(Button);
```
Radium is activated by wrapping your component。

这种类型的库扩展了React能支持的css的范围，并且通过给Button组件传入一个对象，并把对象放到style数组中，完成了根据state变化style
```
    style={[
      styles.base,
      this.props.block && styles.block
    ]}>
```
样式只作用于import它的组件

## Css Modules
Css Modules 并不是React专用解决方法，适用于所有使用 webpack 等打包工具的开发环境。以 webpack 为例，在 css-loader 的 options 里打开modules：true 选项即可
```
import styles from './table.css';

    render () {
        return <div className={styles.table}>
            <div className={styles.row}>
                <div className={styles.cell}>A0</div>
                <div className={styles.cell}>B0</div>
            </div>
        </div>;
    }
/* table.css */
.table {}
.row {}
.cell {}
```
Css Modules还有一大缺憾：和Vue的解决一样，因为css写在css文件，无法处理动态css。


## styled-components
ES6 的模板字符串，在js文件里写纯粹的css。
```
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;
```
返回的是一个带样式的组件
```
// 在充分使用css全部功能的同时，非常方便的实现动态css， 甚至可以直接调用props！
const Wrapper = styled.section`
  padding: 4em;
  background: ${props => props.bgColor};
`;
```

## 小结
* 要解决的两个问题：模块化和动态css
* 内联CSS，引入式CSS，CSS in JS，Css Modules
* 内联CSS：部分伪元素选择器不支持
* 引入式：样式作用于全局
* CSS in JS：很好的实现了state和style的结合，因为css就在js文件里直接访问就行
* CSS in JS 是对内联CSS的升级补充了内联不支持的部分选择器，完美地实现了模块化和动态CSS
* Css Modules:利用className来处理样式，无法处理动态css。