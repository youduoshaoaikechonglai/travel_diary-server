const mongoose = require('mongoose');

// 游记模型
const TravelNoteSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 作者ID
  nickname: { type: String, required: true },      // 昵称
  avatarUrl: { type: String },                     // 头像URL
  title: { type: String, required: true },         // 标题
  content: { type: String, required: true },       // 内容
  images: [{ type: String }],                      // 图片URL数组
  video: { type: String },                         // 视频URL
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // 审核状态
  rejectReason: { type: String },                  // 审核拒绝原因
  createdAt: { type: Date, default: Date.now },    // 创建时间
  updatedAt: { type: Date, default: Date.now }     // 更新时间
});

module.exports = mongoose.model('TravelNote', TravelNoteSchema); 
