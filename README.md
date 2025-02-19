# Chinese Name Generator | 趣味中文名生成器

基于 AI 的中文名生成器，能够根据英文名智能生成具有文化内涵的中文名。

## 功能特点

- 🎯 智能英译中：将英文名转换为富有文化内涵的中文名
- 📝 文化解释：提供每个中文名的文化背景和寓意
- 🌐 双语展示：同时提供中英文解释
- ⚡ 实时反馈：生成过程动画展示
- 📱 响应式设计：完美支持各种设备

## 快速开始

1. 克隆项目
```bash
git clone <repository-url>
cd chineseNameGenerator
```

2. 安装依赖
```bash
npm install
```
3. 配置环境变量
- 复制 .env.example 为 .env
- 填入你的 API KEY

4. 启动服务器
```bash
node server.js
```

5. 访问应用
- 打开浏览器访问 http://localhost:3000

## 使用方法
1. 在输入框中输入英文名
2. 点击"生成中文名"按钮
3. 等待系统生成（约3-5秒）
4. 查看生成的中文名及其含义解释

## 技术栈
- 前端 ：
  - 原生 JavaScript
  - HTML5
  - CSS3 (响应式设计)
- 后端 ：
  - Node.js
  - Express.js
- AI 模型 ：
  - deepseek-r1-250120

## 项目结构
chineseNameGenerator/
├── config/
│   ├── api.js         # API 配置
│   └── prompts.js     # AI 提示词配置
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── index.html     # 主页面
├── services/
│   └── aiService.js   # AI 服务
├── .env.example       # 环境变量示例
├── .gitignore
├── server.js          # 服务器入口
└── README.md

## 开发计划
- 支持更多语言的名字转换
- 添加名字生成历史记录
- 支持批量生成功能
- 增加更多文化元素选项
- 添加名字收藏功能

## 注意事项
- 确保 Node.js 版本 >= 14.0.0
- 需要稳定的网络连接
- API KEY 请勿提交到代码仓库
- 建议使用现代浏览器访问
## 贡献指南
1. Fork 本仓库
2. 创建特性分支 ( git checkout -b feature/AmazingFeature )
3. 提交改动 ( git commit -m 'Add some AmazingFeature' )
4. 推送到分支 ( git push origin feature/AmazingFeature )
5. 提交 Pull Request
## 许可证
MIT License

## 联系方式
如有问题或建议，欢迎提交 Issue 或 Pull Request。