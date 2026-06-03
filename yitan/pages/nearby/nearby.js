Page({
  data: {
    list: [
      { id: "1", name: "大众炒粉", distance: "500m" },
      { id: "2", name: "泰奶冰沙", distance: "202m" },
      { id: "3", name: "老王烧烤", distance: "680m" }
    ]
  },
  goStall(e) {
    wx.navigateTo({ url: `/pages/stall/stall?id=${e.currentTarget.dataset.id}` });
  }
});
