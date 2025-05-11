const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 客户端用户
// 用户注册
router.post('/register', async (req, res) => {
  const { username, password, nickname, avatarUrl } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码必填' });
  }

  try {
    const exist = await User.findOne({ username });
    if (exist) return res.status(409).json({ message: '用户名已存在' });
    const hash = await bcrypt.hash(password, 10);

    // 创建用户数据对象，确保所有必需字段都有值
    const userData = {
      username,
      password: hash
    };

    // 只有当nickname有值时才添加到userData
    if (nickname) {
      userData.nickname = nickname;
    }

    // 只有当avatarUrl有值时才添加到userData
    if (avatarUrl) {
      userData.avatarUrl = avatarUrl;
    }
    const user = new User(userData);
    await user.save();
    res.json({ message: '注册成功' });
  } catch (err) {
    res.status(500).json({ message: '注册失败', error: err });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: '用户名或密码错误' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: '用户名或密码错误' });
    // 简单返回用户信息（实际项目应返回token）
    res.json({
      id: user._id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      nickname: user.nickname
    });
  } catch (err) {
    res.status(500).json({ message: '登录失败', error: err });
  }
});

// 昵称唯一性校验
router.get('/check-nickname', async (req, res) => {
  const { nickname } = req.query;
  if (!nickname) return res.json({ exists: false });
  const exist = await User.findOne({ nickname });
  res.json({ exists: !!exist });
});

module.exports = router;
