const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析json请求体

app.get('/', (req, res) => {
  res.send('旅游日记平台后端API');
});

// 启动服务
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
