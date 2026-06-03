const { getStalls, deleteStall } = require("../../utils/stalls.js");

Page({
  data: {
    statusBarHeight: 20,
    stalls: []
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({
      statusBarHeight: sys.statusBarHeight,
      stalls: getStalls()
    });
  },

  onShow() {
    this.setData({ stalls: getStalls() });
  },

  goBack() {
    wx.navigateBack();
  },

  goStallDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/stall/stall?id=${item.id}`,
      fail: () => {
        wx.showToast({ title: item.name, icon: "none" });
      }
    });
  },

  onDeleteStall(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.showModal({
      title: "删除摊位",
      content: `确定删除「${name}」吗？删除后无法恢复。`,
      confirmText: "删除",
      confirmColor: "#ff4d4f",
      success: (res) => {
        if (!res.confirm) return;
        const stalls = deleteStall(id);
        this.setData({ stalls });
        wx.showToast({ title: "已删除", icon: "success" });
      }
    });
  }
});
