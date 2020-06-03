---
title:css
---

# css

写点容易忘记的 css 属性

## overflow

overflow 定义当一个元素的内容太大而无法适应 块级格式化上下文 时候该做什么。它是 overflow-x 和 overflow-y 的 简写属性 。

```css
/* 默认值。内容不会被修剪，会呈现在元素框之外 */
overflow: visible;

/* 内容会被修剪，并且其余内容不可见 */
overflow: hidden;

/* 内容会被修剪，浏览器会显示滚动条以便查看其余内容 */
overflow: scroll;

/* 由浏览器定夺，如果内容被修剪，就会显示滚动条 */
overflow: auto;

/* 规定从父元素继承overflow属性的值 */
overflow: inherit;
```

为使 overflow 有效果，块级容器必须有一个指定的高度（height 或者 max-height）或者将 white-space 设置为 nowrap。

## reset

```css
*,*::before,*::after{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
button,input{
  border: none;
}
ul,ol{
  list-style: none;
}
a{
  text-decoration: none;
}
body{
  font-family: -apple-system, "Noto Sans", "Helvetica Neue", Helvetica, "Nimbus Sans L", Arial, "Liberation Sans", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans SC", "Source Han Sans CN", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
  font-size: 16px;
  line-height: 1.2;
}
```

## a标签样式 