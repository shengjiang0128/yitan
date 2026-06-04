const { getFootprints } = require("../../utils/footprint.js");

Page({
  data: {
    statusBarHeight: 20,
    activeTab: "all",
    items: []
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  onShow() {
    this.loadList();
  },

  loadList() {
    const { activeTab } = this.data;
    const items =
      activeTab === "all" ? getFootprints() : getFootprints(activeTab);
    this.setData({ items });
  },

  onTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab }, () => this.loadList());
  },

  goBack() {
    wx.navigateBack();
  },

  onItemTap(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;
    if (item.type === "post") {
      wx.navigateTo({
        url: `/pages/post-detail/post-detail?id=${item.targetId}`
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/stall/stall?id=${item.targetId}`
    });
  }
});
