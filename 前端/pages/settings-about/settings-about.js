Page({
  data: {
    statusBarHeight: 20,
    members: [
      { id: 1, avatar: "/images/about/dev1.png", pos: "top" },
      { id: 2, avatar: "/images/about/dev2.png", pos: "left" },
      { id: 3, avatar: "/images/about/dev3.png", pos: "right" },
      { id: 4, avatar: "/images/about/dev4.png", pos: "bl" },
      { id: 5, avatar: "/images/about/dev5.png", pos: "br" }
    ],
    author: {
      avatar: "/images/about/author.png",
      message: "对你我无话可说"
    }
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goBack() {
    wx.navigateBack();
  }
});
