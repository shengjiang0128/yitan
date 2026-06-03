const STORAGE_KEY = "yitan_posts";

const DEFAULT_POSTS = [
  {
    id: 1,
    postType: "image",
    img: "/images/icons/indexPage/大众炒粉.png",
    title: "广外南门炒粉也太好吃了",
    content: "蛋炒河粉加辣加蛋，十块钱吃到撑",
    likeCount: 128,
    collectCount: 45,
    tags: ["炒粉", "广外南门"],
    location: "广外南门",
    type: "food"
  },
  {
    id: 2,
    postType: "image",
    img: "/images/icons/indexPage/泰奶冰沙.png",
    title: "贝岗泰奶冰沙打卡",
    content: "夏天必备，少冰半糖刚刚好",
    likeCount: 86,
    collectCount: 32,
    tags: ["奶茶", "贝岗"],
    location: "贝岗小吃街",
    type: "food"
  },
  {
    id: 3,
    postType: "image",
    img: "/images/icons/catogoryPage/摊位主图1.png",
    title: "发现一家宝藏小摊",
    content: "藏在贝岗小吃街里，人均十几块",
    likeCount: 52,
    collectCount: 18,
    tags: ["探店", "小吃街"],
    location: "贝岗小吃街",
    type: "stall"
  },
  {
    id: 4,
    postType: "text",
    title: "今晚吃什么呢",
    content: "求推荐广外附近好吃的炸物摊，最好离南门近一点",
    likeCount: 24,
    collectCount: 6,
    tags: ["求推荐", "炸物"],
    location: "",
    type: "food"
  },
  {
    id: 5,
    postType: "image",
    img: "/images/icons/stallPage/绵绵冰.png",
    title: "绵绵冰治愈一切",
    content: "这家绵绵冰口感很细，芒果味推荐",
    likeCount: 201,
    collectCount: 88,
    tags: ["甜品", "绵绵冰"],
    location: "广外南门",
    type: "food"
  }
];

function getPosts() {
  const stored = wx.getStorageSync(STORAGE_KEY);
  const list = stored && stored.length ? stored : DEFAULT_POSTS;
  return list.map((item) => {
    let next = { ...item, likeCount: item.likeCount || 0 };
    if (!next.img || /^\/images\/post\d+\.png$/.test(next.img)) {
      const fallback = DEFAULT_POSTS.find((p) => p.id === next.id);
      if (fallback) next = { ...next, img: fallback.img };
    }
    return next;
  });
}

function getPostById(id) {
  return getPosts().find((item) => String(item.id) === String(id));
}

function addPost(post) {
  const list = getPosts();
  const next = [post, ...list];
  wx.setStorageSync(STORAGE_KEY, next);
  return next;
}

function createPostId() {
  return Date.now();
}

module.exports = {
  getPosts,
  getPostById,
  addPost,
  createPostId,
  DEFAULT_POSTS
};
