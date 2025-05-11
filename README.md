# 旅游日记服务端

## 项目简介
本项目为旅游日记平台的后端服务，基于 Node.js + Express + MongoDB 实现，提供用户注册、登录、游记发布与审核、后台管理等功能。

## 主要功能
- 用户注册、登录、头像上传、昵称唯一性校验
- 游记的发布、编辑、删除、审核、查询
- 游记审核记录管理
- 后台管理员/审核员登录

## 技术栈
- Node.js
- Express
- MongoDB（Mongoose）
- Multer（文件上传）
- bcryptjs（密码加密）
- CORS（跨域支持）

## 目录结构
```
├── app.js                # 应用入口
├── db.js                 # 数据库连接
├── package.json          # 项目依赖
├── admin_users.json      # 后台用户配置
├── models/               # Mongoose 数据模型
│   ├── User.js           # 用户模型
│   ├── TravelNote.js     # 游记模型
│   └── ReviewRecord.js   # 审核记录模型
├── routes/               # 路由
│   ├── user.js           # 用户相关接口
│   ├── travelNote.js     # 游记相关接口
│   ├── review.js         # 审核相关接口
│   └── admin.js          # 后台管理接口
```

## 使用说明
1. 克隆项目：
   ```bash
   git clone git@github.com:youduoshaoaikechonglai/travel_diary-serve.git
    ```
2. 进入项目目录：
   ```bash
   cd travel_diary-serve
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 启动 MongoDB 数据库（本地默认端口27017，数据库名 xiecheng）
5. 启动服务：
   ```bash
   npm start
   ```
   服务默认运行在 http://localhost:3001

## API 说明
### 用户相关
- `POST /api/user/register` 用户注册
- `POST /api/user/login` 用户登录
- `GET /api/user/check-nickname` 昵称唯一性校验
- `POST /api/user/upload-avatar` 头像上传

### 游记相关
- `GET /api/note/` 获取所有已审核通过的游记
- `GET /api/note/my/:userId` 获取某用户的所有游记
- `POST /api/note/` 新增游记
- `PUT /api/note/:id` 编辑游记
- `DELETE /api/note/:id` 删除游记
- `GET /api/note/:id` 获取游记详情

### 审核与后台
- `GET /api/review/notes` 获取所有游记（审核列表）
- `POST /api/review/action` 审核操作（通过/拒绝）
- `DELETE /api/review/note/:id` 删除游记（管理员）
- `POST /api/admin/login` 后台用户登录

## 数据库配置
- 默认连接：`mongodb://localhost:27017/xiecheng`
- 可根据需要修改 `db.js` 中的连接字符串

## 环境变量
- 如需自定义端口、数据库等，可自行扩展 `.env` 文件（已在 `.gitignore` 忽略）

## 其他
- 后台用户配置在 `admin_users.json`，默认有 `admin` 和 `reviewer` 两个账号
