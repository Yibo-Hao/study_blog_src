---
title:aimation
---

# React 的动画方案

DOM 动画的基本方案无非两种

1. css3 动画
2. Js 改 css

前端动画都是围绕着两个来，React 也不例外，不过都是在这两者中平衡，下面是我能知道的一些方案：

## CSS animation

通过切换 CSS 的类名，一个是它原始的样式，一个是它 focus 后的样式，监听 focus 事件，来改变类名。

## JS Style

通过计算 style 来过渡

```jsx
<input style={styles.input} />
```

## 三方库

React Motion
