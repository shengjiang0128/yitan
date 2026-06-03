Page({
  data: { tags: ["炒粉", "奶茶", "烧烤", "甜品", "水果"] },
  onSearch(e) {
    const kw = e.detail.value;
    if (!kw) return;
    wx.navigateTo({
      url: `/pages/category/category?id=search&name=${encodeURIComponent(kw)}`
    });
  },
  onTag(e) {
    const kw = e.currentTarget.dataset.kw;
    wx.navigateTo({
      url: `/pages/category/category?id=search&name=${encodeURIComponent(kw)}`
    });
  }
});
