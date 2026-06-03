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

function normalizeAvatar(avatar) {
  if (!avatar || avatar === BROKEN_AVATAR) {
    return DEFAULT_AVATAR;
  }
  return avatar;
}

function getProfile() {
  const stored = wx.getStorageSync(STORAGE_KEY) || {};
  const profile = { ...DEFAULT_PROFILE, ...stored };
  profile.avatar = normalizeAvatar(profile.avatar);
  return profile;
}

function saveProfile(partial) {
  const next = { ...getProfile(), ...partial };
  wx.setStorageSync(STORAGE_KEY, next);
  return next;
}

module.exports = {
  getProfile,
  saveProfile,
  DEFAULT_PROFILE
};
