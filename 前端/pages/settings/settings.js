Page({
  data: {
    statusBarHeight: 20
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goBack() {
    wx.navigateBack();
  },

  goEdit() {
    wx.navigateTo({ url: "/pages/profile-edit/profile-edit" });
  },

  goService() {
    wx.navigateTo({ url: "/pages/settings-service/settings-service" });
  },

  goAbout() {
    wx.navigateTo({ url: "/pages/settings-about/settings-about" });
  }
});
