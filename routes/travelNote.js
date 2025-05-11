const express = require('express');
const router = express.Router();
const TravelNote = require('../models/TravelNote');

// 获取所有已审核通过的游记（首页列表）
router.get('/', async (req, res) => {
  try {
    const notes = await TravelNote.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: '获取游记失败', error: err });
  }
});

// 获取某用户的所有游记（我的游记）
router.get('/my/:userId', async (req, res) => {
  try {
    const notes = await TravelNote.find({ authorId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: '获取我的游记失败', error: err });
  }
});

// 新增游记
router.post('/', async (req, res) => {
  try {
    const note = new TravelNote(req.body);
    await note.save();
    res.json({ message: '游记发布成功，等待审核' });
  } catch (err) {
    res.status(500).json({ message: '发布游记失败', error: err });
  }
});

// 编辑游记（仅未通过和待审核状态可编辑）
router.put('/:id', async (req, res) => {
  try {
    const note = await TravelNote.findById(req.params.id);
    if (!note) return res.status(404).json({ message: '游记不存在' });
    if (note.status === 'approved') return res.status(403).json({ message: '已通过审核的游记不可编辑' });

    // 合并更新的字段，并将状态重置为"待审核"，同时删除拒绝原因
    Object.assign(note, req.body, {
      updatedAt: new Date(),
      status: 'pending',
      rejectReason: undefined
    });
    
    await note.save();
    res.json({ message: '游记更新成功，等待审核' });
  } catch (err) {
    res.status(500).json({ message: '编辑游记失败', error: err });
  }
});

// 删除游记
router.delete('/:id', async (req, res) => {
  try {
    await TravelNote.findByIdAndDelete(req.params.id);
    res.json({ message: '游记删除成功' });
  } catch (err) {
    res.status(500).json({ message: '删除游记失败', error: err });
  }
});

// 获取游记详情
router.get('/:id', async (req, res) => {
  try {
    const note = await TravelNote.findById(req.params.id);
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: '获取游记详情失败', error: err });
  }
});

module.exports = router; 
