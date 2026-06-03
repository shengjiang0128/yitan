Page({
  data: {
    statusBarHeight: 50,
    // 死数据：用户信息
    userInfo: {
      nickname: "脑摊A65235",
      stallId: "555555",
      bio: "哈哈哈哈哈我爱吃",
      followCount: 250,
      fansCount: 20,
      avatar: "/images/avatar.png"
    },
    // 死数据：帖子列表
    posts: [
      { id: 1, img: "/images/post1.png", title: "帖子1", type: "food" },
      { id: 2, img: "/images/post2.png", title: "帖子2", type: "food" },
      { id: 3, img: "/images/post3.png", title: "帖子3", type: "stall" },
      { id: 4, img: "/images/post4.png", title: "帖子4", type: "stall" },
      { id: 5, img: "/images/post5.png", title: "帖子5", type: "food" }
    ]
  },

  onLoad() {
    // 页面加载时请求后端接口
    this.fetchUserInfo()
    this.fetchPosts()
  },

  // 请求用户信息接口
  fetchUserInfo() {
    wx.request({
      url: "http://localhost:3000/api/userInfo",
      method: "GET",
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            userInfo: res.data.data
          })
        }
      },
      fail: () => {
        console.log("用户信息接口请求失败，使用本地死数据")
      }
    })
  },

  // 请求帖子列表接口
  fetchPosts() {
    wx.request({
      url: "http://localhost:3000/api/myPosts",
      method: "GET",
      success: (res) => {
        if (res.data.code === 200) {
          this.setData({
            posts: res.data.data
          })
        }
      },
      fail: () => {
        console.log("帖子接口请求失败，使用本地死数据")
      }
    })
  },

  // 点击功能栏，跳转到对应页面
  goToPage(e) {
    const type = e.currentTarget.dataset.type
    let url = ""
    switch (type) {
      case "footprint":
        url = "/pages/footprint/footprint"
        break
      case "like":
        url = "/pages/like/like"
        break
      case "collect":
        url = "/pages/collect/collect"
        break
      case "review":
        url = "/pages/review/review"
        break
    }
    if (url) {
      wx.navigateTo({ url })
    }
  },

  // 点击帖子，跳转到公用详情页
  goToPostDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail/detail?item=${JSON.stringify(item)}`
    })
  }
})