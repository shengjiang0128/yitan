const { getMessageById } = require("../../utils/notify-data.js");
const {
  getMessages,
  saveMessages,
  createMessageId,
  getMockReply
} = require("../../utils/chat-messages.js");

Page({
  data: {
    statusBarHeight: 20,
    chatId: "",
    chatUser: null,
    messages: [],
    inputValue: "",
    scrollIntoView: ""
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    const chatId = options.id || "0";
    const chatUser = getMessageById(chatId) || {
      id: 0,
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "用户",
      preview: "暂无消息"
    };
    const messages = getMessages(chatId, chatUser);

    this.setData({
      statusBarHeight: sys.statusBarHeight,
      chatId,
      chatUser,
      messages
    });
    this.scrollToBottom();
  },

  goBack() {
    wx.navigateBack();
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSend() {
    const text = (this.data.inputValue || "").trim();
    if (!text) return;

    const messages = [
      ...this.data.messages,
      { id: createMessageId(), fromMe: true, text }
    ];

    this.setData({ messages, inputValue: "" });
    saveMessages(this.data.chatId, messages);
    this.scrollToBottom();

    setTimeout(() => {
      const replyMessages = [
        ...messages,
        {
          id: createMessageId(),
          fromMe: false,
          text: getMockReply()
        }
      ];
      this.setData({ messages: replyMessages });
      saveMessages(this.data.chatId, replyMessages);
      this.scrollToBottom();
    }, 800);
  },

  scrollToBottom() {
    this.setData({ scrollIntoView: "" });
    setTimeout(() => {
      this.setData({ scrollIntoView: "chat-bottom" });
    }, 50);
  }
});
