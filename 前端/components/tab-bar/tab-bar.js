const TAB_MAP = {
  index: "/pages/index/index",
  rank: "/pages/rank/rank",
  community: "/pages/community/community",
  ai: "/pages/ai/ai",
  profile: "/pages/profile/profile"
};

Component({
  properties: {
    active: {
      type: String,
      value: "index"
    }
  },
  methods: {
    onSwitch(e) {
      const tab = e.currentTarget.dataset.tab;
      const url = TAB_MAP[tab];
      if (!url) return;
      wx.reLaunch({ url });
    },

    onPost() {
      wx.navigateTo({
        url: "/pages/post/post",
        fail: () => {
          wx.showToast({ title: "发帖功能开发中", icon: "none" });
        }
      });
    }
  }
});
