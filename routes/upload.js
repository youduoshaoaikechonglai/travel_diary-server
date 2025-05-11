const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// 配置基础 URL
const BASE_URL = 'http://localhost:3001'; // 根据实际环境配置

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg'; // 提供默认扩展名
    // 根据文件类型设置不同前缀
    let prefix = 'image-';
    if (file.fieldname === 'avatar') {
      prefix = 'avatar-';
    } else if (file.fieldname === 'video') {
      prefix = 'video-';
    }
    cb(null, prefix + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'avatar') {
    // 头像只允许图片
    if (file.mimetype.startsWith('image/') || !file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error('头像只能上传图片文件！'));
    }
  } else if (file.fieldname === 'video') {
    // 视频文件验证
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('只能上传视频文件！'));
    }
  } else if (file.fieldname === 'images') {
    // 游记图片验证
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只能上传图片文件！'));
    }
  } else {
    cb(null, true); // 放宽限制，允许所有文件类型
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 限制文件大小为 50MB
  }
});

// 上传头像
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: '未上传文件' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${BASE_URL}${avatarUrl}`;

    // 如果提供了用户ID，更新用户头像
    if (req.body.userId) {
      await User.findByIdAndUpdate(req.body.userId, { avatarUrl: fullUrl });
    }

    res.json({ url: fullUrl });
  } catch (err) {
    res.status(500).json({ message: '上传头像失败', error: err.message });
  }
});

// 上传游记图片（支持多图）
router.post('/travel-images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: '未上传文件' });
    }
    const urls = req.files.map(file => `${BASE_URL}/uploads/${file.filename}`);
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ message: '上传图片失败', error: err });
  }
});

// 上传游记视频（单个）
router.post('/travel-video', upload.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '未上传文件' });
    }
    const url = `${BASE_URL}/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: '上传视频失败', error: err });
  }
});

// 错误处理中间件
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '文件大小超过限制（最大50MB）' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: '超过最大文件数限制' });
    }
  }
  res.status(400).json({ message: err.message });
});

module.exports = router;
