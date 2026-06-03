const { getFavorites } = require("../../utils/stall-favorites");

Page({
  data: {
    statusBarHeight: 20,
    favorites: []
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    this.setData({ favorites: getFavorites() });
  },

  goBack() {
    wx.navigateBack();
  },

  goStall(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/stall/stall?id=${id}` });
  }
});
