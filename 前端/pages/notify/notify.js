const { getMessageList } = require("../../utils/notify-data.js");

Page({
  data: {
    statusBarHeight: 20,
    messageList: getMessageList()
  },

  goBack() {
    wx.navigateBack();
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  onShow() {
    this.setData({ messageList: getMessageList() });
  },

  goCategory(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/notify-category/notify-category?type=${type}`
    });
  },

  onMessageTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/notify-chat/notify-chat?id=${id}`
    });
  }
});
