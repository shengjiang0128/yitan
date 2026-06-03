const { getPostById } = require("../../utils/posts.js");
const { getProfile } = require("../../utils/profile.js");
const {
  getComments,
  addComment,
  getPostState,
  savePostState,
  saveCommentLike,
  createCommentId
} = require("../../utils/post-comments.js");

Page({
  data: {
    statusBarHeight: 20,
    post: null,
    author: {},
    images: [],
    comments: [],
    commentInput: "",
    liked: false,
    collected: false,
    likeCount: 0,
    collectCount: 0,
    commentCount: 0,
    postLikeBase: 0,
    handFontReady: false
  },

  onLoad(options) {
    const sys = wx.getWindowInfo();
    const profile = getProfile();
    const post = getPostById(options.id);

    this.loadHandFont();

    if (!post) {
      wx.showToast({ title: "帖子不存在", icon: "none" });
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }

    const images =
      post.images && post.images.length
        ? post.images
        : post.img
          ? [post.img]
          : [];
    const state = getPostState(post.id);
    const comments = getComments(post.id);
    const postLikeBase = post.likeCount || 0;

    this.setData({
      statusBarHeight: sys.statusBarHeight,
      post,
      author: profile,
      images,
      comments,
      liked: state.liked,
      collected: state.collected,
      postLikeBase,
      likeCount: postLikeBase + (state.liked ? 1 : 0),
      collectCount: post.collectCount || 0,
      commentCount: comments.length
    });
  },

  onShareAppMessage() {
    const { post } = this.data;
    return {
      title: (post && post.title) || "一摊帖子",
      path: `/pages/post-detail/post-detail?id=${post.id}`
    };
  },

  loadHandFont() {
    wx.loadFontFace({
      family: "YitanHand",
      source: 'url("/fonts/zcool-kuaile.woff2")',
      success: () => {
        this.setData({ handFontReady: true });
      }
    });
  },

  goBack() {
    wx.navigateBack();
  },

  onLike() {
    const liked = !this.data.liked;
    const likeCount = this.data.postLikeBase + (liked ? 1 : 0);
    savePostState(this.data.post.id, {
      liked,
      collected: this.data.collected
    });
    this.setData({ liked, likeCount });
  },

  onCollect() {
    const collected = !this.data.collected;
    const collectCount = this.data.collectCount + (collected ? 1 : -1);
    savePostState(this.data.post.id, {
      liked: this.data.liked,
      collected
    });
    this.setData({ collected, collectCount: Math.max(0, collectCount) });
    wx.showToast({
      title: collected ? "已收藏" : "已取消收藏",
      icon: "none"
    });
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });
    wx.showToast({ title: "点击右上角转发", icon: "none" });
  },

  onCommentInput(e) {
    this.setData({ commentInput: e.detail.value });
  },

  onSendComment() {
    const text = (this.data.commentInput || "").trim();
    if (!text) return;

    const profile = getProfile();
    const comment = {
      id: createCommentId(),
      avatar: profile.avatar,
      username: profile.nickname,
      content: text,
      time: "刚刚",
      likeCount: 0
    };

    addComment(this.data.post.id, comment);
    const nextComments = getComments(this.data.post.id);
    this.setData({
      comments: nextComments,
      commentInput: "",
      commentCount: nextComments.length
    });
  },

  onCommentLike(e) {
    const { id, index } = e.currentTarget.dataset;
    const comments = [...this.data.comments];
    const item = comments[index];
    if (!item || String(item.id) !== String(id)) return;

    const liked = !item.liked;
    const baseCount = (item.likeCount || 0) - (item.liked ? 1 : 0);
    const likeCount = baseCount + (liked ? 1 : 0);

    comments[index] = { ...item, liked, likeCount };
    saveCommentLike(this.data.post.id, id, liked);
    this.setData({ comments });
  }
});
