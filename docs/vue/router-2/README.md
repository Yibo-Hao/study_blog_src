---
title:router
---

# Vue 开发-router-2

## 导航守卫

有的时候，我们需要通过路由来进行一些操作，比如最常见的登录权限验证，当用户满足条件时，才让其进入导航，否则就取消跳转，并跳到登录页面让其登录。全局的, 单个路由独享的, 或者组件级的,

参数或查询的改变并不会触发进入/离开的导航守卫。你可以通过观察 \$route 对象来应对这些变化，或使用 beforeRouteUpdate 的组件内守卫。

导航就是我们说的路由，当路由发生变化的时候，我们想要做的事情，这就是导航守卫的重点。也就是路由的钩子

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在**重用**的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

### 全局守卫

用来监测所有的路由，代码写在路由页面(router.js)，vue-router 全局有三个守卫：

- router.beforeEach 全局前置守卫 进入路由之前
- router.beforeResolve 全局解析守卫(2.5.0+) 在 beforeRouteEnter 调用之后调用
- router.afterEach 全局后置钩子 进入路由之后

#### beforeEach

```javascript
router.beforeEach((to, from, next) => {
  // ...
});
router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next();
});
```

next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。

next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。

next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。

next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。

#### afterEach

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身：

```
router.afterEach((to, from) => {
  // ...
})
```

#### beforeResolve

注册一个全局守卫。这和 router.beforeEach 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调

### 路由独享的守卫

就是将路由钩子函数写在我们的某个具体路由对象里面：

```javascript
const router = new VueRouter({
  routes: [
    {
      path: "/foo",
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
});
```

### 组件内的守卫

- beforeRouteEnter
- beforeRouteUpdate (2.2 新增)
- beforeRouteLeave

```javascript
const Foo = {
  template: `...`,
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
};
```

## 动画效果

```javascript
<transition>
  <router-view></router-view>
</transition>
```

## 异步组件

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。  
const Foo = () => import('./Foo.vue')
在路由配置中什么都不需要改变，只需要像往常一样使用 Foo：

```
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

## keep-alive

`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。和`<transition>`相似，`<keep-alive>`是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。

`<keep-alive>`包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们，此种方式并无太大的实用意义。

使用 keep-alive 可以将所有路径匹配到的路由组件都缓存起来，包括路由组件里面的组件，keep-alive 大多数使用场景就是这种。

```vue
<keep-alive>
    <router-view></router-view>
</keep-alive>
```
当组件在` <keep-alive> `内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

activated在组件第一次渲染时会被调用，之后在每次缓存组件被激活时调用。

### activated调用时机：

第一次进入缓存路由/组件，在mounted后面，beforeRouteEnter守卫传给 next 的回调函数之前调用：
```javascript
   beforeMount=> 如果你是从别的路由/组件进来(组件销毁destroyed/或离开缓存deactivated)=>
   mounted=> activated 进入缓存组件 => 执行 beforeRouteEnter回调
```

因为组件被缓存了，再次进入缓存路由/组件时，不会触发这些钩子：beforeCreate created beforeMount mounted 都不会触发。
    
### deactivated：组件被停用(离开路由)时调用
    
使用了keep-alive就不会调用beforeDestroy(组件销毁前钩子)和destroyed(组件销毁)，因为组件没被销毁，被缓存起来了。