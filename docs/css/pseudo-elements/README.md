---
title:pseudo-elements and pseudo-classes
---

# 伪元素和伪类

## 伪类
伪类用于当**已有**元素处于的某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。比如说，当用户悬停在指定的元素时，我们可以通过:hover 来描述这个元素的状态。虽然它和普通的 css 类相似，可以为已有的元素添加样式，但是它只有处于 dom 树无法描述的状态下才能为元素添加样式，所以将其称为伪类。

## 伪元素
伪元素用于创建一些**不在**文档树中的元素，并为其添加样式。比如说，我们可以通过:before 来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

## 小结
伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档数外的元素。因此，伪类与伪元素的区别在于：有没有创建一个文档树之外的元素。

## 冒号问题
CSS3 规范中的要求使用双冒号 (::) 表示伪元素，然而，除了少部分伪元素，如::backdrop 必须使用双冒号，大部分伪元素都支持单冒号和双冒号的写法，比如::after，写成:after 也可以正确运行。虽然 CSS3 标准要求伪元素使用双冒号的写法，但也依然支持单冒号的写法。为了向后兼容，我们建议你在目前还是使用单冒号的写法。

## 状态伪类

1. :link，选择未访问的链接
2. :visited，选择已访问的链接
3. :hover，选择鼠标指针浮动在其上的元素
4. :active，选择活动的链接
5. :focus，选择获取焦点的输入字段

## 结构化伪类
1. :not() 否定伪类，用于匹配不符合参数选择器的元素。
2. :first-child
3. :last-child
4. :nth-child
4. :nth-last-child
4. p:first-of-type 选择在父元素中第一个出现的<p>
5. :last-of-type
6. :nth-of-type
7. :only-child，当元素是其父元素中唯一一个子元素时，:only-child 匹配该元素。
8. :only-of-type，当元素是其父元素中唯一一个特定类型的子元素时，:only-child 匹配该元素。
9. :target，当 URL 带有锚名称，指向文档内某个具体的元素时，:target 匹配该元素。http://example.com/#target

## 表单伪类
1. :checked，:checked 匹配被选中的 input 元素，这个 input 元素包括 radio 和 checkbox。
2. :default，:default 匹配默认选中的元素，例如：提交按钮总是表单的默认按钮。
3. :disabled，:disabled 匹配禁用的表单元素。`<input type="text" disabled/>`
4. :empty，:empty 匹配没有子元素的元素。如果元素中含有文本节点、HTML 元素或者一个空格，则:empty 不能匹配这个元素。
5. :enabled，:enabled 匹配没有设置 disabled 属性的表单元素。
6. :indeterminate，indeterminate 的英文意思是“ 不确定的”。当某组中的单选框或复选框还没有选取状态时，:indeterminate 匹配该组中所有的单选框或复选框。
7. :valid，:valid 匹配条件验证正确的表单元素。同理:invalid

## 其他
1. :root，:root 匹配文档的根元素。一般的 html 文件的根元素是 html 元素，而 SVG 或 XML 文件的根元素则可能是其他元素
2. :fullscreen 匹配处于全屏模式下的元素。全屏模式不是通过按 F11 来打开的全屏模式，而是通过 Javascript 的 Fullscreen API 来打开的，不同的浏览器有不同的 Fullscreen API。目前，:fullscreen 需要添加前缀才能使用。

## 伪元素
1. ::before/:before，:before 在被选元素前插入内容。需要使用 content 属性来指定要插入的内容。被插入的内容实际上不在文档树中。
2. ::after/:after，:after 在被元素后插入内容，其用法和特性与:before 相似。
3. ::first-letter/:first-letter，:first-letter 匹配元素中文本的首字母。被修饰的首字母不在文档树中。
4. ::first-line/:first-line，:first-line 匹配元素中第一行的文本。这个伪元素只能用在块元素中，不能用在内联元素中。
5.  ::placeholder，:placeholder 匹配占位符的文本，只有元素设置了 placeholder 属性时，该伪元素才能生效。

## 小结
* 伪类指已经在DOM树的元素，但是无法描述它的状态。
* 伪元素指DOM树没有的（例如before）元素或者虽然存在但是不作为DOM树一部分的元素（例如first-line）
* 理解first-line和first-child的区别，两种虽然都存在，但是前者不是dom树一部分，后者是dom树一部分，这就区别了伪元素和伪类