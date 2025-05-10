const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// 后台用户
// 读取后台用户配置
const getAdminUsers = () => {
  const filePath = path.join(__dirname, '../admin_users.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// 登录接口
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = getAdminUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: '账号或密码错误' });
  }
  // 根据用户名设置角色
  const role = user.username === 'admin' ? 'admin' : 'reviewer';
  res.json({ role: role });
});

module.exports = router;
