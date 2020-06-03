---
title: line-height
---

# line-height

## 块级元素的高度

- 块级元素有两个高度可以设置，height 和 line-height
- 为块级元素设置 height 则它其拥有高度
- 当我们不为元素设置 height，而元素中有内容时，该元素依然获取到了高度,并不是由于文字撑起了高度，而是 line-height 撑起了 div
- 每一行文字都有一个 line box，这些一个个盒子自然撑起了父元素的高度
- 设置 line-height 和 height 相同数值则可以使得其中文字垂直居中,因为 line-height 的垂直居中性
- line-height 的值为数字时，表示的相对于 font-size 的倍数

## 什么是 font-size

- font-size 相同，font-family 不同，得到的 span 元素的高度也不同
- 一款字体会定义一个 em-square，它是用来盛放字符的金属容器。这个 em-square 一般被设定为宽高均为 1000 相对单位，不过也可以是 1024、2048 相对单位。这个 em-square 就是 font-size 的相对单位版本
- 在浏览器中，上面的 1000 相对单位会按照你需要的 font-size 缩放。

## 字体度量

- 字体度量都是基于 em-square 相对单位设置的，包括 ascender、descender、capital height、x-height 等。注意这里面的值是允许超出 em-square
- Catamaran 字体放到 FontForge 中，分析它的字体度量： em-square 是 1000 ascender 是 1100，descender 是 540。 Catamaran 字体占据了 1100 + 540 个相对单位，尽管它的 em-square 只有 1000 个相对单位，所以当我们设置 font-size:100px 时，这个字体里的文字高度是 164px。这个计算出来的高度决定了 HTML 元素的 content-area（内容区域）。你可以认为 content-area 就是 background 作用的区域。

![](https://user-gold-cdn.xitu.io/2017/12/21/16077e26ba801f16?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 两个概念：content-area 和 line-box。 line-box 的高度是根据子元素的高度计算出来的，而不是子元素的 content-area 的高度。

![](https://user-gold-cdn.xitu.io/2017/12/21/16077e5c90651c42?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## content-area 和 line-height

- content-area 的高度是由字体度量定义的
- line-height，这个高度用于计算 line-box 的高度
- line-height 和 content-area 高度的差异叫做 leading。leading 的一半会被加到 content-area 顶部，另一半会被加到底部。因此 content-area 总是处于 virtual-area 的中间。这就是 line-height 的垂直居中性
- line-height 可以等于、大于或小于 content-area。
- 字体有三个高度 font-size（em-square） 和 计算出来的高度 content-area 以及 line-height

## 对齐内联元素

- line-box 的高度是从子元素的最高点到最低点的。
  ![](https://user-gold-cdn.xitu.io/2017/12/21/16077f01f40abb98?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
- line-box 关于 baseline 对齐
  ![](https://user-gold-cdn.xitu.io/2017/12/21/16077ee0ab28800b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
- 这就用到了 vertical-align

## vertical-align

- 它是计算 line-box 高度的重要因素之一。
- 它的默认值是 baseline。字体度量里的 ascender 和 descender 分别是字体的最高点和最低点

* 现在的问题是对齐的是 line-height ，如果我们把每一个行盒的高度一致，但是字体计算出来的 content-area 仍然不一致，导致字体没有办法对齐
* vertical-align top 对齐
  ![](https://user-gold-cdn.xitu.io/2017/12/21/16077fac5a66ad78?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- vertical-align baseline 可以使字体对齐，但是 line-height 对不齐
- top 可以使 line-height 的上部对齐

## 结论
* 所有的内联元素都有两个高度：基于字体度量的 content-area 和 line-height 
* line-box 的高度的受其子元素的 line-height 和 vertical-align 的影响，子元素最高点到最低点