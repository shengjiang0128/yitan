const { saveProfile } = require("../../utils/profile.js");

const FIELD_CONFIG = {
  nickname: {
    title: "编辑名字",
    placeholder: "请输入名字",
    maxLength: 20
  },
  bio: {
    title: "编辑个性签名",
    placeholder: "填写个性签名，介绍自己",
    maxLength: 100
  }
};

Page({
  data: {
    statusBarHeight: 20,
    field: "",
    title: "",
    placeholder: "",
    maxLength: 20,
    value: ""
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    const field = options.field || "nickname";
    const config = FIELD_CONFIG[field] || FIELD_CONFIG.nickname;
    const value = decodeURIComponent(options.value || "");

    this.setData({
      statusBarHeight: sys.statusBarHeight,
      field,
      title: config.title,
      placeholder: config.placeholder,
      maxLength: config.maxLength,
      value
    });
  },

  onInput(e) {
    this.setData({ value: e.detail.value });
  },

  goBack() {
    wx.navigateBack();
  },

  onSave() {
    const { field, value, maxLength } = this.data;
    const trimmed = (value || "").trim();

    if (field === "nickname" && !trimmed) {
      wx.showToast({ title: "名字不能为空", icon: "none" });
      return;
    }

    if (trimmed.length > maxLength) {
      wx.showToast({ title: `最多 ${maxLength} 个字`, icon: "none" });
      return;
    }

    saveProfile({ [field]: trimmed });
    wx.showToast({ title: "已保存", icon: "success" });
    setTimeout(() => wx.navigateBack(), 300);
  }
});
