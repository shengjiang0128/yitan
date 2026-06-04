const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const mockPosts = require('../mock/posts');

router.get('/', authMiddleware, (req, res) => {
  res.json({
    code: 200,
    message: 'ok',
    data: mockPosts.myPosts
  });
});

router.post('/', authMiddleware, (req, res) => {
  const newPostId = Date.now();
  res.json({
    code: 200,
    message: 'ok',
    data: {
      id: newPostId,
      likeCount: 0,
      createdAt: new Date().toISOString()
    }
  });
});

router.get('/:id', authMiddleware, (req, res) => {
  const post = mockPosts.myPosts.list[0];
  res.json({
    code: 200,
    message: 'ok',
    data: {
      ...post,
      author: {
        nickname: "脑摊A65235",
        avatar: "https://cdn.example.com/avatar.png"
      }
    }
  });
});

module.exports = router;