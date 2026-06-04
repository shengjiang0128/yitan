const { getPosts } = require("./posts.js");
const { getProfile } = require("./profile.js");

const DEFAULT_AVATAR = "/images/icons/notifyPage/portrait.png";

/** 其他用户的示例帖子，与本地发布的帖子合并展示 */
const COMMUNITY_SEED = [
  {
    id: "c101",
    postType: "image",
    img: "/images/icons/indexPage/泰奶冰沙.png",
    title: "贝岗泰奶冰沙打卡",
    content: "少冰半糖刚刚好，夏天必备",
    likeCount: 326,
    authorNickname: "奶茶星人",
    authorAvatar: DEFAULT_AVATAR,
    createdAt: "2026-05-30T18:00:00.000Z"
  },
  {
    id: "c102",
    postType: "image",
    img: "/images/icons/stallPage/绵绵冰.png",
    title: "绵绵冰治愈一切",
    content: "芒果味超细，广外南门必吃",
    likeCount: 512,
    authorNickname: "甜品脑袋",
    authorAvatar: DEFAULT_AVATAR,
    createdAt: "2026-05-29T12:00:00.000Z"
  },
  {
    id: "c103",
    postType: "text",
    title: "今晚吃什么呢",
    content: "求推荐广外附近好吃的炸物摊，最好离南门近一点～",
    likeCount: 89,
    authorNickname: "选择困难",
    authorAvatar: DEFAULT_AVATAR,
    createdAt: "2026-05-28T20:30:00.000Z"
  },
  {
    id: "c104",
    postType: "image",
    img: "/images/icons/catogoryPage/摊位主图1.png",
    title: "发现宝藏小摊",
    content: "藏在贝岗小吃街，人均十几块",
    likeCount: 178,
    authorNickname: "探店小能手",
    authorAvatar: DEFAULT_AVATAR,
    createdAt: "2026-05-27T09:15:00.000Z"
  },
  {
    id: "c105",
    postType: "image",
    img: "/images/icons/indexPage/大众炒粉.png",
    title: "南门炒粉绝了",
    content: "蛋炒河粉加辣加蛋，十块钱吃到撑",
    likeCount: 441,
    authorNickname: "干饭王",
    authorAvatar: DEFAULT_AVATAR,
    createdAt: "2026-05-26T11:00:00.000Z"
  },
  {
    id: "c106",
    postType: "text",
    title: "摊主们今天出摊吗",
    content: "下雨天了，想知道常去的那几家还开不开",
    likeCount: 45,
    authorNickname: "老食客阿杰",
    authorAvatar: DEFAULT_AVATAR,
    createdAt: "2026-05-25T16:40:00.000Z"
  }
];

function hashHeight(id) {
  const n = String(id)
    .split("")
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return 300 + (n % 5) * 56;
}

function normalizePost(raw, profile) {
  const authorNickname =
    raw.authorNickname ||
    (raw.author && raw.author.nickname) ||
    profile.nickname;
  const authorAvatar =
    raw.authorAvatar ||
    (raw.author && raw.author.avatar) ||
    profile.avatar ||
    DEFAULT_AVATAR;
  const isText = raw.postType === "text";
  const coverImg =
    raw.img || (raw.images && raw.images[0]) || "";

  return {
    ...raw,
    authorNickname,
    authorAvatar,
    isMine: false,
    coverImg,
    displayTitle: raw.title || raw.content || "帖子",
    coverHeight: isText ? 268 : hashHeight(raw.id)
  };
}

function getCommunityPosts() {
  const profile = getProfile();
  const stored = wx.getStorageSync("yitan_posts");
  const hasUserPosts = stored && stored.length > 0;

  const list = getPosts().map((item) => {
    const post = normalizePost(item, profile);
    if (hasUserPosts && post.authorNickname === profile.nickname) {
      post.isMine = true;
    }
    return post;
  });

  const seen = new Set(list.map((p) => String(p.id)));
  COMMUNITY_SEED.forEach((item) => {
    if (!seen.has(String(item.id))) {
      list.push(normalizePost(item, profile));
      seen.add(String(item.id));
    }
  });

  return list.sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta;
  });
}

/** 双列瀑布流：按预估高度均衡分配到左右列 */
function splitWaterfall(posts) {
  const leftCol = [];
  const rightCol = [];
  let leftH = 0;
  let rightH = 0;

  posts.forEach((post) => {
    const cardH = post.coverHeight + 160;
    if (leftH <= rightH) {
      leftCol.push(post);
      leftH += cardH;
    } else {
      rightCol.push(post);
      rightH += cardH;
    }
  });

  return { leftCol, rightCol };
}

module.exports = {
  getCommunityPosts,
  splitWaterfall
};
