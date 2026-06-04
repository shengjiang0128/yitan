const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yitan-app-secret-2026';

const APPID = 'wxca5778cc200b5a4a'; // 小程序的AppID
const APPSECRET = '11da840b807756f4c752f667b1e0655c';
// =====================================================

router.post('/login', async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({
      code: 400,
      message: '缺少code参数',
      data: null
    });
  }

  try {
    const wxRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: APPID,
        secret: APPSECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });

    const { openid, session_key } = wxRes.data;
    if (!openid) {
      return res.status(400).json({
        code: 400,
        message: '微信登录失败',
        data: null
      });
    }

    const token = jwt.sign({ openid }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      code: 200,
      message: 'ok',
      data: {
        token,
        openid,
        isNewUser: false
      }
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

module.exports = router;