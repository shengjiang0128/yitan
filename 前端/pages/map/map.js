Page({
  data: {
    statusBarHeight: 20,
    stallName: "小摊",
    mapImage: "/images/icons/indexPage/地图.png",
    mapMarker: { x: 62, y: 48 }
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    this.setData({
      statusBarHeight: sys.statusBarHeight,
      stallName: decodeURIComponent(options.name || "小摊")
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
