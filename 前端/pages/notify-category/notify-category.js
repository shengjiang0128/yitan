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
    const type = options.type || "like";
    const meta = getCategoryMeta(type);

    this.setData({
      statusBarHeight: sys.statusBarHeight,
      type,
      title: meta.title,
      emptyText: meta.emptyText,
      items: getCategoryItems(type)
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.showToast({
      title: item.username,
      icon: "none"
    });
  }
});
