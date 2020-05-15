module.exports = {
  base: "/study_blog/",
  themeConfig: {
    navbar: false,
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
        children: [
            "/algorithm/stackalgorithm/"
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
