const { baseUrl, enabled } = require("../config/api.js");

const TOKEN_KEY = "yitan_token";

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || "";
}

function setToken(token) {
  if (token) {
    wx.setStorageSync(TOKEN_KEY, token);
  }
}

function clearToken() {
  wx.removeStorageSync(TOKEN_KEY);
}

function isApiOn() {
  return !!(enabled && String(baseUrl || "").trim());
}

function buildUrl(path) {
  const base = (baseUrl || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/**
 * 统一请求：自动拼接 baseUrl、附带 Bearer token
 * options.auth === false 时不带 token（用于登录）
 */
function request(options) {
  return new Promise((resolve, reject) => {
    if (!isApiOn()) {
      reject(new Error("API 未启用"));
      return;
    }

    const header = {
      "Content-Type": "application/json",
      ...(options.header || {})
    };

    if (options.auth !== false && getToken()) {
      header.Authorization = `Bearer ${getToken()}`;
    }

    wx.request({
      url: buildUrl(options.url),
      method: options.method || "GET",
      data: options.data,
      header,
      timeout: options.timeout || 60000,
      success(res) {
        if (res.statusCode === 401) {
          clearToken();
        }
        resolve(res);
      },
      fail(err) {
        console.warn("[api] 请求失败", buildUrl(options.url), err);
        reject(err);
      }
    });
  });
}

/** 微信 code 换后端 JWT（登录单独用较短超时，避免卡在授权页） */
function loginWithCode(code, timeoutMs) {
  return request({
    url: "/api/auth/login",
    method: "POST",
    data: { code },
    auth: false,
    timeout: timeoutMs || 12000
  }).then((res) => {
    const body = res.data || {};
    if (body.code === 200 && body.data && body.data.token) {
      setToken(body.data.token);
      return body.data;
    }
    const msg = body.message || "登录失败";
    return Promise.reject(new Error(msg));
  });
}

module.exports = {
  getToken,
  setToken,
  clearToken,
  isApiOn,
  request,
  loginWithCode,
  buildUrl
};
