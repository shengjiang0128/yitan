const { envId } = require("./config/cloud.js");

App({
  globalData: {
    cloudReady: false
  },

  onLaunch() {
    if (!wx.cloud) {
      console.warn("当前基础库不支持云开发，请升级微信开发者工具或基础库版本");
      return;
    }

    if (!envId) {
      console.warn(
        "未配置云环境 ID：请在 config/cloud.js 填写 envId，并在开发者工具云开发面板选择同一环境"
      );
      return;
    }

    wx.cloud.init({
      env: envId,
      traceUser: true
    });
    this.globalData.cloudReady = true;
  }
});
