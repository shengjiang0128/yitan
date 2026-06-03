const {
  DEFAULT_CATEGORY,
  getCategoryStalls,
  searchStalls
} = require("../../utils/category-data.js");

Page({
  data: {
    statusBarHeight: 20,
    categoryId: DEFAULT_CATEGORY.id,
    categoryName: DEFAULT_CATEGORY.name,
    stallList: []
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    const categoryId = options.id || DEFAULT_CATEGORY.id;
    const categoryName = decodeURIComponent(options.name || DEFAULT_CATEGORY.name);
    const stallList =
      categoryId === "search"
        ? searchStalls(categoryName)
        : getCategoryStalls(categoryId);

    this.setData({
      statusBarHeight: sys.statusBarHeight,
      categoryId,
      categoryName,
      stallList
    });
  },

  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({ url: "/pages/index/index" });
      }
    });
  },

  goSearch() {
    wx.navigateTo({ url: "/pages/search/search" });
  },

  onLocation() {
    wx.showToast({ title: "定位功能开发中", icon: "none" });
  },

  goStall(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/stall/stall?id=${id}` });
  }
});
