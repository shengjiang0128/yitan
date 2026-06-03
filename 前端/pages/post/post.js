Page({
  data: {
    statusBarHeight: 20
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goBack() {
    wx.navigateBack({
      fail: () => wx.reLaunch({ url: "/pages/index/index" })
    });
  },

  goTextPost() {
    wx.navigateTo({ url: "/pages/post-text/post-text" });
  },

  goImagePost() {
    wx.navigateTo({ url: "/pages/post-image/post-image" });
  }
});
