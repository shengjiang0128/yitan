// pages/message/message.js
Page({
  data: {
    statusBarHeight:40,
    messageList: [
      {
        id: 1,
        avatar: "https://example.com/avatar.jpg",
        username: "黄苑舒",
        preview: "[帖子] 这家饭太好吃了",
        time: "10:50"
      }
      // 可以在这里加更多消息数据，然后用wx:for循环渲染
    ]
  },

  onLoad(options) {
    // 页面加载时可以请求消息列表数据
    // this.getMessageList();
  },

  // 点击消息项跳转到聊天/详情页
  handleMessageTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/chat/chat?userId=${id}`
    });
  }
});