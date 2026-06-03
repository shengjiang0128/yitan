const DEFAULT_COMMENTS = {
  1: [
    {
      id: "c1",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "贝岗吃货",
      content: "这家炒粉我每周都吃！",
      time: "2小时前",
      likeCount: 12
    },
    {
      id: "c2",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "广外学子",
      content: "蛋炒河粉加辣真的绝",
      time: "昨天",
      likeCount: 5
    }
  ],
  2: [
    {
      id: "c3",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "奶茶控",
      content: "泰奶冰沙少冰半糖 yyds",
      time: "3天前",
      likeCount: 8
    }
  ],
  5: [
    {
      id: "c4",
      avatar: "/images/icons/notifyPage/portrait.png",
      username: "夜宵搭子",
      content: "芒果味绵绵冰我也爱",
      time: "1小时前",
      likeCount: 3
    }
  ]
};

const STATE_KEY = "yitan_post_state";
const COMMENT_KEY = "yitan_post_comments";
const COMMENT_LIKE_KEY = "yitan_comment_likes";

function enrichComments(postId, comments) {
  const likeMap = wx.getStorageSync(COMMENT_LIKE_KEY) || {};
  return comments.map((item) => {
    const liked = !!likeMap[`${postId}_${item.id}`];
    const baseCount = item.likeCount || 0;
    return {
      ...item,
      liked,
      likeCount: baseCount + (liked ? 1 : 0)
    };
  });
}

function getComments(postId) {
  const stored = wx.getStorageSync(COMMENT_KEY) || {};
  const custom = stored[postId] || [];
  const defaults = DEFAULT_COMMENTS[postId] || [];
  return enrichComments(postId, [...custom, ...defaults]);
}

function addComment(postId, comment) {
  const stored = wx.getStorageSync(COMMENT_KEY) || {};
  const list = stored[postId] || [];
  stored[postId] = [comment, ...list];
  wx.setStorageSync(COMMENT_KEY, stored);
  return getComments(postId);
}

function getPostState(postId) {
  const all = wx.getStorageSync(STATE_KEY) || {};
  return all[postId] || { liked: false, collected: false };
}

function savePostState(postId, state) {
  const all = wx.getStorageSync(STATE_KEY) || {};
  all[postId] = state;
  wx.setStorageSync(STATE_KEY, all);
  return state;
}

function saveCommentLike(postId, commentId, liked) {
  const likeMap = wx.getStorageSync(COMMENT_LIKE_KEY) || {};
  likeMap[`${postId}_${commentId}`] = liked;
  wx.setStorageSync(COMMENT_LIKE_KEY, likeMap);
}

function createCommentId() {
  return `c_${Date.now()}`;
}

function getLikedPosts() {
  const { getPosts } = require("./posts.js");
  const all = wx.getStorageSync(STATE_KEY) || {};
  return getPosts().filter((post) => {
    const state = all[post.id] || all[String(post.id)];
    return state && state.liked;
  });
}

module.exports = {
  getComments,
  addComment,
  getPostState,
  savePostState,
  saveCommentLike,
  createCommentId,
  getLikedPosts
};
