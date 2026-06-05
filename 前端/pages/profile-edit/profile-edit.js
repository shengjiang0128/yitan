const { getProfile, saveProfile } = require("../../utils/profile.js");
const { request, isApiOn } = require("../../utils/api-client.js");

Page({
  data: {
    statusBarHeight: 20,
    profile: {}
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({
      statusBarHeight: sys.statusBarHeight,
      profile: getProfile()
    });
  },

  onShow() {
    this.setData({ profile: getProfile() });
  },

  goBack() {
    wx.navigateBack();
  },

  onEditAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        const profile = saveProfile({ avatar: tempFilePath });
        this.setData({ profile });
        if (isApiOn()) {
          request({
            url: "/api/userInfo",
            method: "PUT",
            data: { avatar: tempFilePath }
          }).catch(() => {});
        }
        wx.showToast({ title: "头像已更新", icon: "success" });
      }
    });
  },

  onEditField(e) {
    const field = e.currentTarget.dataset.field;
    const value = this.data.profile[field] || "";
    wx.navigateTo({
      url: `/pages/profile-edit-field/profile-edit-field?field=${field}&value=${encodeURIComponent(value)}`
    });
  }
});
