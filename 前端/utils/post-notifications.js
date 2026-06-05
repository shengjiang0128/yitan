const STORAGE_KEY = "yitan_post_notifications";
const DEFAULT_AVATAR = "/images/icons/notifyPage/portrait.png";

const ACTORS = [
  { username: "阿强", avatar: DEFAULT_AVATAR },
  { username: "贝岗吃货", avatar: DEFAULT_AVATAR },
  { username: "广外学子", avatar: DEFAULT_AVATAR },
  { username: "奶茶控", avatar: DEFAULT_AVATAR },
  { username: "夜宵搭子", avatar: DEFAULT_AVATAR }
];

function getStoredList() {
  return wx.getStorageSync(STORAGE_KEY) || [];
}

function saveStoredList(list) {
  wx.setStorageSync(STORAGE_KEY, list.slice(0, 80));
}

function getMyPosts() {
  const { getPosts } = require("./posts.js");
  const { getProfile } = require("./profile.js");
  const profile = getProfile();
  const all = getPosts();
  const mine = all.filter(
    (p) => !p.authorNickname || p.authorNickname === profile.nickname
  );
  return mine.length ? mine : all.slice(0, 4);
}

function getMyStalls() {
  const { getStalls } = require("./stalls.js");
  return getStalls();
}

function formatLikeItem(raw) {
  const postTitle = raw.postTitle || "帖子";
  return {
    id: raw.id,
    type: "like",
    actionText: "赞了",
    avatar: raw.avatar || DEFAULT_AVATAR,
    username: raw.username || "用户",
    postId: raw.postId,
    postTitle,
    content: `赞了你的帖子「${postTitle}」`,
    time: raw.time || "刚刚"
  };
}

function formatCollectItem(raw) {
  const stallName = raw.stallName || "小摊";
  return {
    id: raw.id,
    type: "collect",
    actionText: "收藏了",
    avatar: raw.avatar || DEFAULT_AVATAR,
    username: raw.username || "用户",
    stallId: raw.stallId,
    stallName,
    content: `收藏了你的小摊「${stallName}」`,
    time: raw.time || "刚刚"
  };
}

function formatItem(raw) {
  if (raw.type === "collect" || raw.stallId != null) {
    return formatCollectItem(raw);
  }
  return formatLikeItem(raw);
}

function buildSeedLikeNotifications() {
  const posts = getMyPosts();
  if (!posts.length) return [];

  const seeds = [
    { actorIndex: 0, postIndex: 0, time: "昨天 18:20" },
    { actorIndex: 2, postIndex: 0, time: "今天 10:30" },
    { actorIndex: 4, postIndex: 1, time: "前天 16:40" }
  ];

  return seeds
    .map((seed, index) => {
      const post = posts[seed.postIndex % posts.length];
      const actor = ACTORS[seed.actorIndex % ACTORS.length];
      if (!post) return null;
      return formatLikeItem({
        id: `seed_like_${index}`,
        username: actor.username,
        avatar: actor.avatar,
        postId: post.id,
        postTitle: post.title || post.content || "帖子",
        time: seed.time
      });
    })
    .filter(Boolean);
}

function buildSeedCollectNotifications() {
  const stalls = getMyStalls();
  if (!stalls.length) return [];

  const seeds = [
    { actorIndex: 1, stallIndex: 0, time: "周一 12:05" },
    { actorIndex: 3, stallIndex: 0, time: "昨天 09:18" }
  ];

  return seeds
    .map((seed, index) => {
      const stall = stalls[seed.stallIndex % stalls.length];
      const actor = ACTORS[seed.actorIndex % ACTORS.length];
      if (!stall) return null;
      return formatCollectItem({
        id: `seed_collect_${index}`,
        username: actor.username,
        avatar: actor.avatar,
        stallId: stall.id,
        stallName: stall.name,
        time: seed.time
      });
    })
    .filter(Boolean);
}

function itemKey(item) {
  if (item.type === "collect") {
    return `collect_${item.stallId}_${item.username}`;
  }
  return `like_${item.postId}_${item.username}`;
}

/** 赞（帖子）+ 收藏（小摊）通知列表 */
function getLikeCollectNotifications() {
  const stored = getStoredList().map(formatItem);
  const seeds = [
    ...buildSeedLikeNotifications(),
    ...buildSeedCollectNotifications()
  ];
  const seen = new Set(stored.map(itemKey));
  const merged = [...stored];
  seeds.forEach((item) => {
    const key = itemKey(item);
    if (!seen.has(key)) {
      merged.push(item);
      seen.add(key);
    }
  });
  return merged;
}

function addLikeNotification(payload) {
  const { postId, postTitle, username, avatar } = payload || {};
  if (postId == null) return;

  const actor =
    ACTORS.find((a) => a.username === username) ||
    ACTORS[Math.floor(Math.random() * ACTORS.length)];

  const item = formatLikeItem({
    id: `like_${Date.now()}`,
    username: username || actor.username,
    avatar: avatar || actor.avatar,
    postId,
    postTitle: postTitle || "帖子",
    time: "刚刚"
  });

  saveStoredList([item, ...getStoredList()]);
  return item;
}

function addStallCollectNotification(payload) {
  const { stallId, stallName, username, avatar } = payload || {};
  if (stallId == null) return;

  const actor =
    ACTORS.find((a) => a.username === username) ||
    ACTORS[Math.floor(Math.random() * ACTORS.length)];

  const item = formatCollectItem({
    id: `collect_${Date.now()}`,
    username: username || actor.username,
    avatar: avatar || actor.avatar,
    stallId,
    stallName: stallName || "小摊",
    time: "刚刚"
  });

  saveStoredList([item, ...getStoredList()]);
  return item;
}

/** 发帖后：模拟有人赞你的帖子 */
function notifyOnMyPostPublished(post) {
  if (!post || post.id == null) return;
  addLikeNotification({
    postId: post.id,
    postTitle: post.title || post.content || "帖子",
    username: ACTORS[0].username,
    avatar: ACTORS[0].avatar
  });
}

/** 开张/有新摊后：模拟有人收藏你的小摊 */
function notifyOnMyStallOpened(stall) {
  if (!stall || stall.id == null) return;
  addStallCollectNotification({
    stallId: stall.id,
    stallName: stall.name,
    username: ACTORS[1].username,
    avatar: ACTORS[1].avatar
  });
}

module.exports = {
  getLikeCollectNotifications,
  addLikeNotification,
  addStallCollectNotification,
  notifyOnMyPostPublished,
  notifyOnMyStallOpened
};
