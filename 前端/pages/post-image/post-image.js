const { addPost, createPostId } = require("../../utils/posts.js");
const { request, isApiOn } = require("../../utils/api-client.js");
const { getProfile } = require("../../utils/profile.js");
const { notifyOnMyPostPublished } = require("../../utils/post-notifications.js");

const MOCK_SHOPS = ["大众炒粉", "泰奶冰沙", "土豆泥拌粉", "东北烤冷面（贝岗小摊店）"];
const MOCK_LOCATIONS = ["广外南门", "贝岗小吃街", "校内美食广场", "地铁站 B 口"];

Page({
  data: {
    statusBarHeight: 20,
    images: [],
    title: "",
    content: "",
    tagInput: "",
    tags: [],
    location: "",
    shop: "",
    maxImages: 9,
    titleMax: 30,
    contentMax: 1000
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goBack() {
    wx.navigateBack();
  },

  chooseImages() {
    const remain = this.data.maxImages - this.data.images.length;
    if (remain <= 0) {
      wx.showToast({ title: "最多 9 张图片", icon: "none" });
      return;
    }

    wx.chooseMedia({
      count: remain,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const paths = res.tempFiles.map((f) => f.tempFilePath);
        this.setData({ images: [...this.data.images, ...paths] });
      }
    });
  },

  removeImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onTagInput(e) {
    this.setData({ tagInput: e.detail.value });
  },

  addTag() {
    const raw = (this.data.tagInput || "").trim().replace(/^#/, "");
    if (!raw) return;
    if (this.data.tags.includes(raw)) {
      this.setData({ tagInput: "" });
      return;
    }
    if (this.data.tags.length >= 5) {
      wx.showToast({ title: "最多 5 个标签", icon: "none" });
      return;
    }
    this.setData({
      tags: [...this.data.tags, raw],
      tagInput: ""
    });
  },

  removeTag(e) {
    const index = e.currentTarget.dataset.index;
    const tags = [...this.data.tags];
    tags.splice(index, 1);
    this.setData({ tags });
  },

  pickLocation() {
    wx.showActionSheet({
      itemList: MOCK_LOCATIONS,
      success: (res) => {
        this.setData({ location: MOCK_LOCATIONS[res.tapIndex] });
      }
    });
  },

  pickShop() {
    wx.showActionSheet({
      itemList: MOCK_SHOPS,
      success: (res) => {
        this.setData({ shop: MOCK_SHOPS[res.tapIndex] });
      }
    });
  },

  clearLocation() {
    this.setData({ location: "" });
  },

  clearShop() {
    this.setData({ shop: "" });
  },

  onPublish() {
    const { images, title, content, tags, location, shop } = this.data;
    const trimmedTitle = (title || "").trim();
    const trimmedContent = (content || "").trim();

    if (!images.length) {
      wx.showToast({ title: "请至少添加一张图片", icon: "none" });
      return;
    }
    if (!trimmedTitle) {
      wx.showToast({ title: "请填写标题", icon: "none" });
      return;
    }

    const profile = getProfile();
    const payload = {
      postType: "image",
      title: trimmedTitle,
      content: trimmedContent,
      images,
      tags,
      location,
      shop
    };

    const saveLocal = (id) => {
      const post = {
        id: id || createPostId(),
        ...payload,
        img: images[0],
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
