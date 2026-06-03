const STORAGE_PREFIX = "yitan_chat_";
const LIST_META_KEY = "yitan_chat_list_meta";

const MOCK_REPLIES = [
  "好呀，我也这么觉得",
  "哈哈哈行，到时候见",
  "收到，下次一起去",
  "可以，我记下了"
];

function formatTime(date) {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function getDefaultMessages(chatUser) {
  return [
    { id: 1, fromMe: false, text: chatUser.preview },
    { id: 2, fromMe: true, text: "收到，我也觉得不错" }
  ];
}

function getMessages(chatId, chatUser) {
  const stored = wx.getStorageSync(`${STORAGE_PREFIX}${chatId}`);
  if (Array.isArray(stored) && stored.length) {
    return stored;
  }
  return getDefaultMessages(chatUser);
}

function saveMessages(chatId, messages) {
  wx.setStorageSync(`${STORAGE_PREFIX}${chatId}`, messages);
  updateListPreview(chatId, messages);
}

function updateListPreview(chatId, messages) {
  const last = messages[messages.length - 1];
  if (!last) return;

  const meta = wx.getStorageSync(LIST_META_KEY) || {};
  meta[chatId] = {
    preview: last.fromMe ? `我：${last.text}` : last.text,
    time: formatTime(new Date())
  };
  wx.setStorageSync(LIST_META_KEY, meta);
}

function getListMeta(chatId) {
  const meta = wx.getStorageSync(LIST_META_KEY) || {};
  return meta[chatId] || null;
}

function createMessageId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function getMockReply() {
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}

module.exports = {
  getMessages,
  saveMessages,
  getListMeta,
  createMessageId,
  getMockReply
};
