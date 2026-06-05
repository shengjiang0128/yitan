const {
  getCategoryMeta,
  getCategoryItems
} = require("../../utils/notify-data.js");

Page({
  data: {
    statusBarHeight: 20,
    type: "like",
    title: "",
    items: [],
    emptyText: ""
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
    this.initPage(options.type || "like");
  },

  onShow() {
    this.loadItems();
  },

  initPage(type) {
    const meta = getCategoryMeta(type);
    this.setData({
      type,
      title: meta.title,
      emptyText: meta.emptyText
    });
    this.loadItems();
  },

  loadItems() {
    this.setData({ items: getCategoryItems(this.data.type) });
  },

  goBack() {
    wx.navigateBack();
  },

  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;

    if (this.data.type === "like") {
      if (item.type === "collect" && item.stallId != null) {
        wx.navigateTo({
          url: `/pages/stall/stall?id=${item.stallId}`
        });
        return;
      }
      if (item.postId != null) {
        wx.navigateTo({
          url: `/pages/post-detail/post-detail?id=${item.postId}`
        });
        return;
      }
    }

    wx.showToast({
      title: item.username,
      icon: "none"
    });
  }
});
