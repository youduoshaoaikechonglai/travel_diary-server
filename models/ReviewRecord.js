const mongoose = require('mongoose');

// 审核记录模型
const ReviewRecordSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelNote', required: true }, // 游记ID
  action: { type: String, enum: ['approved', 'rejected', 'deleted'], required: true }, // 审核动作
  reason: { type: String },                                                            // 拒绝/删除原因
  createdAt: { type: Date, default: Date.now }                                         // 审核时间
});

module.exports = mongoose.model('ReviewRecord', ReviewRecordSchema); 
