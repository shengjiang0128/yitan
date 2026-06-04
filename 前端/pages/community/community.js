const {
  getCommunityPosts,
  splitWaterfall
} = require("../../utils/community-feed.js");

Page({
  data: {
    statusBarHeight: 20,
    leftCol: [],
    rightCol: []
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  onShow() {
    this.loadFeed();
  },

  loadFeed() {
    const posts = getCommunityPosts();
    const { leftCol, rightCol } = splitWaterfall(posts);
    this.setData({ leftCol, rightCol });
  },

  goNotify() {
    wx.navigateTo({ url: "/pages/notify/notify" });
  },

  goPostDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/post-detail/post-detail?id=${id}` });
  }
});
