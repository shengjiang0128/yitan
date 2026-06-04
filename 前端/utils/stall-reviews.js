const { getProfile } = require("./profile.js");

const STORAGE_KEY = "yitan_stall_reviews";

function getAllReviews() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

function saveAllReviews(list) {
  wx.setStorageSync(STORAGE_KEY, list);
}

function addReview(payload) {
  const profile = getProfile();
  const {
    stallId,
    stallName,
    stallCover,
    content,
    images = []
  } = payload || {};

  const review = {
    id: Date.now(),
    stallId: String(stallId),
    stallName: stallName || "小摊",
    stallCover: stallCover || "",
    content: (content || "").trim(),
    images: images.slice(0, 3),
    authorNickname: profile.nickname,
    authorAvatar: profile.avatar,
    likeCount: 0,
    createdAt: new Date().toISOString()
  };

  const list = getAllReviews();
  list.unshift(review);
  saveAllReviews(list);
  return review;
}

function getReviewsByStallId(stallId) {
  const sid = String(stallId);
  return getAllReviews()
    .filter((item) => String(item.stallId) === sid)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

function getMyReviews() {
  const profile = getProfile();
  return getAllReviews()
    .filter((item) => item.authorNickname === profile.nickname)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

function formatReviewDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${m}月${d}日 ${hh}:${mm}`;
}

module.exports = {
  addReview,
  getReviewsByStallId,
  getMyReviews,
  formatReviewDate
};
