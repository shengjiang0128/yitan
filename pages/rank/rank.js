const { baseUrl, enabled: apiEnabled } = require("../../config/api.js");

Page({
  data: {
    statusBarHeight: 50,
    // 死数据（和你后端要返回的结构一致）
    rankList: [
      { id: 1, rank: 1, name: "第一名摊位", type: "stall", detailId: 101 },
      { id: 2, rank: 2, name: "第二名摊位", type: "stall", detailId: 102 },
      { id: 3, rank: 3, name: "第三名摊位", type: "stall", detailId: 103 }
    ],
    secondList: [
      { id: 4, rank: "", name: "其他推荐摊位", type: "stall", detailId: 104 }
    ]
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
    this.fetchRankData();
  },

  goSearch() {
    wx.navigateTo({ url: "/pages/search/search" });
  },

  onLocation() {
    wx.showToast({ title: "定位功能开发中", icon: "none" });
  },

  // 请求后端接口，覆盖死数据
  fetchRankData() {
    if (!apiEnabled || !baseUrl) return;

    wx.request({
      url: `${baseUrl}/api/getRankList`,
      method: "GET",
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            rankList: res.data.data.rankList,
            secondList: res.data.data.secondList
          })
        }
      },
      fail: () => {
        console.log("接口请求失败，使用本地死数据")
      }
    })
  },

  // 点击跳转到公用详情页，并把数据传过去
  goToDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail/detail?item=${JSON.stringify(item)}`
    })
  }
})