# 一摊 · 前端交接包

微信小程序前端完整代码，可直接用微信开发者工具打开运行。

## 快速开始

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 克隆仓库后，导入项目（二选一）：
   - **推荐**：导入仓库根目录 `yitan`（已配置 `miniprogramRoot`）
   - 或直接导入本文件夹 `前端`
3. AppID：`wxca5778cc200b5a4a`（或使用测试号）
4. 编译运行即可，默认使用本地 Mock 数据，无需后端

## 目录结构

```
前端/
├── app.js / app.json / app.wxss    # 小程序入口
├── pages/                          # 全部页面
├── components/                     # 公共组件（tab-bar、deep-eat-float 等）
├── utils/                          # 工具与 Mock 数据
├── config/                         # api.js、cloud.js 配置
├── images/                         # 业务图片资源
├── fonts/                          # 自定义字体（文字帖手写体）
├── docs/                           # API 对接文档（给后端同学）
└── project.config.json             # 开发者工具项目配置
```

## 主要功能模块

| 模块 | 路径 | 说明 |
|------|------|------|
| 登录 | `pages/login/` | 登录页 |
| 首页 | `pages/index/` | 分类、附近小摊 |
| 摊位 | `pages/stall/`、`pages/category/`、`pages/nearby/` | 摊位列表与详情 |
| 帖子 | `pages/post-*`、`pages/post-detail/` | 发帖、帖子详情 |
| 社区 | `pages/community/` | 双列瀑布流刷帖（Tab 入口） |
| 消息 | `pages/notify/` | 通知与私聊（社区左上角信封进入） |
| 个人 | `pages/profile/` | 个人页、喜欢、收藏 |
| 摊主 | `pages/open-stall/`、`pages/my-stall/` | 开张、我的一摊 |
| AI | `pages/ai/` | AI 助手 |

## 本地数据与存储

无后端时，以下数据保存在 `wx.storage`：

| Key | 用途 |
|-----|------|
| `yitan_posts` | 帖子列表 |
| `yitan_post_state` | 帖子点赞/收藏状态 |
| `yitan_post_comments` | 评论 |
| `yitan_stall_favorites` | 摊位收藏 |
| `yitan_stalls` | 我的摊位 |
| 用户信息 | 见 `utils/profile.js` |

## 后端联调

1. 阅读 `docs/API-对接清单.md`
2. 修改 `config/api.js`：

```javascript
module.exports = {
  baseUrl: "https://your-api.example.com",
  enabled: true
};
```

3. 按文档逐步实现接口，前端会优先请求 API，失败时回退本地 Mock

## 注意事项

- `project.private.config.json` 为本地私有配置，不在仓库内，导入后会自动生成
- **调试基础库请选稳定版（如 3.5.8）**，勿用灰度版 3.16.0，否则可能出现渲染层报错
- 若仍报错：工具 → 清缓存 → 全部清除，然后重新编译
- 图片资源在 `images/`，字体在 `fonts/zcool-kuaile.woff2`

## 技术栈

- 微信小程序原生（WXML + WXSS + JS）
- 自定义 TabBar 组件
- 本地 Mock + 可选 REST API
