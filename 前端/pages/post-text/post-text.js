const { addPost, createPostId } = require("../../utils/posts.js");
const { getProfile } = require("../../utils/profile.js");
const { request, isApiOn } = require("../../utils/api-client.js");
const { notifyOnMyPostPublished } = require("../../utils/post-notifications.js");
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

    const profile = getProfile();
    const payload = {
      postType: "text",
      title: content.slice(0, 20),
      content,
      tags: [],
      location: "",
      shop: ""
    };

    const saveLocal = (id) => {
      const post = {
        id: id || createPostId(),
        ...payload,
        img: "",
        images: [],
        type: "food",
        likeCount: 0,
        collectCount: 0,
        authorNickname: profile.nickname,
        authorAvatar: profile.avatar,
        createdAt: new Date().toISOString()
      };
      addPost(post);
      notifyOnMyPostPublished(post);
      wx.showToast({ title: "发布成功", icon: "success" });
      setTimeout(() => {
        wx.reLaunch({ url: "/pages/community/community" });
      }, 400);
    };

    if (!isApiOn()) {
      saveLocal();
      return;
    }

    request({ url: "/api/posts", method: "POST", data: payload })
      .then((res) => {
        const id =
          res.data && res.data.code === 200 && res.data.data
            ? res.data.data.id
            : createPostId();
        saveLocal(id);
      })
      .catch(() => {
        wx.showToast({ title: "接口失败，已存本地", icon: "none" });
        saveLocal();
      });
  }
});
