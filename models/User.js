const mongoose = require('mongoose');

// 用户模型
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // 用户名，唯一
  password: { type: String, required: true },               // 密码
  nickname: { type: String, required: true, unique: true }, // 昵称，唯一
  avatarUrl: { type: String },                              // 头像URL
  createdAt: { type: Date, default: Date.now }              // 创建时间
});

module.exports = mongoose.model('User', UserSchema); 
