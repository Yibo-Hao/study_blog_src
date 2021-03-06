module.exports = {
  base: "/study_blog/",
  themeConfig: {
    nav: [
      { text: "博客", link: "/" },
      { text: "日记", link: "/ambition/2020/" }
    ],
    sidebar: [
      "/",
      {
        title: "数据结构",
        sidebarDepth: 2,
        children: [
          "/datastructure/base/",
          "/datastructure/queue/",
          "/datastructure/stack/",
          "/datastructure/linkedlist/"
        ]
      },
      {
        title: "算法",
        sidebarDepth: 2,
        children: ["/algorithm/time/", "/algorithm/stackalgorithm/"]
      },
      {
        title: "JS语言特性",
        sidebarDepth: 2,
        children: [
          "/ES6/hoisting/",
          "/ES6/lexicalenvironment/",
          "/ES6/closure/",
          "/ES6/fibonacc/",
          "/ES6/currying/",
          "/ES6/eventhub/",
          "/ES6/deepclone/",
          "/ES6/bind/",
          "/ES6/promise/",
          "/ES6/promise2/",
          "/ES6/eventloop/",
          "/ES6/await/"
        ]
      },
      {
        title: "网页API",
        sidebarDepth: 2,
        children: ["/webapi/date/"]
      },
      {
        title: "React开发",
        sidebarDepth: 2,
        children: [
          "/KpDevelopment/css in react/",
          "/KpDevelopment/routing/",
          "/KpDevelopment/react-router/"
        ]
      },
      {
        title: "Vue开发",
        sidebarDepth: 2,
        children: ["/vue/data/", "/vue/router-1/", "/vue/router-2/"]
      },
      {
        title: "JS生态",
        sidebarDepth: 2,
        children: ["/npm/"]
      },
      {
        title: "CSS",
        sidebarDepth: 2,
        children: ["/css/", "/css/line-height/"]
      },
      {
        title: "设计模式",
        sidebarDepth: 2,
        children: ["/design/"]
      },
      {
        title: "刷题",
        sidebarDepth: 2,
        children: ["/ti/"]
      }
    ]
  }
};
