Page({
  data: {
    statusBarHeight: 50,
    categories: [
      { id: "fruit", name: "水果", image: "/images/icons/indexPage/生食类.png" },
      { id: "staple", name: "主食", image: "/images/icons/indexPage/主食.png" },
      { id: "steam", name: "蒸煮", image: "/images/icons/indexPage/蒸煮.png"},
      { id: "dessert", name: "甜品", image: "/images/icons/indexPage/甜点.png" },
      { id: "drink", name: "饮料", image: "/images/icons/indexPage/饮料.png" },
      { id: "grill", name: "煎烤", image: "/images/icons/indexPage/煎烤.png" },
      { id: "fry", name: "油炸", image: "/images/icons/indexPage/炸.png" },
      { id: "other", name: "其他", image: "/images/icons/indexPage/其他.png" }
    ],
    stalls: [
      {
        id: "1",
        name: "大众炒粉",
        distance: "500m",
        style: "menu",
        menuTitle: "大众炒粉",
        menuLines: ["炒河粉", "米粉", "糯米饭", "炒饭"],
        phone: "13533375596",
        image:"/images/icons/indexPage/大众炒粉.png"
      },
      {
        id: "2",
        name: "泰奶冰沙",
        distance: "202m",
        style: "drink",
        image:"/images/icons/indexPage/泰奶冰沙.png"
      }
    ]
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goSearch() {
    wx.navigateTo({ url: "/pages/search/search" });
  },

  onLocation() {
    wx.showToast({ title: "定位功能开发中", icon: "none" });
  },

  goCategory(e) {
    const { id, name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/category/category?id=${id}&name=${encodeURIComponent(name)}`
    });
  },

  goRank() {
    wx.navigateTo({ url: "/pages/rank/rank" });
  },

  goNearby() {
    wx.navigateTo({ url: "/pages/nearby/nearby" });
  },

  goStall(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/stall/stall?id=${id}` });
  }
});
