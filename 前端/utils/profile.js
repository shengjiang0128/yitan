const STORAGE_KEY = "yitan_profile";

const BROKEN_AVATAR = "/images/avatar.png";
const DEFAULT_AVATAR = "/images/icons/notifyPage/portrait.png";

const DEFAULT_PROFILE = {
  nickname: "脑摊A65235",
  stallId: "555555",
  bio: "哈哈哈哈哈我爱吃",
  avatar: DEFAULT_AVATAR,
  followCount: 250,
  fansCount: 20
};

function isPlaceholderAvatar(avatar) {
  if (!avatar) return true;
  if (avatar === BROKEN_AVATAR) return true;
  // 后端 Mock 常用占位域名，小程序无法加载
  if (/example\.com/i.test(avatar)) return true;
  return false;
}

function normalizeAvatar(avatar) {
  if (isPlaceholderAvatar(avatar)) {
    return DEFAULT_AVATAR;
  }
  return avatar;
}

/** 用户在本机改过头像（相册/拍照临时路径等） */
function isUserChosenAvatar(avatar) {
  if (!avatar || isPlaceholderAvatar(avatar)) return false;
  if (/^wxfile:/i.test(avatar)) return true;
  if (/^https?:\/\//i.test(avatar) && !/example\.com/i.test(avatar)) {
    return true;
  }
  return avatar !== DEFAULT_AVATAR;
}

function getProfile() {
  const stored = wx.getStorageSync(STORAGE_KEY) || {};
  const profile = { ...DEFAULT_PROFILE, ...stored };
  profile.avatar = normalizeAvatar(profile.avatar);
  return profile;
}

function saveProfile(partial) {
  const next = { ...getProfile(), ...partial };
  if (next.avatar) {
    next.avatar = normalizeAvatar(next.avatar);
  }
  wx.setStorageSync(STORAGE_KEY, next);
  return getProfile();
}

/** 拉接口后合并：本地已改头像不被后端 Mock 覆盖 */
function mergeWithApiData(apiData) {
  const stored = wx.getStorageSync(STORAGE_KEY) || {};
  const local = { ...DEFAULT_PROFILE, ...stored };
  const merged = { ...(apiData || {}), ...local };
  if (isUserChosenAvatar(local.avatar)) {
    merged.avatar = local.avatar;
  }
  merged.avatar = normalizeAvatar(merged.avatar);
  wx.setStorageSync(STORAGE_KEY, merged);
  return getProfile();
}

module.exports = {
  getProfile,
  saveProfile,
  mergeWithApiData,
  isUserChosenAvatar,
  DEFAULT_AVATAR
};
