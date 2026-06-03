const FAVORITES_KEY = "yitan_stall_favorites";

function formatDistance(distance) {
  if (distance == null) return "";
  if (typeof distance === "string") return distance;
  if (distance >= 1000) return `${(distance / 1000).toFixed(1)}km`;
  return `${distance}m`;
}

function getFavorites() {
  return wx.getStorageSync(FAVORITES_KEY) || [];
}

function isFavorite(id) {
  const sid = String(id);
  return getFavorites().some((item) => String(item.id) === sid);
}

function buildFavoriteItem(stall) {
  return {
    id: String(stall.id),
    name: stall.name,
    img: stall.img || stall.image || stall.banner || "",
    tags: stall.tags && stall.tags.length ? stall.tags : ["必吃榜"],
    distance: stall.distance,
    distanceText: formatDistance(stall.distance),
    favoritedAt: Date.now()
  };
}

function addFavorite(stall) {
  const sid = String(stall.id);
  const list = getFavorites().filter((item) => String(item.id) !== sid);
  list.unshift(buildFavoriteItem(stall));
  wx.setStorageSync(FAVORITES_KEY, list);
  return list;
}

function removeFavorite(id) {
  const sid = String(id);
  const list = getFavorites().filter((item) => String(item.id) !== sid);
  wx.setStorageSync(FAVORITES_KEY, list);
  return list;
}

function toggleFavorite(stall) {
  if (isFavorite(stall.id)) {
    removeFavorite(stall.id);
    return false;
  }
  addFavorite(stall);
  return true;
}

module.exports = {
  FAVORITES_KEY,
  formatDistance,
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite
};
