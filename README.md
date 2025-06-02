# 💕 FSKY 浪漫小窝 - 情侣专属网站

一个专为情侣打造的浪漫网站，记录你们的美好时光，珍藏每一个甜蜜瞬间。

![Love](https://img.shields.io/badge/Made%20with-💕-red.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-blue.svg)

## ✨ 项目特色

### 🎨 浪漫的用户界面
- 💖 **心形花朵动画**：基于数学算法的实时心形花朵绽放效果
- 🌸 **粉色主题设计**：温馨浪漫的视觉体验
- 📱 **响应式布局**：完美适配各种设备尺寸
- 🎭 **优雅过渡动画**：流畅的页面切换和交互效果

### 📅 纪念日管理系统
- ⏰ **实时恋爱计时器**：精确显示在一起的时间（天/周/月/年）
- 📝 **智能纪念日提醒**：自动计算距离重要日子的天数
- 🔝 **置顶功能**：重要纪念日可以置顶显示
- 🔍 **搜索与分页**：轻松管理大量纪念日记录
- 🎨 **视觉差异化**：过去和未来的日期用不同颜色标识

### 👥 情侣互动功能
- 💑 **伴侣绑定系统**：安全的用户关联机制
- 🔄 **数据同步共享**：情侣间的记录实时同步
- 🎯 **个性化设置**：自定义情侣名称和纪念日期
- 💝 **多维度记录**：日记、照片、音乐、心情全方位记录

## 🛠️ 技术栈

### 前端框架与库
- **React 18.2.0** - 现代化的UI框架
- **Redux Toolkit** - 状态管理解决方案
- **React Router v6** - 前端路由管理
- **Ant Design 5.x** - 企业级UI组件库

### 开发工具与配置
- **Create React App** - 零配置React开发环境
- **Axios** - HTTP请求库
- **Day.js** - 现代化日期处理库
- **CSS3 & HTML5** - 现代化样式和标记

### 动画与视觉效果
- **Canvas API** - 心形花朵动画渲染
- **CSS3 Animations** - 页面过渡和交互动画
- **数学算法** - 贝塞尔曲线绘制花瓣效果

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0 或 yarn >= 1.22.0

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-username/fsky_front.git
cd fsky_front
```

2. **安装依赖**
```bash
npm install
# 或者使用 yarn
yarn install
```

3. **启动开发服务器**
```bash
npm start
# 或者使用 yarn
yarn start
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 生产构建
```bash
npm run build
# 或者使用 yarn
yarn build
```

## 📁 项目结构

```
fsky_front/
├── public/                    # 公共资源文件
├── src/
│   ├── api/                   # API请求封装
│   │   ├── axios.js          # Axios配置
│   │   ├── auth.js           # 认证相关API
│   │   ├── anniversary.js    # 纪念日API
│   │   └── loveSettings.js   # 恋爱设置API
│   ├── components/           # 公共组件
│   │   ├── AuthInitializer.js # 认证初始化
│   │   └── PrivateRoute.js   # 路由守卫
│   ├── layouts/              # 布局组件
│   │   └── MainLayout.js     # 主布局
│   ├── pages/                # 页面组件
│   │   ├── anniversary/      # 纪念日页面
│   │   ├── auth/            # 认证页面
│   │   ├── dashboard/       # 仪表盘
│   │   ├── diary/           # 日记功能
│   │   ├── photo/           # 照片墙
│   │   ├── music/           # 音乐收藏
│   │   ├── mood/            # 心情记录
│   │   ├── profile/         # 个人资料
│   │   └── partner/         # 伴侣绑定
│   ├── redux/               # 状态管理
│   │   ├── slices/          # Redux切片
│   │   └── store.js         # Store配置
│   ├── styles/              # 样式文件
│   ├── App.js               # 根组件
│   └── index.js             # 入口文件
├── package.json             # 项目配置
└── README.md               # 项目说明
```

## 🎯 核心功能

### 1. 认证系统
- ✅ 用户注册/登录
- ✅ 密码加密存储
- ✅ JWT令牌认证
- ✅ 自动登录状态保持
- ✅ 安全登出机制

### 2. 纪念日管理
- ✅ 实时恋爱计时器
- ✅ 纪念日CRUD操作
- ✅ 智能日期计算
- ✅ 置顶/搜索/分页
- ✅ 视觉状态区分

### 3. 心形动画
- ✅ 数学公式驱动的心形轮廓
- ✅ 随机生成的彩色花朵
- ✅ 60fps流畅动画渲染
- ✅ 碰撞检测算法
- ✅ 贝塞尔曲线花瓣绘制

### 4. 用户体验
- ✅ 响应式设计
- ✅ 优雅的加载状态
- ✅ 友好的错误提示
- ✅ 直观的交互反馈

## 🌟 特色亮点

### 💖 浪漫心形动画
采用数学算法绘制完美心形，使用Canvas实现60fps流畅动画：

```javascript
// 心形数学公式
function getHeartPoint(angle) {
  const x = 19.5 * (16 * Math.pow(Math.sin(angle), 3));
  const y = -20 * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) 
                  - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
  return [offsetX + x, offsetY + y];
}
```

### ⏰ 智能时间计算
支持多种时间显示格式，实时更新：
- 📅 **天模式**：450天 12:34:56
- 📊 **周模式**：64周2天 12:34:56  
- 📅 **月模式**：14个月24天 12:34:56
- 📅 **年模式**：1年2个月24天 12:34:56

### 🔄 Redux状态管理
使用Redux Toolkit实现高效的全局状态管理：
- 认证状态统一管理
- 恋爱设置全局共享
- 实时数据同步
- 组件间解耦

## 🤝 贡献指南

我们欢迎任何形式的贡献！

1. Fork 本项目
2. 创建新的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v1.0.0 (2024-12-14)
- ✨ 完整的纪念日管理系统
- 💖 心形花朵动画效果
- 🔐 用户认证与授权
- 📱 响应式设计支持
- 🔍 搜索与分页功能
- 📌 置顶功能实现

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 💝 致谢

- 感谢所有为这个项目贡献代码的开发者
- 特别感谢React和Ant Design社区的支持
- 献给所有在爱情中的情侣们 💕

---

**用爱创造，为爱而生** ❤️

如果这个项目对您有帮助，请给我们一个⭐️！
