---
title:router
---

# React-router-初见

## Vue-router

Vue Router 将路由规则集中在一个位置（router.js），使它们与布局组件分离。路由是一个单元，基本上是一个美化的配置文件。

## React-router 引入

由于我们的应用程序是用于浏览器的，所以我们需要将它封装的 BrowserRouter 中。还要注意的是我们现在从 react-router-dom 中导入它（这意味着我们安装的是 react-router-dom 而不是 react-router）。提示！现在叫做 react-router-dom 是因为还有一个 native 版本。

web 版本：

```react
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
```

Native 版本：

```
import { NativeRouter, Route, Link } from "react-router-native";
```

## 顶层 API

```jsx
export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
```

- Switch 里面写路由表（Route 组成）,路由表包裹着组件
- Router 里面写路由表和路由（Link 组成）
- 当你点击 Link 时，路由器会渲染匹配到的 Route
- Link 会渲染成一个真正的 a 标签
- Switch 遍历子路由，并且渲染第一个匹配的 url 。

## 动态参数

```jsx
<Link to="/modus-create">Modus Create</Link>

<Switch>
  <Route path="/:id" children={<Child />} />
</Switch>

function Child() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL. useParams 从 react-router-dom
  let { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
}
```

## 嵌套路由

routes 组件只是普通的 react 组件，因此他可以被写在任何地方包括子组件中

```jsx
export default function NestingExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/topics">
            <Topics />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
```

把嵌套路由写在子组件中：

```jsx
function Topics() {
  let { path, url } = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:topicId`}>
          <Topic />
        </Route>
      </Switch>
    </div>
  );
}
```

## useRouteMatch

### const match = useRouteMatch('xxx')

```jsx
const Home = () => {
  return <div>Home</div>;
};
// Header组件只会在匹配`/detail/:id`时出现
const Header = () => {
  // 只有当前路径匹配`/detail/:id`时，match不为null
  const match = useRouteMatch("/detail/:id");
  return match && <div>Header</div>;
};
const Detail = () => {
  return <div>Detail</div>;
};
function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/detail/:id" component={Detail} />
        </Switch>
      </Router>
    </div>
  );
}
```

### const { path, url } = useRouteMatch();

`<Link to={`\${url}/rendering`}>Rendering with React</Link>`
`<Route path={`\${path}/:topicId`}>`

## 路由的三个基础组件

### Router

- 网页端用到的所有组件都从 react-router-dom 引入
- 所有 SPA 的核心都应该是一个 Router 组件，react-router-dom 提供了 BrowserRouter and HashRouter
- 确保 router 包裹了根组件

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

### Route

- Route 被 Switch 包裹
- Switch 会搜寻子组件 Route 元素来找到谁的 path 匹配当前 url ，匹配后就会渲染该 Route 并且忽略其他
- 没匹配到就不渲染（null）
- 因为 Route path 匹配的是 url 的开始并不是整个 url，所以把 "/" 放在最后一个因为 url 总是以 / 开头，总会匹配到，把 "/contact/:id" 放在 "/contact" 前面。
- `<Route exact path="/">`可以匹配整个 url

### Link

- `<Link to="/">Home</Link>// <a href="/">Home</a>`
- NavLink 是特殊的 Link

```jsx
<NavLink to="/react" activeClassName="hurray">
  React
</NavLink>

// When the URL is /react, this renders:
// <a href="/react" className="hurray">React</a>

// When it's something else:
// <a href="/react">React</a>
```

- 也就是说 NavLink 是特殊的 Link 它会在匹配时处于“激活”状态

```jsx
<NavLink
  to="/faq"
  activeStyle={{
    fontWeight: "bold",
    color: "red",
  }}
>
  FAQs
</NavLink>
```

- 重定向 `<Redirect to="/login" />`
