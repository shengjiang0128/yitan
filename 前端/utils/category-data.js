const INDEX_STALLS = [
  {
    id: "1",
    name: "大众炒粉",
    img: "/images/icons/indexPage/大众炒粉.png",
    banner: "/images/icons/indexPage/大众炒粉.png",
    distance: 500,
    tags: ["必吃榜", "炒粉"],
    avgPrice: 10,
    rating: 5,
    health: "优秀",
    likeCount: 2200
  },
  {
    id: "2",
    name: "泰奶冰沙",
    img: "/images/icons/indexPage/泰奶冰沙.png",
    banner: "/images/icons/indexPage/泰奶冰沙.png",
    distance: 202,
    tags: ["必吃榜", "饮品"],
    avgPrice: 18,
    rating: 5,
    health: "优秀",
    likeCount: 1800
  }
];

const CATEGORY_STALLS = {
  fruit: [
    {
      id: "f1",
      name: "鲜切水果摊",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 120,
      avgPrice: 15,
      productPrice: 12,
      productName: "西瓜盒"
    },
    {
      id: "f2",
      name: "贝岗果切小站",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 280,
      avgPrice: 18,
      productPrice: 16,
      productName: "混合果切"
    }
  ],
  staple: [
    {
      id: 1,
      name: "大众炒粉",
      img: "/images/icons/indexPage/大众炒粉.png",
      tags: ["必吃榜", "炒粉"],
      distance: 200,
      avgPrice: 10,
      productPrice: 9,
      productName: "蛋炒河粉"
    },
    {
      id: 2,
      name: "土豆泥拌粉",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      tags: ["必吃榜", "拌粉"],
      distance: 320,
      avgPrice: 14,
      productPrice: 13,
      productName: "招牌拌粉"
    },
    {
      id: 3,
      name: "东北烤冷面（贝岗小摊店）",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 410,
      avgPrice: 12,
      productPrice: 10,
      productName: "经典烤冷面"
    }
  ],
  steam: [
    {
      id: "s1",
      name: "广式蒸点铺",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 180,
      avgPrice: 16,
      productPrice: 8,
      productName: "鲜肉包"
    },
    {
      id: "s2",
      name: "关东煮小摊",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 260,
      avgPrice: 12,
      productPrice: 3,
      productName: "鱼豆腐"
    }
  ],
  dessert: [
    {
      id: "d1",
      name: "糖水铺子",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 150,
      avgPrice: 14,
      productPrice: 12,
      productName: "双皮奶"
    },
    {
      id: "d2",
      name: "贝岗鸡蛋仔",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 300,
      avgPrice: 16,
      productPrice: 15,
      productName: "原味鸡蛋仔"
    }
  ],
  drink: [
    {
      id: "dr1",
      name: "泰奶冰沙",
      img: "/images/icons/indexPage/泰奶冰沙.png",
      tags: ["必吃榜", "饮品"],
      distance: 202,
      avgPrice: 18,
      productPrice: 16,
      productName: "泰奶冰沙"
    },
    {
      id: "dr2",
      name: "喜茶（贝岗店）",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 365,
      avgPrice: 20,
      productPrice: 20,
      productName: "清爽芭乐提"
    }
  ],
  grill: [
    {
      id: "g1",
      name: "阿强烧烤",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 240,
      avgPrice: 35,
      productPrice: 5,
      productName: "烤羊肉串"
    },
    {
      id: "g2",
      name: "铁板烧小摊",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 390,
      avgPrice: 28,
      productPrice: 18,
      productName: "铁板鱿鱼"
    }
  ],
  fry: [
    {
      id: "fr1",
      name: "炸物研究所",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 160,
      avgPrice: 15,
      productPrice: 8,
      productName: "香酥鸡排"
    },
    {
      id: "fr2",
      name: "韩式炸鸡档",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 330,
      avgPrice: 22,
      productPrice: 19,
      productName: "双拼炸鸡"
    }
  ],
  other: [
    {
      id: "o1",
      name: "深夜热狗摊",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 220,
      avgPrice: 12,
      productPrice: 10,
      productName: "经典热狗"
    },
    {
      id: "o2",
      name: "广外文创小摊",
      img: "/images/icons/catogoryPage/摊位主图1.png",
      distance: 450,
      avgPrice: 20,
      productPrice: 15,
      productName: "创意周边"
    }
  ]
};

const DEFAULT_CATEGORY = {
  id: "staple",
  name: "主食"
};

function getCategoryStalls(categoryId) {
  return CATEGORY_STALLS[categoryId] || CATEGORY_STALLS.staple;
}

function getAllStalls() {
  return Object.values(CATEGORY_STALLS).flat();
}

function getStallById(id) {
  const sid = String(id);
  const fromIndex = INDEX_STALLS.find((item) => String(item.id) === sid);
  if (fromIndex) return fromIndex;
  const fromCategory = getAllStalls().find((item) => String(item.id) === sid);
  if (fromCategory) {
    return {
      ...fromCategory,
      tags: fromCategory.tags || ["必吃榜"],
      rating: fromCategory.rating || 5,
      health: fromCategory.health || "优秀",
      likeCount: fromCategory.likeCount || 1200,
      banner: fromCategory.banner || fromCategory.img
    };
  }
  return null;
}

function searchStalls(keyword) {
  const kw = (keyword || "").trim();
  if (!kw) return getAllStalls();
  return getAllStalls().filter(
    (item) =>
      item.name.includes(kw) || (item.productName || "").includes(kw)
  );
}

module.exports = {
  INDEX_STALLS,
  CATEGORY_STALLS,
  DEFAULT_CATEGORY,
  getCategoryStalls,
  getAllStalls,
  getStallById,
  searchStalls
};
