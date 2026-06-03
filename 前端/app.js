const { envId } = require("./config/cloud.js");

App({
  globalData: {
    cloudReady: false
  },

  onLaunch() {
    if (!envId) return;
    if (!wx.cloud) {
      console.warn("当前基础库不支持云开发");
      return;
    }

    wx.cloud.init({
      env: envId,
      traceUser: true
    });
    this.globalData.cloudReady = true;
  }
});
