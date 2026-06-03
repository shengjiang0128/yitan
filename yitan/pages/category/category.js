Page({
  data: {
    statusBarHeight: 88,
    stallList: [
      {
        id: 1,
        name: "大众炒粉",
        img: "/images/icons/indexPage/大众炒粉.png", // 替换为你的本地图片路径
        distance: 200,
        avgPrice: 10,
        productPrice: 9,
        productName: "蛋炒河粉"
      },
      {
        id: 2,
        name: "喜茶（贝岗店）",
        img: "/images/icons/catogoryPage/摊位主图1.png", // 替换为你的本地图片路径
        distance: 365,
        avgPrice: 20,
        productPrice: 20,
        productName: "清爽芭乐提"
      },
      {
        id: 3,
        name: "喜茶（贝岗店）",
        img: "/images/icons/catogoryPage/摊位主图1.png", // 替换为你的本地图片路径
        distance: 365,
        avgPrice: 20,
        productPrice: 20,
        productName: "清爽芭乐提"
      },
      {
        id: 4,
        name: "喜茶（贝岗店）",
        img: "/images/icons/catogoryPage/摊位主图1.png", // 替换为你的本地图片路径
        distance: 365,
        avgPrice: 20,
        productPrice: 20,
        productName: "清爽芭乐提"
      }
    ]
  },

  goBack() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  goStall(){
    
  }
})