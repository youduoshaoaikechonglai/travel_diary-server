const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();

// 中间件
// 配置CORS，允许跨域请求
app.use(cors({
  origin: ['http://localhost:10086', 'http://10.163.206.25:10086', 'http://localhost:3000', 'http://192.168.245.1:10086'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // 允许发送凭证
}));

app.use(express.json()); // 解析json请求体

// 配置静态资源目录
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/api/user', require('./routes/user'));
app.use('/api/note', require('./routes/travelNote'));
app.use('/api/review', require('./routes/review'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));

app.get('/', (req, res) => {
  res.send('旅游日记平台后端API');
});

// 启动服务
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
