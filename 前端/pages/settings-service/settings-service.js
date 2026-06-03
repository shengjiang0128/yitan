Page({
  data: {
    statusBarHeight: 20,
    options: [
      { id: "diarrhea", label: "吃拉了" },
      { id: "complaint", label: "投诉小摊" },
      { id: "human", label: "转人工" }
    ]
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goBack() {
    wx.navigateBack();
  },

  onOptionTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id === "human") {
      this.contactService();
      return;
    }
    if (id === "diarrhea") {
      wx.showModal({
        title: "吃拉了",
        content: "老大先照顾好身体！我们会记录并跟进相关小摊的卫生情况，严重情况请直接选「转人工」。",
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#ff9a3c"
      });
      return;
    }
    if (id === "complaint") {
      wx.showModal({
        title: "投诉小摊",
        content: "请描述小摊名称和问题，我们会尽快核实处理。也可选「转人工」直接联系客服。",
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#ff9a3c"
      });
    }
  },

  contactService() {
    wx.showModal({
      title: "联系客服",
      content: "客服微信：yitan_service\n工作时间：9:00 - 21:00",
      showCancel: false,
      confirmText: "知道了",
      confirmColor: "#ff9a3c"
    });
  }
});
