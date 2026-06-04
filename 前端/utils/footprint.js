const STORAGE_KEY = "yitan_footprints";
const RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

function prune(list) {
  const cutoff = Date.now() - RETENTION_MS;
  return (list || []).filter((item) => {
    const t = new Date(item.viewedAt).getTime();
    return !Number.isNaN(t) && t >= cutoff;
  });
}

function formatViewedAt(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const startOfView = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  const dayDiff = Math.floor((startOfToday - startOfView) / 86400000);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  if (dayDiff === 0) return `今天 ${hh}:${mm}`;
  if (dayDiff === 1) return `昨天 ${hh}:${mm}`;
  if (dayDiff < 7) return `${dayDiff}天前`;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function enrich(item) {
  return {
    ...item,
    timeText: formatViewedAt(item.viewedAt),
    typeLabel: item.type === "post" ? "帖子" : "摊位"
  };
}

/** 记录浏览足迹（帖子 / 摊位），同一条目会刷新时间并置顶 */
function recordFootprint(payload) {
  const { type, targetId, title, cover } = payload || {};
  if (!type || targetId == null) return;

  const id = String(targetId);
  let list = prune(wx.getStorageSync(STORAGE_KEY) || []);
  list = list.filter(
    (item) => !(item.type === type && String(item.targetId) === id)
  );
  list.unshift({
    type,
    targetId: id,
    title: title || "",
    cover: cover || "",
    viewedAt: new Date().toISOString()
  });
  wx.setStorageSync(STORAGE_KEY, prune(list));
}

function getFootprints(filterType) {
  let list = prune(wx.getStorageSync(STORAGE_KEY) || []);
  list.sort(
    (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
  );
  if (filterType) {
    list = list.filter((item) => item.type === filterType);
  }
  return list.map(enrich);
}

module.exports = {
  recordFootprint,
  getFootprints,
  RETENTION_MS
};
