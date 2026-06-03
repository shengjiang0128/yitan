# 一摊小程序 API 对接清单

> 基于当前前端代码整理（`c:\Users\郑冰利\Desktop\yitan`）  
> 适用对象：后端开发同学  
> 小程序 AppID：`wxca5778cc200b5a4a`  
> 前端联调配置：`config/api.js`

---

## 1. 总体说明

### 1.1 当前前端状态

- 大部分功能使用 **本地 Mock + wx.storage**，无后端也能演示
- 已预留 HTTP 接口 2 个（默认关闭）
- 登录可选 **微信云函数**（`cloudfunctions/login`）或 **自建 REST 登录**

### 1.2 统一响应格式（建议）

前端已按此格式编写，请后端保持一致：

```json
{
  "code": 200,
  "message": "ok",
  "data": {}
}
```

| code | 含义 |
|------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未登录 / token 无效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

### 1.3 鉴权（需团队选定方案）

**方案 A：自建 REST（推荐前后端分离）**

1. 前端 `wx.login()` 拿到 `code`
2. `POST /api/auth/login` 传 `{ code }`
3. 后端用 code 换 `openid`，返回 `token`
4. 后续请求 Header：`Authorization: Bearer <token>`

**方案 B：微信云开发**

- 使用云函数 `login` 返回 `openid`（代码已有）
- 云数据库 / 云存储由云开发侧实现，不走 REST

> 下文接口按 **方案 A（REST）** 描述；若走云开发，可只实现 P0 中标注「必须 REST」的部分。

### 1.4 图片 / 文件上传

前端发帖、开张、改头像等目前使用 **微信临时路径**，上线前需：

1. 前端先调 `POST /api/upload`（或 OSS 直传签名接口）拿到 **HTTPS URL**
2. 业务接口只存 URL，不存本地路径

建议上传响应：

```json
{
  "code": 200,
  "data": {
    "url": "https://cdn.example.com/xxx.jpg"
  }
}
```

### 1.5 前端联调开关

```js
// config/api.js
module.exports = {
  baseUrl: "https://api-test.example.com",
  enabled: true
};
```

---

## 2. 优先级总览

| 优先级 | 模块 | 说明 |
|--------|------|------|
| **P0** | 登录鉴权、用户信息、帖子 CRUD、我的帖子列表 | 核心闭环，必须先做 |
| **P1** | 摊位认领、我的摊位、分类列表、首页附近、榜单 | 主业务 |
| **P2** | 消息通知、私信、搜索、AI 助手、评价 | 可二期 |

---

## 3. P0 接口

### 3.1 登录

**`POST /api/auth/login`**

请求：

```json
{
  "code": "wx_login_code_from_frontend"
}
```

响应：

```json
{
  "code": 200,
  "data": {
    "token": "jwt_or_session_token",
    "openid": "oXXXX",
    "isNewUser": false
  }
}
```

前端入口：`pages/login/login.js`

---

### 3.2 获取当前用户信息

**`GET /api/userInfo`** ✅ 前端已预留

Header：需 token

响应 `data` 字段（对齐 `utils/profile.js`）：

```json
{
  "nickname": "脑摊A65235",
  "stallId": "555555",
  "bio": "哈哈哈哈哈我爱吃",
  "avatar": "https://cdn.example.com/avatar.png",
  "followCount": 250,
  "fansCount": 20
}
```

前端入口：`pages/profile/profile.js` → `fetchUserInfo`

---

### 3.3 更新用户信息

**`PUT /api/userInfo`**

请求（部分更新）：

```json
{
  "nickname": "新昵称",
  "bio": "新简介",
  "avatar": "https://cdn.example.com/new-avatar.png"
}
```

响应：同 3.2 完整用户信息

前端入口：`pages/profile-edit/`、`pages/profile-edit-field/`

---

### 3.4 我的帖子列表

**`GET /api/myPosts`**

Query：`page=1&pageSize=20`

响应：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "postType": "image",
        "title": "广外南门炒粉也太好吃了",
        "content": "蛋炒河粉加辣加蛋",
        "img": "https://cdn.example.com/cover.jpg",
        "images": ["https://cdn.example.com/1.jpg"],
        "tags": ["炒粉", "广外南门"],
        "location": "广外南门",
        "shop": "大众炒粉",
        "type": "food",
        "likeCount": 128,
        "createdAt": "2026-06-01T10:00:00.000Z"
      },
      {
        "id": 2,
        "postType": "text",
        "title": "今晚吃什么呢",
        "content": "求推荐炸物摊",
        "img": "",
        "images": [],
        "tags": [],
        "likeCount": 24,
        "createdAt": "2026-06-01T09:00:00.000Z"
      }
    ],
    "total": 2
  }
}
```

字段说明：

| 字段 | 类型 | 说明 |
|------|------|------|
| postType | string | `image` / `text` |
| img | string | 封面图（列表展示用，取 images[0]） |
| type | string | `food` / `stall`（内容分类，可选） |

前端入口：`pages/profile/profile.js`（当前读本地 `utils/posts.js`）

---

### 3.5 发布帖子（纯文字）

**`POST /api/posts`**

请求：

```json
{
  "postType": "text",
  "title": "今晚吃什么呢",
  "content": "求推荐广外附近炸物摊",
  "tags": [],
  "location": "",
  "shop": ""
}
```

响应：

```json
{
  "code": 200,
  "data": {
    "id": 1717234567890,
    "likeCount": 0,
    "createdAt": "2026-06-01T12:00:00.000Z"
  }
}
```

前端入口：`pages/post-text/post-text.js`

---

### 3.6 发布帖子（图文）

**`POST /api/posts`**

请求：

```json
{
  "postType": "image",
  "title": "贝岗泰奶冰沙打卡",
  "content": "少冰半糖刚刚好",
  "images": [
    "https://cdn.example.com/a.jpg",
    "https://cdn.example.com/b.jpg"
  ],
  "tags": ["奶茶", "贝岗"],
  "location": "贝岗小吃街",
  "shop": "泰奶冰沙"
}
```

响应：同 3.5

前端入口：`pages/post-image/post-image.js`

---

### 3.7 帖子详情（可选 P0）

**`GET /api/posts/:id`**

响应：单条帖子完整对象 + 作者信息：

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "postType": "image",
    "title": "...",
    "content": "...",
    "images": [],
    "likeCount": 128,
    "author": {
      "nickname": "脑摊A65235",
      "avatar": "https://..."
    },
    "createdAt": "..."
  }
}
```

前端入口：`pages/profile/profile.js` → `goToPostDetail`（目标页待完善）

---

## 4. P1 接口

### 4.1 榜单列表

**`GET /api/getRankList`** ✅ 前端已预留

响应：

```json
{
  "code": 200,
  "data": {
    "rankList": [
      {
        "id": 1,
        "rank": 1,
        "name": "第一名摊位",
        "type": "stall",
        "detailId": 101
      }
    ],
    "secondList": [
      {
        "id": 4,
        "rank": "",
        "name": "其他推荐摊位",
        "type": "stall",
        "detailId": 104
      }
    ]
  }
}
```

前端入口：`pages/rank/rank.js`

---

### 4.2 分类摊位列表

**`GET /api/stalls/byCategory`**

Query：

| 参数 | 说明 |
|------|------|
| categoryId | `fruit` / `staple` / `steam` / `dessert` / `drink` / `grill` / `fry` / `other` |
| keyword | 可选，搜索关键词（`id=search` 时） |
| lat, lng | 可选，用于 distance 计算 |

响应：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "name": "大众炒粉",
        "img": "https://cdn.example.com/stall.jpg",
        "distance": 200,
        "avgPrice": 10,
        "productPrice": 9,
        "productName": "蛋炒河粉"
      }
    ]
  }
}
```

前端 Mock：`utils/category-data.js`  
前端入口：`pages/category/category.js`

首页分类 id 对照：

| categoryId | 中文 |
|------------|------|
| fruit | 水果 |
| staple | 主食 |
| steam | 蒸煮 |
| dessert | 甜品 |
| drink | 饮料 |
| grill | 煎烤 |
| fry | 油炸 |
| other | 其他 |

---

### 4.3 首页附近小摊

**`GET /api/stalls/nearby`**

Query：`lat` / `lng` / `page` / `pageSize`

响应：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": "1",
        "name": "大众炒粉",
        "distance": "500m",
        "image": "https://cdn.example.com/stall.jpg",
        "style": "menu",
        "menuTitle": "大众炒粉",
        "menuLines": ["炒河粉", "米粉"],
        "phone": "13533375596"
      }
    ]
  }
}
```

前端 Mock：`pages/index/index.js` → `stalls`  
前端入口：`pages/index/index.js`、`pages/nearby/nearby.js`

---

### 4.4 摊位详情

**`GET /api/stalls/:id`**

响应：

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "土豆泥拌粉",
    "rating": 5,
    "health": "优秀",
    "banner": "https://cdn.example.com/banner.jpg",
    "logo": "https://cdn.example.com/logo.jpg",
    "likeCount": 2200,
    "address": "广外南门附近",
    "latitude": 23.123456,
    "longitude": 113.123456,
    "phone": "13800138000",
    "mapImage": "https://cdn.example.com/map.jpg",
    "mapMarker": { "x": 62.5, "y": 48.0 }
  }
}
```

`mapMarker` 为古法地图标注点，百分比坐标（0–100）

前端入口：`pages/stall/stall.js`、`pages/map/map.js`

---

### 4.5 开张一摊（摊位认领）

**`POST /api/stalls/claim`**

请求（对齐 `pages/open-stall/open-stall.js`）：

```json
{
  "name": "阿强炒粉",
  "category": "炒粉面食",
  "address": "广外南门",
  "addressDetail": "南门左侧第三档",
  "mapImage": "https://cdn.example.com/map.jpg",
  "mapMarker": { "x": 55.2, "y": 41.8 },
  "stallPhotos": [
    "https://cdn.example.com/photo1.jpg"
  ],
  "menuImages": [
    "https://cdn.example.com/menu1.jpg"
  ],
  "owner": {
    "name": "张三",
    "idCard": "440XXXXXXXXXXXXXXX",
    "phone": "13800138000"
  }
}
```

响应：

```json
{
  "code": 200,
  "data": {
    "id": 1717234567890,
    "stallId": "100006",
    "status": "审核中",
    "createdAt": "2026-06-01T12:00:00.000Z"
  }
}
```

摊位分类枚举（`utils/stall-categories.js`）：

`炒粉面食` `烧烤炸物` `奶茶甜品` `关东煮` `水果生鲜` `卤味小吃` `其他`

摊位状态：`审核中` / `营业中` / `已下线`

---

### 4.6 我的摊位列表

**`GET /api/stalls/mine`**

响应：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "大众炒粉",
        "stallId": "555555",
        "status": "营业中",
        "category": "炒粉面食",
        "address": "广外南门 · 南门左侧",
        "coverImage": "https://cdn.example.com/cover.jpg"
      }
    ]
  }
}
```

前端 Mock：`utils/stalls.js`  
前端入口：`pages/my-stall/my-stall.js`

---

### 4.7 删除我的摊位

**`DELETE /api/stalls/:id`**

响应：

```json
{
  "code": 200,
  "message": "已删除"
}
```

前端入口：`pages/my-stall/my-stall.js` → `onDeleteStall`

---

## 5. P2 接口（二期）

### 5.1 搜索

**`GET /api/search`**

Query：`keyword=炒粉&type=stall|post`

前端入口：`pages/search/search.js` → 跳转分类页带 keyword

---

### 5.2 消息通知

**`GET /api/notifications`**

Query：`type=like|follow|comment`

响应单条：

```json
{
  "id": "l1",
  "avatar": "https://...",
  "username": "阿强",
  "content": "赞了你的帖子「广外南门炒粉测评」",
  "time": "昨天 18:20"
}
```

前端 Mock：`utils/notify-data.js` → `CATEGORY_ITEMS`  
前端入口：`pages/notify-category/notify-category.js`

---

### 5.3 私信会话列表

**`GET /api/chats`**

响应：

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "id": 1,
        "avatar": "https://...",
        "username": "黄苑舒",
        "preview": "[帖子] 这家饭太好吃了",
        "time": "10:50"
      }
    ]
  }
}
```

前端 Mock：`utils/notify-data.js` → `MESSAGE_LIST`

---

### 5.4 私信消息记录

**`GET /api/chats/:chatId/messages`**

**`POST /api/chats/:chatId/messages`**

发送请求：

```json
{
  "text": "明天还去那家炒粉吗？"
}
```

消息结构：

```json
{
  "id": 1717234567890,
  "fromMe": true,
  "text": "消息内容",
  "createdAt": "2026-06-01T12:00:00.000Z"
}
```

前端 Mock：`utils/chat-messages.js`  
前端入口：`pages/notify-chat/notify-chat.js`

---

### 5.5 AI 助手

**`POST /api/ai/chat`**

请求：

```json
{
  "message": "想吃点甜品",
  "keyword": "甜品"
}
```

响应：

```json
{
  "code": 200,
  "data": {
    "reply": "老大，附近有几家口碑不错的甜品摊..."
  }
}
```

前端当前为 Mock：`pages/ai/ai.js`（关键词：甜品、炸物、烧烤、主食）

---

### 5.6 摊位评价

**`GET /api/stalls/:id/reviews`**

**`POST /api/stalls/:id/reviews`**

前端入口：`pages/stall/stall.js` → `goWriteReview`

---

## 6. 页面 ↔ 接口对照表

| 页面 | 路径 | 需要的接口 | 优先级 |
|------|------|-----------|--------|
| 登录 | pages/login | POST /api/auth/login | P0 |
| 个人主页 | pages/profile | GET /api/userInfo, GET /api/myPosts | P0 |
| 编辑资料 | pages/profile-edit | PUT /api/userInfo, POST /api/upload | P0 |
| 发文字帖 | pages/post-text | POST /api/posts | P0 |
| 发图文帖 | pages/post-image | POST /api/upload, POST /api/posts | P0 |
| 榜单 | pages/rank | GET /api/getRankList | P1 |
| 分类 | pages/category | GET /api/stalls/byCategory | P1 |
| 首页 | pages/index | GET /api/stalls/nearby | P1 |
| 摊位详情 | pages/stall | GET /api/stalls/:id | P1 |
| 古法地图 | pages/map | GET /api/stalls/:id（map 字段） | P1 |
| 开张一摊 | pages/open-stall | POST /api/upload, POST /api/stalls/claim | P1 |
| 我的一摊 | pages/my-stall | GET /api/stalls/mine, DELETE /api/stalls/:id | P1 |
| 消息 | pages/notify | GET /api/notifications, GET /api/chats | P2 |
| 私信 | pages/notify-chat | GET/POST /api/chats/:id/messages | P2 |
| AI 助手 | pages/ai | POST /api/ai/chat | P2 |
| 搜索 | pages/search | GET /api/search | P2 |

---

## 7. 后端开工 Checklist

前端需配合提供：

- [ ] 确认鉴权方案（REST token / 云开发）
- [ ] 测试环境 `baseUrl`（HTTPS，已加入微信合法域名）
- [ ] 对象存储 / 上传方案
- [ ] P0 接口 Swagger 或 Postman 集合（可选但强烈建议）

后端需交付：

- [ ] P0 全部接口 + 测试账号
- [ ] 统一错误码说明
- [ ] 微信 `code2Session` 配置（AppID + AppSecret）
- [ ] 图片 CDN 域名（需 HTTPS）

前端联调步骤：

1. 填写 `config/api.js` 的 `baseUrl` 和 `enabled: true`
2. 逐个把 `utils/*.js` 中的本地存储改为 `wx.request`
3. 微信开发者工具 → 详情 → 本地设置 → 开发阶段可勾选「不校验合法域名」；真机前必须配置合法域名

---

## 8. 附录：前端本地 Mock 文件索引

| 文件 | 模拟内容 |
|------|----------|
| utils/profile.js | 用户资料 |
| utils/posts.js | 帖子列表 |
| utils/stalls.js | 我的摊位 |
| utils/category-data.js | 分类摊位 |
| utils/notify-data.js | 通知 + 私信列表 |
| utils/chat-messages.js | 私信聊天记录 |
| utils/stall-categories.js | 摊位分类枚举 |
| config/api.js | 后端地址开关 |

---

**文档版本**：v1.0（2026-06-01）  
**维护**：前端同学随接口变更同步更新
