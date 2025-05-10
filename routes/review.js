const express = require('express');
const router = express.Router();
const TravelNote = require('../models/TravelNote');
const ReviewRecord = require('../models/ReviewRecord');

// 获取所有待审核、已通过、未通过的游记（审核列表）
router.get('/notes', async (req, res) => {
  try {
    const notes = await TravelNote.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: '获取审核列表失败', error: err });
  }
});

// 审核操作（通过/拒绝）（审核员/管理员）
router.post('/action', async (req, res) => {
  const { noteId, action, reason } = req.body;
  if (!['approved', 'rejected'].includes(action)) {
    return res.status(400).json({ message: '无效的审核操作' });
  }
  try {
    const note = await TravelNote.findById(noteId);
    if (!note) return res.status(404).json({ message: '游记不存在' });
    note.status = action;
    note.rejectReason = action === 'rejected' ? reason : undefined;
    await note.save();
    // 记录审核操作
    await ReviewRecord.create({ noteId, action, reason });
    res.json({ message: '审核操作成功' });
  } catch (err) {
    res.status(500).json({ message: '审核操作失败', error: err });
  }
});

// 删除游记（管理员）
router.delete('/note/:id', async (req, res) => {
  try {
    await TravelNote.findByIdAndDelete(req.params.id);
    // 记录删除操作
    await ReviewRecord.create({ noteId: req.params.id, action: 'deleted', reason: req.body.reason });
    res.json({ message: '游记已删除' });
  } catch (err) {
    res.status(500).json({ message: '删除游记失败', error: err });
  }
});

// 获取审核记录
router.get('/records/:noteId', async (req, res) => {
  try {
    const records = await ReviewRecord.find({ noteId: req.params.noteId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: '获取审核记录失败', error: err });
  }
});

module.exports = router; 
