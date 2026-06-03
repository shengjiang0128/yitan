const DEFAULT_AVATAR = "/images/icons/notifyPage/portrait.png";

const MOCK_REPLIES = {
  甜品: "老大，附近有几家口碑不错的甜品摊，推荐试试「糖心坊」的提拉米苏～",
  炸物: "老大，刚出锅的炸物最香！推荐「脆皮小站」的炸鸡块和炸杏鲍菇，外酥里嫩～",
  烧烤: "老大，这家东北烤冷面距离您182米，好评多多「广外南小摊儿的烤冷面～😋超级好吃～」\n·东北烤冷面（贝岗小摊店）：距离约200米，评价4.1分",
  主食: "老大，想吃饱的话，「阿强炒饭」和「手工饺子馆」都在 500m 内。"
};

const FALLBACK_REPLY = "老大，我帮你留意附近的小摊，也可以试试点上面的标签哦～";

const WELCOME_TEXT = "老大，今天想吃点什么？告诉我，或者点下面的标签～";

Page({
  _msgId: 0,

  data: {
    statusBarHeight: 20,
    userAvatar: DEFAULT_AVATAR,
    inputValue: "",
    quickKeywords: ["甜品", "炸物", "烧烤", "主食"],
    messages: [],
    scrollToId: ""
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });

    const stored = wx.getStorageSync("yitan_user") || {};
    const avatar = stored.avatarUrl || DEFAULT_AVATAR;
    this.setData({ userAvatar: avatar });

    this.appendMessage({
      role: "ai",
      content: WELCOME_TEXT,
      showKeywords: true
    });
  },

  goBack() {
    wx.reLaunch({ url: "/pages/index/index" });
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onQuickKeyword(e) {
    const keyword = e.currentTarget.dataset.keyword;
    if (keyword) {
      this.sendMessage(keyword);
    }
  },

  onSend() {
    const text = (this.data.inputValue || "").trim();
    if (!text) return;
    this.setData({ inputValue: "" });
    this.sendMessage(text);
  },

  sendMessage(text) {
    this.appendMessage({ role: "user", content: text });
    const reply = this.mockReply(text);

    setTimeout(() => {
      const ackId = this.appendMessage({ role: "ai", content: "收到老大" });

      setTimeout(() => {
        this.updateMessage(ackId, { showThinking: true });
        this.scrollToBottom(ackId);

        setTimeout(() => {
          this.appendMessage({ role: "ai", content: reply });
        }, 900);
      }, 700);
    }, 400);
  },

  mockReply(text) {
    const trimmed = (text || "").trim();
    for (const key of Object.keys(MOCK_REPLIES)) {
      if (trimmed.includes(key)) {
        return MOCK_REPLIES[key];
      }
    }
    return FALLBACK_REPLY;
  },

  appendMessage({ role, content, showKeywords, showThinking }) {
    this._msgId += 1;
    const id = this._msgId;
    const msg = { id, role, content };
    if (showKeywords) {
      msg.showKeywords = true;
    }
    if (showThinking) {
      msg.showThinking = true;
    }
    this.setData({
      messages: [...this.data.messages, msg]
    });
    this.scrollToBottom(id);
    return id;
  },

  updateMessage(id, patch) {
    const messages = this.data.messages.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    this.setData({ messages });
  },

  scrollToBottom(id) {
    const target = `msg-${id}`;
    this.setData({ scrollToId: "" });
    wx.nextTick(() => {
      this.setData({ scrollToId: target });
    });
  }
});
