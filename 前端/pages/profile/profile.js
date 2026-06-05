const { getProfile, mergeWithApiData } = require("../../utils/profile.js");
const { getPosts } = require("../../utils/posts.js");
const { isCookMode, toggleAppMode } = require("../../utils/app-mode.js");
const { request, isApiOn } = require("../../utils/api-client.js");

Page({
  data: {
    statusBarHeight: 50,
    isCookMode: false,
    userInfo: getProfile(),
    displayNickname: "",
    displayBio: "",
    posts: getPosts()
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
    this.loadUserInfo();
    this.loadPosts();
    this.refreshMode();
  },

  onShow() {
    this.loadUserInfo();
    this.loadPosts();
    this.refreshMode();
  },

  refreshMode() {
    const cookMode = isCookMode();
    this.setData({
      isCookMode: cookMode,
      displayNickname: this.getDisplayNickname(cookMode),
      displayBio: this.getDisplayBio(cookMode)
    });
  },

  getDisplayNickname(cookMode) {
    const profile = this.data.userInfo || getProfile();
    if (!cookMode) return profile.nickname;
    if ((profile.nickname || "").includes("摊主")) return profile.nickname;
    return (profile.nickname || "").replace(/^脑摊/, "摊主") || "摊主A65235";
  },

  getDisplayBio(cookMode) {
    const profile = this.data.userInfo || getProfile();
    if (!cookMode) return profile.bio;
    if ((profile.bio || "").includes("做饭")) return profile.bio;
    return "哈哈哈哈哈我爱做饭";
  },

  loadUserInfo() {
    const localProfile = getProfile();
    const cookMode = isCookMode();
    this.setData({
      userInfo: localProfile,
      displayNickname: this.getDisplayNickname(cookMode),
      displayBio: this.getDisplayBio(cookMode)
    });
    this.fetchUserInfo(localProfile, cookMode);
  },

  loadPosts() {
    if (!isApiOn()) {
      this.setData({ posts: getPosts() });
      return;
    }

    request({ url: "/api/myPosts", method: "GET" })
      .then((res) => {
        if (res.data && res.data.code === 200) {
          const data = res.data.data;
          const list = Array.isArray(data) ? data : data.list || [];
          if (list.length) {
            this.setData({ posts: list });
            return;
          }
        }
        this.setData({ posts: getPosts() });
      })
      .catch(() => {
        console.log("我的帖子接口失败，使用本地数据");
        this.setData({ posts: getPosts() });
      });
  },

  fetchUserInfo(localProfile, cookMode) {
    if (!isApiOn()) return;

    request({ url: "/api/userInfo", method: "GET" })
      .then((res) => {
        if (res.data && res.data.code === 200) {
          const userInfo = mergeWithApiData(res.data.data);
          this.setData({
            userInfo,
            displayNickname: cookMode
              ? ((userInfo.nickname || "").replace(/^脑摊/, "摊主") || "摊主A65235")
              : userInfo.nickname,
            displayBio: cookMode ? "哈哈哈哈哈我爱做饭" : userInfo.bio
          });
        }
      })
      .catch(() => {
        console.log("用户信息接口请求失败，使用本地数据");
      });
  },

  toggleMode() {
    toggleAppMode();
    this.refreshMode();
    wx.showToast({
      title: isCookMode() ? "已切换摊主端" : "已切换食客端",
      icon: "none"
    });
  },

  goOpenStall() {
    wx.navigateTo({ url: "/pages/open-stall/open-stall" });
  },

  goMyStalls() {
    wx.navigateTo({ url: "/pages/my-stall/my-stall" });
  },

  goToPage(e) {
    const type = e.currentTarget.dataset.type;
    let url = "";
    switch (type) {
      case "footprint":
        url = "/pages/footprint/footprint";
        break;
      case "like":
        url = "/pages/like/like";
        break;
      case "collect":
        url = "/pages/collect/collect";
        break;
      case "exposure":
        wx.showToast({ title: "曝光量统计开发中", icon: "none" });
        return;
      case "review":
        url = "/pages/review/review";
        break;
      case "setting":
        url = "/pages/settings/settings";
        break;
    }
    if (url) {
      wx.navigateTo({ url });
    }
  },

  goToPostDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${item.id}`
    });
  }
});
