Page({
  data: {
    statusBarHeight: 88,
    stall: {
      id: 1,
      name: '土豆泥拌粉',
      rating: 5,
      health: '优秀',
      banner: '/images/stall-banner.jpg',
      logo: '/images/school-logo.png',
      likeCount: 2200
    }
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  goNavigate() {
    // 调用地图导航API
    wx.openLocation({
      latitude: 23.123456, // 替换为摊位实际坐标
      longitude: 113.123456,
      name: this.data.stall.name,
      address: '摊位地址'
    });
  },

  goMap() {
    wx.navigateTo({ url: '/pages/map/map' });
  },

  goContact() {
    // 联系摊主/进群逻辑
    wx.showModal({
      title: '联系摊主',
      content: '请选择联系方式',
      confirmText: '拨打电话',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '13800138000' });
        }
      }
    });
  },

  goWriteReview() {
    wx.navigateTo({ url: '/pages/write-review/write-review?stallId=' + this.data.stall.id });
  }
});