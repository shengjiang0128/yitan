const { addPost, createPostId } = require("../../utils/posts.js");

Page({
  data: {
    statusBarHeight: 20,
    content: "",
    maxLength: 500
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ content: e.detail.value });
  },

  onPublish() {
    const content = (this.data.content || "").trim();
    if (!content) {
      wx.showToast({ title: "写点内容再发布吧", icon: "none" });
      return;
    }

    addPost({
      id: createPostId(),
      postType: "text",
      title: content.slice(0, 20),
      content,
      tags: [],
      location: "",
      shop: "",
      img: "",
      images: [],
      type: "food",
      likeCount: 0,
      collectCount: 0,
      tags: [],
      createdAt: new Date().toISOString()
    });

    wx.showToast({ title: "发布成功", icon: "success" });
    setTimeout(() => {
      wx.reLaunch({ url: "/pages/profile/profile" });
    }, 400);
  }
});
