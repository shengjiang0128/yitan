App({
  onLaunch() {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上基础库以支持云开发");
      return;
    }
    wx.cloud.init({
      traceUser: true
    });
  }
});
