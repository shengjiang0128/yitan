const { addStall, getStalls } = require("../../utils/stalls.js");
const { getProfile } = require("../../utils/profile.js");
const { notifyOnMyStallOpened } = require("../../utils/post-notifications.js");
const {
  STALL_CATEGORIES,
  COMMON_LOCATIONS
} = require("../../utils/stall-categories.js");

Page({
  data: {
    statusBarHeight: 20,
    categories: STALL_CATEGORIES,
    name: "",
    category: "",
    address: "",
    addressDetail: "",
    mapImage: "",
    mapMarker: null,
    stallPhotos: [],
    menuImages: [],
    ownerName: "",
    ownerIdCard: "",
    ownerPhone: "",
    maxStallPhotos: 6,
    maxMenuImages: 3
  },

  onLoad() {
    const sys = wx.getWindowInfo();
    this.setData({ statusBarHeight: sys.statusBarHeight });
  },

  goBack() {
    wx.navigateBack();
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onAddressDetailInput(e) {
    this.setData({ addressDetail: e.detail.value });
  },

  onOwnerNameInput(e) {
    this.setData({ ownerName: e.detail.value });
  },

  onOwnerIdCardInput(e) {
    this.setData({ ownerIdCard: e.detail.value });
  },

  onOwnerPhoneInput(e) {
    this.setData({ ownerPhone: e.detail.value });
  },

  pickCategory(e) {
    this.setData({ category: e.currentTarget.dataset.value });
  },

  pickLocation() {
    wx.showActionSheet({
      itemList: COMMON_LOCATIONS,
      success: (res) => {
        const picked = COMMON_LOCATIONS[res.tapIndex];
        this.setData({
          address: picked === "其他位置" ? "" : picked
        });
      }
    });
  },

  chooseMapImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        this.setData({
          mapImage: res.tempFiles[0].tempFilePath,
          mapMarker: null
        });
      }
    });
  },

  removeMapImage() {
    this.setData({ mapImage: "", mapMarker: null });
  },

  onMapMarkTap(e) {
    if (!this.data.mapImage) return;

    wx.createSelectorQuery()
      .select("#mapMarkArea")
      .boundingClientRect((rect) => {
        if (!rect || !rect.width || !rect.height) return;

        const x = e.detail.x - rect.left;
        const y = e.detail.y - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

        this.setData({
          mapMarker: {
            x: Math.round((x / rect.width) * 1000) / 10,
            y: Math.round((y / rect.height) * 1000) / 10
          }
        });
      })
      .exec();
  },

  chooseStallPhotos() {
    const remain = this.data.maxStallPhotos - this.data.stallPhotos.length;
    if (remain <= 0) {
      wx.showToast({ title: "最多 6 张摊位照片", icon: "none" });
      return;
    }

    wx.chooseMedia({
      count: remain,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const paths = res.tempFiles.map((f) => f.tempFilePath);
        this.setData({
          stallPhotos: [...this.data.stallPhotos, ...paths]
        });
      }
    });
  },

  removeStallPhoto(e) {
    const index = e.currentTarget.dataset.index;
    const stallPhotos = [...this.data.stallPhotos];
    stallPhotos.splice(index, 1);
    this.setData({ stallPhotos });
  },

  chooseMenuImages() {
    const remain = this.data.maxMenuImages - this.data.menuImages.length;
    if (remain <= 0) {
      wx.showToast({ title: "最多 3 张价目表", icon: "none" });
      return;
    }

    wx.chooseMedia({
      count: remain,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const paths = res.tempFiles.map((f) => f.tempFilePath);
        this.setData({
          menuImages: [...this.data.menuImages, ...paths]
        });
      }
    });
  },

  removeMenuImage(e) {
    const index = e.currentTarget.dataset.index;
    const menuImages = [...this.data.menuImages];
    menuImages.splice(index, 1);
    this.setData({ menuImages });
  },

  validateForm() {
    const {
      name,
      category,
      address,
      addressDetail,
      mapImage,
      mapMarker,
      stallPhotos,
      menuImages,
      ownerName,
      ownerIdCard,
      ownerPhone
    } = this.data;

    if (!(name || "").trim()) {
      wx.showToast({ title: "请填写小摊名称", icon: "none" });
      return false;
    }
    if (!category) {
      wx.showToast({ title: "请选择摊位分类", icon: "none" });
      return false;
    }
    if (!(address || "").trim() && !(addressDetail || "").trim()) {
      wx.showToast({ title: "请填写出摊位置", icon: "none" });
      return false;
    }
    if (!mapImage) {
      wx.showToast({ title: "请上传古法地图", icon: "none" });
      return false;
    }
    if (!mapMarker) {
      wx.showToast({ title: "请在地图上标注出摊位置", icon: "none" });
      return false;
    }
    if (!stallPhotos.length) {
      wx.showToast({ title: "请上传摊位照片", icon: "none" });
      return false;
    }
    if (!menuImages.length) {
      wx.showToast({ title: "请上传菜单价目表", icon: "none" });
      return false;
    }
    if (!(ownerName || "").trim()) {
      wx.showToast({ title: "请填写摊主姓名", icon: "none" });
      return false;
    }
    const idCard = (ownerIdCard || "").trim();
    if (!/^\d{17}[\dXx]$/.test(idCard)) {
      wx.showToast({ title: "请填写正确身份证号", icon: "none" });
      return false;
    }
    const phone = (ownerPhone || "").trim();
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: "请填写正确手机号", icon: "none" });
      return false;
    }
    return true;
  },

  onSubmit() {
    if (!this.validateForm()) return;

    const profile = getProfile();
    const stalls = getStalls();
    const stallId = String(100000 + stalls.length + 1);
    const fullAddress = [this.data.address, this.data.addressDetail]
      .map((item) => (item || "").trim())
      .filter(Boolean)
      .join(" · ");

    const nextStalls = addStall({
      name: this.data.name.trim(),
      stallId,
      status: "审核中",
      category: this.data.category,
      address: fullAddress,
      addressDetail: (this.data.addressDetail || "").trim(),
      mapImage: this.data.mapImage,
      mapMarker: this.data.mapMarker,
      stallPhotos: this.data.stallPhotos,
      coverImage: this.data.stallPhotos[0],
      menuImages: this.data.menuImages,
      owner: {
        name: this.data.ownerName.trim(),
        idCard: this.data.ownerIdCard.trim(),
        phone: this.data.ownerPhone.trim()
      },
      ownerId: profile.stallId,
      createdAt: new Date().toISOString()
    });

    notifyOnMyStallOpened(nextStalls[0]);

    wx.showToast({ title: "提交成功，等待审核", icon: "success" });
    setTimeout(() => {
      wx.navigateBack();
    }, 600);
  }
});
