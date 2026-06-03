const { getLikedPosts } = require("../../utils/post-comments.js");
const { getProfile } = require("../../utils/profile.js");

Page({
  data: {
    statusBarHeight: 20,
    posts: [],
    userInfo: {}
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  onShow() {
    this.loadPosts();
  },

  loadPosts() {
    this.setData({
      posts: getLikedPosts(),
      userInfo: getProfile()
    });
  },

  goBack() {
    wx.navigateBack();
  },

  goPostDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/post-detail/post-detail?id=${id}` });
  }
});
