const MODE_KEY = "yitan_app_mode";

function getAppMode() {
  return wx.getStorageSync(MODE_KEY) || "eater";
}

function setAppMode(mode) {
  wx.setStorageSync(MODE_KEY, mode);
  return mode;
}

function isCookMode() {
  return getAppMode() === "cook";
}

function toggleAppMode() {
  const next = isCookMode() ? "eater" : "cook";
  setAppMode(next);
  return next;
}

module.exports = {
  getAppMode,
  setAppMode,
  isCookMode,
  toggleAppMode
};
