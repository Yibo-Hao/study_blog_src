module.exports = {
  themeConfig: {
    navbar: false,
    base:"/study_blog/",
    sidebar: [
      "/",
      {
        title: "数据结构和算法",
        sidebarDepth: 2,
        children: [
          "/datastructure/base/",
          "/datastructure/queue/",
          "/datastructure/stack/",
          "/datastructure/linkedlist/"
        ]
      }
    ]
  }
};
