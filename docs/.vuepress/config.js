module.exports = {
  base: "/study_blog/",
  themeConfig: {
    navbar: false,
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
      },
      {
        title: "网页API",
        sidebarDepth: 2,
        children: ["/webapi/date/"]
      }
    ]
  }
};
