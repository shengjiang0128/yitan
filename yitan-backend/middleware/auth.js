const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yitan-app-secret-2026'; // 比赛用临时密钥，不用改

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未登录，请先登录',
      data: null
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      code: 401,
      message: 'token无效或已过期',
      data: null
    });
  }
};