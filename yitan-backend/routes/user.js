const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const mockUser = require('../mock/user');

router.get('/', authMiddleware, (req, res) => {
  res.json({
    code: 200,
    message: 'ok',
    data: mockUser.defaultUser
  });
});

router.put('/', authMiddleware, (req, res) => {
  const updatedUser = { ...mockUser.defaultUser, ...req.body };
  res.json({
    code: 200,
    message: 'ok',
    data: updatedUser
  });
});

module.exports = router;