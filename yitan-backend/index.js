const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middleware/logger');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// 全局中间件
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); // 任务4：全局日志

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/userInfo', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/myPosts', postsRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`✅ 后端服务已启动：http://localhost:${PORT}`);
});