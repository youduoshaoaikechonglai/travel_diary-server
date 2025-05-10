const mongoose = require('mongoose');

// 连接MongoDB数据库
const MONGO_URL = 'mongodb://localhost:27017/xiecheng';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB连接错误:'));
db.once('open', () => {
  console.log('MongoDB连接成功');
});

module.exports = db; 
