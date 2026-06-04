const { addReview } = require("../../utils/stall-reviews.js");
const { getStallById } = require("../../utils/category-data.js");

Page({
  data: {
    statusBarHeight: 20,
    stallId: "",
    stallName: "",
    stallCover: "",
    content: "",
    images: [],
    submitting: false
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    const stallId = options.stallId || "";
    const stall = getStallById(stallId);
    this.setData({
      statusBarHeight: sys.statusBarHeight,
      stallId: String(stallId),
      stallName: options.stallName
        ? decodeURIComponent(options.stallName)
        : stall
          ? stall.name
          : "小摊",
      stallCover: stall ? stall.img || stall.banner || "" : ""
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ content: e.detail.value });
  },

  onChooseImage() {
    const remain = 3 - this.data.images.length;
    if (remain <= 0) {
      wx.showToast({ title: "最多 3 张图片", icon: "none" });
      return;
    }
    wx.chooseMedia({
      count: remain,
      mediaType: ["image"],
      success: (res) => {
        const paths = (res.tempFiles || []).map((f) => f.tempFilePath);
        this.setData({ images: this.data.images.concat(paths).slice(0, 3) });
      }
    });
  },

  onRemoveImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.slice();
    images.splice(index, 1);
    this.setData({ images });
  },

  onSubmit() {
    const { content, stallId, stallName, stallCover, submitting } = this.data;
    if (submitting) return;
    if (!(content || "").trim()) {
      wx.showToast({ title: "写点评价再发布吧", icon: "none" });
      return;
    }
    if (!stallId) {
      wx.showToast({ title: "摊位信息缺失", icon: "none" });
      return;
    }

    this.setData({ submitting: true });
    addReview({
      stallId,
      stallName,
      stallCover,
      content: content.trim(),
      images: this.data.images
    });

    wx.showToast({ title: "评价已发布", icon: "success" });
    setTimeout(() => {
      this.setData({ submitting: false });
      wx.navigateBack();
    }, 500);
  }
});
