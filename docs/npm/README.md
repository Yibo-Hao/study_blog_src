---
title:npm
---

# npm

## 历史

在 GitHub 还没有兴起的年代，前端是通过网址来共享代码，比如你想使用 jQuery，那么你点击 jQuery 网站上提供的链接就可以下载 jQuery，放到自己的网站上使用。

GItHub 兴起之后，社区中也有人使用 GitHub 的下载功能：release。

Isaac Z. Schlueter 用一个工具把这些代码集中到一起来管理。这个工具就是他用 JavaScript （运行在 Node.js 上）写的 npm，全称是 Node Package Manager

## 原理

NPM 的思路大概是这样的：

1.  买个服务器作为代码仓库（registry），在里面放所有需要被共享的代码

2.  发邮件通知 jQuery、Bootstrap、Underscore 作者使用 npm publish 把代码提交到 registry 上，分别取名 jquery、bootstrap 和 underscore（注意大小写）

3.  社区里的其他人如果想使用这些代码，就把 jquery、bootstrap 和 underscore 写到 package.json 里，然后运行 npm install ，npm 就会帮他们下载代码

4.  下载完的代码出现在 node_modules 目录里，可以随意使用了。

这些可以被使用的代码被叫做「包」（package），这就是 NPM 名字的由来：Node Package(包) Manager(管理器)。


## 历史-续
npm 的发展是跟 Node.js 的发展相辅相成的。Node.js 是由一个在德国工作的美国程序员 Ryan Dahl 写的。他写了 Node.js，但是 Node.js 缺少一个包管理器，于是他和 npm 的作者一拍即合、抱团取暖，最终 Node.js 内置了 npm。

## dependencies和devDependencies

* 为何一个依赖不管是放到dependencies还是devDependencies下，在打包的时候都会把jquery打进去？

答：webpack 构建项目是根据入口文件的引用树来构建的，跟你放在哪个 dependency 里面没有关系，就算你没有放在 dependency 里面，只要你文件中引用了这个库并且 webpack 能在 node_modules 文件夹中找到这个库，就会打包进去。

* 当我把这个npm包当做lib包发布到npm库中后，再去require/import使用这个库的时候，不管是npm install mylib --save-dev 还是npm install mylib --save 还是直接npm install mylib 最终下载到node_modules下面的依赖都一模一样

答：npm install mylib --save-dev 还是 npm install mylib --save 还是直接 npm install mylib，这三条指令都会把依赖下载到 node_modules 文件夹。不同的是 --save-dev 还会修改 devDependencies 对象，把 mylib 添加进去；同理，--save 或者不加参数则是把 mylib 添加到 dependencies 对象中。

总结：dependencies和 devDependencies 相同的地方就是在你或者别人 clone 这个库进行开发调试的时候，可以通过 npm install 一键安装这两个目录下所有的依赖，而不用去一行行找你到底在文件中引用了那些依赖。

不同的地方在于：当某个项目依赖了你的  mylib，那么在安装的时候会链式地安装 mylib 这个项目中 dependencies 配置声明的依赖，因为根据约定，npm 认为这是项目运行时需要的依赖。而 devDependencies 则是开发时需要的依赖。 如果你输入 npm install --production 指令，就只会安装 dependencies 目录下的依赖，在一些服务端自动构建的过程中或者在一些特殊的需求下，可能会用到这个指令。

比如你在写页面，然后装了个 Redux，Redux 的 devDependencies 里有 Jest，那么你拉下来的 node_modules 里是不会有 Jest 的，因为你又不是 dev（开发）Redux，所以只会拉下来 dependencies 里的包。当你的应用作为第三方包放在npm上被下载的时候，dependence里面的会被自动安装

## npm 脚本
npm 脚本的原理非常简单。每当执行npm run，就会自动新建一个 Shell，在这个 Shell 里面执行指定的脚本命令。因此，只要是 Shell（一般是 Bash）可以运行的命令，就可以写在 npm 脚本里面。

比较特别的是，npm run新建的这个 Shell，会将当前目录的node_modules/.bin子目录加入PATH变量，执行结束后，再将PATH变量恢复原样。

这意味着，当前目录的node_modules/.bin子目录里面的所有脚本，都可以直接用脚本名调用，而不必加上路径。比如，当前项目的依赖里面有 Mocha，只要直接写mocha test就可以了

```
"lint": "jshint *.js"
"lint": "jshint **/*.js"
```

上面代码中，*表示任意文件名，**表示任意一层子目录。        

如果 npm 脚本里面需要执行多个任务，那么需要明确它们的执行顺序。

如果是并行执行（即同时的平行执行），可以使用&符号。


$ npm run script1.js & npm run script2.js
如果是继发执行（即只有前一个任务成功，才执行下一个任务），可以使用&&符号。


$ npm run script1.js && npm run script2.j

## yarn
Facebook、Google、Exponent 和 Tilde 联合推出了一个新的 JS 包管理工具 — Yarn，正如官方文档中写的，Yarn 是为了弥补 npm 的一些缺陷而出现的：

npm 和 Yarn 都是通过 package.json 记录项目需要拉取的依赖模块，不过在使用时，往往 package.json 中模块的版本号不太会写得非常确切，通常是定个版本范围。这样你就能自行选择使用模块的大版本或者小版本，也允许 npm 拉取模块最新的修复了 bug 的版本。

Yarn 就会创建（或更新）yarn.lock 这个文件。这么做就保证了，每一次拉取同一个项目依赖时，使用的都是一样的模块版本。

npm 的全局操作命令要加上 -g 或者 --global 参数，Yarn 的全局命令则需要加上 global。和 npm 类似，项目特定的依赖，就不需要全局安装了。
