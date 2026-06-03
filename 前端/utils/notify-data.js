const CATEGORY_META = {
  like: {
    title: "赞和收藏",
    emptyText: "还没有赞和收藏消息"
  },
  follow: {
    title: "新增关注",
    emptyText: "还没有新增关注"
  },
  comment: {
    title: "评论和@",
    emptyText: "还没有评论和@"
  }
};

const CATEGORY_ITEMS = {
  like: [
    {
      id: "l1",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "阿强",
      content: "赞了你的帖子「广外南门炒粉测评」",
      time: "昨天 18:20"
    },
    {
      id: "l2",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "贝岗吃货",
      content: "收藏了你的帖子「泰奶冰沙真的绝」",
      time: "周一 12:05"
    }
  ],
  follow: [
    {
      id: "f1",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "土豆泥拌粉老板",
      content: "关注了你",
      time: "今天 09:12"
    }
  ],
  comment: [
    {
      id: "c1",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "黄苑舒",
      content: "评论了你：这家饭太好吃了",
      time: "10:50"
    },
    {
      id: "c2",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "夜宵搭子",
      content: "@你 周末一起去贝岗吗",
      time: "昨天 22:18"
    }
  ]
};

const MESSAGE_LIST = [
  {
    id: 1,
    avatar: "/images/icons/notifyPage/portrait.png",
    username: "黄苑舒",
    preview: "[帖子] 这家饭太好吃了",
    time: "10:50"
  },
  {
    id: 2,
    avatar: "/images/icons/notifyPage/portrait.png",
    username: "阿强",
    preview: "明天还去那家炒粉吗？",
    time: "昨天"
  }
];

function getCategoryMeta(type) {
  return CATEGORY_META[type] || CATEGORY_META.like;
}

function getCategoryItems(type) {
  return CATEGORY_ITEMS[type] || [];
}

function getMessageList() {
  let meta = {};
  try {
    meta = wx.getStorageSync("yitan_chat_list_meta") || {};
  } catch (e) {
    meta = {};
  }

  return MESSAGE_LIST.map((item) => {
    const update = meta[item.id];
    if (!update) return item;
    return {
      ...item,
      preview: update.preview,
      time: update.time
    };
  });
}

function getMessageById(id) {
  return MESSAGE_LIST.find((item) => String(item.id) === String(id));
}

module.exports = {
  getCategoryMeta,
  getCategoryItems,
  getMessageList,
  getMessageById
};
