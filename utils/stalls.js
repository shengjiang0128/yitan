const STORAGE_KEY = "yitan_stalls";

const DEFAULT_STALLS = [
  {
    id: 1,
    name: "大众炒粉",
    stallId: "555555",
    status: "营业中",
    address: "广外南门附近"
  }
];

function getStalls() {
  const stored = wx.getStorageSync(STORAGE_KEY);
  if (Array.isArray(stored)) {
    return stored;
  }
  return DEFAULT_STALLS;
}

function addStall(stall) {
  const list = getStalls();
  const next = [{ ...stall, id: Date.now() }, ...list];
  wx.setStorageSync(STORAGE_KEY, next);
  return next;
}

function deleteStall(id) {
  const list = getStalls();
  const next = list.filter((stall) => stall.id !== id);
  wx.setStorageSync(STORAGE_KEY, next);
  return next;
}

module.exports = {
  getStalls,
  addStall,
  deleteStall,
  DEFAULT_STALLS
};
