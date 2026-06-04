const { getStallById } = require("../../utils/category-data");
const { isFavorite, toggleFavorite } = require("../../utils/stall-favorites");
const { recordFootprint } = require("../../utils/footprint.js");
const { getReviewsByStallId } = require("../../utils/stall-reviews.js");

const DEFAULT_STALL = {
  id: 2,
  name: "土豆泥拌粉",
  rating: 5,
  health: "优秀",
  banner: "/images/icons/stallPage/Rectangle 111141380.png",
  logo: "/images/icons/stallPage/Ellipse 163.png",
  likeCount: 2200
};

Page({
  data: {
    statusBarHeight: 88,
    stall: DEFAULT_STALL,
    favorited: false,
    reviews: []
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight * 2 });

    const id = options.id || DEFAULT_STALL.id;
    const stall = getStallById(id) || { ...DEFAULT_STALL, id };
    const rating = stall.rating || 5;
    this.setData({
      stall: {
        ...DEFAULT_STALL,
        ...stall,
        logo: stall.logo || DEFAULT_STALL.logo,
        banner: stall.banner || stall.img || DEFAULT_STALL.banner,
        ratingStars: "⭐".repeat(rating)
      },
      favorited: isFavorite(id)
    });
    this.recordView(stall);
    this.loadReviews(id);
  },

  onShow() {
    const { stall } = this.data;
    if (stall && stall.id != null) {
      this.setData({ favorited: isFavorite(stall.id) });
      this.loadReviews(stall.id);
    }
  },

  recordView(stall) {
    if (!stall || stall.id == null) return;
    recordFootprint({
      type: "stall",
      targetId: stall.id,
      title: stall.name,
      cover: stall.banner || stall.img || stall.logo || ""
    });
  },

  loadReviews(stallId) {
    const reviews = getReviewsByStallId(stallId).map((item) => ({
      ...item,
      displayImg:
        (item.images && item.images[0]) ||
        item.stallCover ||
        "/images/icons/catogoryPage/摊位主图1.png"
    }));
    this.setData({ reviews });
  },

  onToggleFavorite() {
    const { stall } = this.data;
    const favorited = toggleFavorite(stall);
    this.setData({ favorited });
    wx.showToast({
      title: favorited ? "已收藏" : "已取消收藏",
      icon: "none"
    });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  goNavigate() {
    wx.openLocation({
      latitude: 23.123456,
      longitude: 113.123456,
      name: this.data.stall.name,
      address: "摊位地址"
    });
  },

  goMap() {
    wx.navigateTo({
      url: `/pages/map/map?name=${encodeURIComponent(this.data.stall.name)}`
    });
  },

  goContact() {
    wx.showModal({
      title: "联系摊主",
      content: "请选择联系方式",
      confirmText: "拨打电话",
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: "13800138000" });
        }
      }
    });
  },

  goWriteReview() {
    const { stall } = this.data;
    const name = encodeURIComponent(stall.name || "");
    wx.navigateTo({
      url: `/pages/write-review/write-review?stallId=${stall.id}&stallName=${name}`
    });
  }
});
