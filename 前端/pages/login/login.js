const { isApiOn, loginWithCode } = require("../../utils/api-client.js");

Page({
  data: {
    statusBarHeight: 20,
    agreed: true,
    loading: false,
    categories: [
      { type: "fruit", bgClass: "bg-pink", name: "新鲜水果", icon: "/images/icons/loginPage/icon-fruit.png" },
      { type: "rice", bgClass: "bg-peach", name: "地道主食", icon: "/images/icons/loginPage/icon-rice.png" },
      { type: "cake", bgClass: "bg-lavender", name: "精致甜品", icon: "/images/icons/loginPage/icon-cake.png" },
      { type: "drink", bgClass: "bg-mint", name: "清凉饮品", icon: "/images/icons/loginPage/icon-drink.png" }
    ]
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  openAgreement(e) {
    const type = e.currentTarget.dataset.type;
    wx.showToast({
      title: type === "user" ? "用户协议" : "隐私政策",
      icon: "none"
    });
  },

  onWechatLogin() {
    if (!this.data.agreed) {
      wx.showToast({ title: "请先阅读并同意相关协议", icon: "none" });
      return;
    }
    this.doLogin({ nickName: "微信用户", avatarUrl: "" });
  },

  onDevEnter() {
    if (!this.data.agreed) {
      wx.showToast({ title: "请先阅读并同意相关协议", icon: "none" });
      return;
    }
    this.doLogin({ nickName: "开发调试用户", avatarUrl: "" });
  },

  doLogin(userInfo) {
    if (this._jumping) return;
    this.clearLoginTimer();
    this.setData({ loading: true });
    wx.setStorageSync("yitan_user", userInfo);

    // 兜底：最多等 12 秒一定进首页，避免一直转圈
    this._loginTimer = setTimeout(() => {
      if (!this._jumping) {
        wx.showToast({ title: "登录超时，先进入应用", icon: "none" });
        this.goHome();
      }
    }, 12000);

    wx.login({
      success: (res) => {
        if (res.code && isApiOn()) {
          this.callRestLogin(res.code, userInfo);
          return;
        }
        this.goHome();
      },
      fail: () => {
        this.goHome();
      }
    });
  },

  clearLoginTimer() {
    if (this._loginTimer) {
      clearTimeout(this._loginTimer);
      this._loginTimer = null;
    }
  },

  callRestLogin(code, userInfo) {
    loginWithCode(code, 10000)
      .then((data) => {
        wx.setStorageSync("yitan_user", {
          ...userInfo,
          openid: data.openid || ""
        });
        this.goHome();
      })
      .catch((err) => {
        console.warn("REST 登录失败，直接进入本地模式", err);
        wx.showToast({
          title: "后端较慢，已进入本地模式",
          icon: "none",
          duration: 2000
        });
        this.goHome();
      });
  },

  callCloudLogin(code, userInfo) {
    let finished = false;
    const finish = (extra) => {
      if (finished) return;
      finished = true;
      wx.setStorageSync("yitan_user", { ...userInfo, ...extra });
      this.goHome();
    };

    setTimeout(() => finish({}), 1500);

    wx.cloud
      .callFunction({ name: "login", data: { code } })
      .then((res) => {
        const result = (res && res.result) || {};
        finish({ openid: result.openid || "" });
      })
      .catch((err) => {
        console.warn("云函数 login 调用失败", err);
        finish({});
      });
  },

  goHome() {
    if (this._jumping) return;
    this._jumping = true;
    this.clearLoginTimer();
    this.setData({ loading: false });

    wx.reLaunch({
      url: "/pages/index/index",
      success: () => {
        this._jumping = false;
      },
      fail: () => {
        wx.redirectTo({
          url: "/pages/index/index",
          success: () => {
            this._jumping = false;
          },
          fail: () => {
            this._jumping = false;
            wx.showModal({
              title: "跳转失败",
              content: "找不到首页，请确认项目里有 pages/index 文件夹",
              showCancel: false
            });
          }
        });
      }
    });
  }
});
