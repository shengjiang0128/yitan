const {
  getMyReviews,
  formatReviewDate
} = require("../../utils/stall-reviews.js");

Page({
  data: {
    statusBarHeight: 20,
    reviews: []
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  onShow() {
    this.loadReviews();
  },

  loadReviews() {
    const reviews = getMyReviews().map((item) => ({
      ...item,
      dateText: formatReviewDate(item.createdAt),
      cover: item.images && item.images[0] ? item.images[0] : item.stallCover
    }));
    this.setData({ reviews });
  },

  goBack() {
    wx.navigateBack();
  },

  goStall(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/stall/stall?id=${id}` });
  }
});
