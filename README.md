# 🌐 Jade Chen - Online Resume | 在线简历

[![CI/CD](https://github.com/Jadejesse/Jade_resume/actions/workflows/deploy.yml/badge.svg)](https://github.com/Jadejesse/Jade_resume/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://jadejesse.github.io/Jade_resume/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, interactive online resume built with pure HTML, CSS, and JavaScript
> 
> 使用纯HTML、CSS和JavaScript构建的现代化交互式在线简历

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## 🌍 English Version

## 🚀 Live Demo

**Visit:** [https://jadejesse.github.io/Jade_resume/](https://jadejesse.github.io/Jade_resume/)

---

## 📋 About

This is a professional online resume website featuring:

- ✨ **Modern Design** - Clean, responsive layout with gradient backgrounds
- 🎨 **Smooth Animations** - Scroll-reveal effects and skill bar animations
- 📱 **Mobile Responsive** - Optimized for all devices
- 🚀 **Fast Loading** - Pure vanilla JavaScript, no heavy frameworks
- 🤖 **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

---

## 🛠️ Tech Stack

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript (ES6+)** - Interactive features

### CSS Features
- CSS Variables (Custom Properties)
- Flexbox & CSS Grid layouts
- CSS Animations & Keyframes
- Linear & Radial Gradients
- Media Queries (Responsive Design)
- SVG inline images

### JavaScript Features
- ES6+ syntax (Arrow functions, const/let)
- DOM API manipulation
- Event handling
- Scroll detection
- Intersection Observer pattern

### DevOps & Tools
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting
- **Git** - Version control
- **html2canvas** - Banner image generation

---

## 📁 Project Structure

```
Jade_resume/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline configuration
├── index.html                  # Main resume page
├── style.css                   # Stylesheet
├── script.js                   # Interactive features
├── back_image.jpg             # Background image
├── generate-banner.html        # LinkedIn banner generator
├── linkedin-banner.html        # Banner preview
├── TECH-STACK.md              # Detailed tech documentation
├── CI-CD-GUIDE.md             # CI/CD implementation guide
└── README.md                   # This file
```

---

## 🎯 Features

### 1. Interactive Animations
- **Scroll Reveal** - Sections fade in as you scroll
- **Skill Bars** - Animated progress bars showing proficiency levels
- **Hover Effects** - Interactive elements with smooth transitions

### 2. Responsive Design
- Mobile-first approach
- Breakpoints for tablets and desktops
- Flexible grid layouts

### 3. CI/CD Pipeline
Automated workflow on every push:
1. ✅ Code quality checks
2. ✅ File validation
3. ✅ Automated deployment to GitHub Pages
4. ✅ Deployment notifications

### 4. LinkedIn Banner Generator
- Generate custom 1200×630px banners
- Download as PNG or copy to clipboard
- Perfect for LinkedIn Featured section

---

## 🚀 Quick Start

### Prerequisites
- Git
- A modern web browser
- (Optional) Node.js for local development server

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Jadejesse/Jade_resume.git
cd Jade_resume
```

2. **Open locally**
```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

3. **Or deploy to GitHub Pages**
- Push to your GitHub repository
- Enable GitHub Pages in Settings → Pages
- Select `main` branch as source
- Your site will be live at `https://[username].github.io/[repo-name]/`

---

## 🔧 Customization

### Update Personal Information

Edit `index.html`:
```html
<!-- Update name and title -->
<h1>Your Name</h1>
<p class="role main-title">Your Job Title</p>

<!-- Update contact information -->
<li><strong>Email:</strong> <a href="mailto:your@email.com">your@email.com</a></li>
<li><strong>Phone:</strong> Your Phone</li>
<li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/yourprofile">linkedin.com/in/yourprofile</a></li>
<li><strong>GitHub:</strong> <a href="https://github.com/yourusername">github.com/yourusername</a></li>
```

### Customize Colors

Edit `style.css`:
```css
:root{
  --sky-1: #aee9ff;    /* Light blue */
  --sky-2: #65d6ff;    /* Medium blue */
  --sky-3: #0ea5d8;    /* Dark blue */
  --accent: #7dd3fc;   /* Accent color */
  --text-dark: #04293a; /* Text color */
}
```

### Modify Skills

Edit `index.html`:
```html
<div class="skill">
    <div class="skill-head"><span>Your Skill</span><span class="percent">90%</span></div>
    <div class="bar" data-percent="90"><div class="fill"></div></div>
</div>
```

---

## 📊 CI/CD Pipeline

### Workflow Overview

```
Push to main branch
    ↓
GitHub Actions triggered
    ↓
Job 1: Code Quality Check
├── Check HTML files
├── Check CSS files
└── Check JavaScript files
    ↓
Job 2: Deploy to GitHub Pages
├── Prepare deployment
├── Deploy files
└── Verify deployment
    ↓
Job 3: Send Notification
└── Notify status
```

### View Pipeline Status

Visit: [https://github.com/Jadejesse/Jade_resume/actions](https://github.com/Jadejesse/Jade_resume/actions)

---

## 🎨 LinkedIn Banner Generator

### Usage

1. Open `generate-banner.html` in your browser
2. Click "Download as PNG" button
3. Upload to LinkedIn Featured section

### Features
- 1200×630px (LinkedIn recommended size)
- Matches website color scheme
- Includes GitHub profile link
- One-click download or copy to clipboard

---

## 📈 Performance

- **Load Time:** < 1 second
- **Page Size:** < 500KB
- **Lighthouse Score:** 95+
- **Mobile Friendly:** Yes
- **SEO Optimized:** Yes

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Jade Chen**
- **Position:** Data Center Cloud and Infra Engineer @ AWS
- **Location:** Melbourne, VIC, Australia
- **Email:** chosen1edwin@gmail.com
- **LinkedIn:** [linkedin.com/in/jadechen](https://www.linkedin.com/in/jadechen)
- **GitHub:** [@Jadejesse](https://github.com/Jadejesse)

---

## 🙏 Acknowledgments

- Inspired by modern web design trends
- Built with vanilla JavaScript for maximum performance
- Deployed with GitHub Pages and GitHub Actions

---

## 📚 Documentation

- [Tech Stack Details](TECH-STACK.md) - Comprehensive technology documentation
- [CI/CD Guide](CI-CD-GUIDE.md) - Complete CI/CD implementation guide
- [GitHub Actions Workflow](.github/workflows/deploy.yml) - Pipeline configuration

---

## 🔗 Links

- **Live Site:** [https://jadejesse.github.io/Jade_resume/](https://jadejesse.github.io/Jade_resume/)
- **Repository:** [https://github.com/Jadejesse/Jade_resume](https://github.com/Jadejesse/Jade_resume)
- **Issues:** [https://github.com/Jadejesse/Jade_resume/issues](https://github.com/Jadejesse/Jade_resume/issues)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Made with ❤️ by Jade Chen**


---

<a name="中文"></a>
## 🌏 中文版本

## 🚀 在线演示

**访问:** [https://jadejesse.github.io/Jade_resume/](https://jadejesse.github.io/Jade_resume/)

---

## 📋 关于项目

这是一个专业的在线简历网站，具有以下特点：

- ✨ **现代化设计** - 简洁、响应式布局，渐变背景
- 🎨 **流畅动画** - 滚动显示效果和技能条动画
- 📱 **移动端适配** - 针对所有设备优化
- 🚀 **快速加载** - 纯原生JavaScript，无重型框架
- 🤖 **CI/CD流水线** - 使用GitHub Actions自动化测试和部署
- 🎵 **背景音乐** - Lo-fi和City Pop音乐系统
- ✨ **隐藏彩蛋** - Konami Code、头像点击等多个彩蛋
- 🎮 **交互特效** - 鼠标粒子、深色模式、打字机效果

---

## 🛠️ 技术栈

### 核心技术
- **HTML5** - 语义化标记
- **CSS3** - 现代化样式和动画
- **JavaScript (ES6+)** - 交互功能

### CSS特性
- CSS变量（自定义属性）
- Flexbox & CSS Grid布局
- CSS动画和关键帧
- 线性和径向渐变
- 媒体查询（响应式设计）
- SVG内联图像

### JavaScript特性
- ES6+语法（箭头函数、const/let）
- DOM API操作
- 事件处理
- 滚动检测
- Intersection Observer模式

### DevOps & 工具
- **GitHub Actions** - CI/CD流水线
- **GitHub Pages** - 静态网站托管
- **Git** - 版本控制
- **Chart.js** - 技能雷达图

---

## 📁 项目结构

```
Jade_resume/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD流水线配置
├── index.html                  # 主简历页面
├── home.html                   # 主页
├── style.css                   # 样式表
├── script.js                   # 交互功能
├── enhanced-features.js        # 增强功能（音乐、彩蛋等）
├── enhanced-features.css       # 增强功能样式
├── skills-radar.js             # 技能雷达图
├── home-script.js              # 主页脚本
├── home-style.css              # 主页样式
├── back_image.jpg             # 背景图片
├── 1310224.jpeg               # 彩蛋图片
├── generate-banner.html        # LinkedIn横幅生成器
├── TECH-STACK.md              # 详细技术文档
├── CI-CD-GUIDE.md             # CI/CD实施指南
├── ENHANCED-FEATURES.md       # 增强功能说明
└── README.md                   # 本文件
```

---

## 🎯 功能特性

### 1. 交互动画
- **滚动显示** - 滚动时部分淡入
- **技能条** - 显示熟练程度的动画进度条
- **悬停效果** - 平滑过渡的交互元素
- **打字机效果** - 标题逐字显示

### 2. 响应式设计
- 移动优先方法
- 平板和桌面断点
- 灵活的网格布局

### 3. 音乐系统
- **Resume页面** - Lo-fi音乐（自动播放）
- **Home页面** - City Pop音乐（自动播放）
- **音量控制** - 可开关，音量适中（15%）

### 4. 隐藏彩蛋
- **Konami Code** - 输入↑↑↓↓←→←→BA激活彩虹模式
- **头像点击** - 点击10次看凌波丽图片+EVA主题曲
- **双击头像** - 返回主页（新功能！）
- **深色模式** - 右上角切换
- **控制台消息** - 按F12查看

### 5. 鼠标粒子效果
- 彩色粒子跟随鼠标
- 两个页面不同颜色主题
- 流畅的动画效果

### 6. 技能雷达图
- 使用Chart.js可视化
- 8个技能维度
- 交互式图表

### 7. CI/CD流水线
每次推送自动执行：
1. ✅ 代码质量检查
2. ✅ 文件验证
3. ✅ 自动部署到GitHub Pages
4. ✅ 部署通知

---

## 🚀 快速开始

### 前置要求
- Git
- 现代浏览器
- （可选）Node.js用于本地开发服务器

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/Jadejesse/Jade_resume.git
cd Jade_resume
```

2. **本地打开**
```bash
# 方法1：直接在浏览器中打开
open index.html

# 方法2：使用本地服务器（推荐）
python -m http.server 8000
# 然后访问 http://localhost:8000
```

3. **或部署到GitHub Pages**
- 推送到你的GitHub仓库
- 在Settings → Pages中启用GitHub Pages
- 选择`main`分支作为源
- 你的网站将在`https://[username].github.io/[repo-name]/`上线

---

## 🎮 使用指南

### Resume页面功能

1. **双击头像返回主页** 🏠
   - 双击"JC"头像即可返回home.html
   - 提示框中有说明

2. **Lo-fi音乐** 🎵
   - 页面加载后自动播放
   - 点击左下角按钮控制

3. **Konami Code** 🎮
   - 按键顺序：↑↑↓↓←→←→BA
   - 激活彩虹模式

4. **头像彩蛋** 🎉
   - 点击头像10次
   - 显示凌波丽图片
   - 播放EVA《残酷天使的行动纲领》

5. **深色模式** 🌙
   - 点击右上角切换
   - 自动保存偏好

6. **键盘音效** 🎹
   - 点击任何按钮听到敲击声

### Home页面功能

1. **City Pop音乐** 🎶
   - 页面加载后自动播放
   - 点击左下角粉色按钮控制

2. **鼠标粒子** ✨
   - 移动鼠标看粒子效果
   - 蓝色+粉色混合

3. **实时天气** ☀️
   - 显示Melbourne天气
   - 每10分钟更新

4. **实时时钟** 🕐
   - 显示当前时间
   - 每秒更新

---

## 🔧 自定义

### 更新个人信息

编辑`index.html`:
```html
<!-- 更新姓名和职位 -->
<h1>你的名字</h1>
<p class="role main-title">你的职位</p>

<!-- 更新联系信息 -->
<li><strong>Email:</strong> <a href="mailto:your@email.com">your@email.com</a></li>
<li><strong>Phone:</strong> 你的电话</li>
<li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/yourprofile">linkedin.com/in/yourprofile</a></li>
<li><strong>GitHub:</strong> <a href="https://github.com/yourusername">github.com/yourusername</a></li>
```

### 自定义颜色

编辑`style.css`:
```css
:root{
  --sky-1: #aee9ff;    /* 浅蓝色 */
  --sky-2: #65d6ff;    /* 中蓝色 */
  --sky-3: #0ea5d8;    /* 深蓝色 */
  --accent: #7dd3fc;   /* 强调色 */
  --text-dark: #04293a; /* 文字颜色 */
}
```

### 修改技能

编辑`index.html`:
```html
<div class="skill">
    <div class="skill-head"><span>你的技能</span><span class="percent">90%</span></div>
    <div class="bar" data-percent="90"><div class="fill"></div></div>
</div>
```

### 更换音乐

编辑`enhanced-features.js`和`home-script.js`:
```javascript
// Resume Lo-fi音乐
this.audio.src = '你的音乐URL';

// Home City Pop音乐
this.audio.src = '你的音乐URL';
```

---

## 📊 CI/CD流水线

### 工作流程概览

```
推送到main分支
    ↓
触发GitHub Actions
    ↓
任务1：代码质量检查
├── 检查HTML文件
├── 检查CSS文件
└── 检查JavaScript文件
    ↓
任务2：部署到GitHub Pages
├── 准备部署
├── 部署文件
└── 验证部署
    ↓
任务3：发送通知
└── 通知状态
```

### 查看流水线状态

访问: [https://github.com/Jadejesse/Jade_resume/actions](https://github.com/Jadejesse/Jade_resume/actions)

---

## 🎨 LinkedIn横幅生成器

### 使用方法

1. 在浏览器中打开`generate-banner.html`
2. 点击"Download as PNG"按钮
3. 上传到LinkedIn Featured部分

### 特性
- 1200×630px（LinkedIn推荐尺寸）
- 匹配网站配色方案
- 包含GitHub个人资料链接
- 一键下载或复制到剪贴板

---

## 📈 性能

- **加载时间:** < 1秒
- **页面大小:** < 500KB
- **Lighthouse评分:** 95+
- **移动端友好:** 是
- **SEO优化:** 是

---

## 🤝 贡献

欢迎贡献！请随时提交Pull Request。

1. Fork本仓库
2. 创建你的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

---

## 📝 许可证

本项目是开源的，使用[MIT许可证](LICENSE)。

---

## 👤 作者

**Jade Chen | 陈杰**
- **职位:** AWS数据中心云和基础设施工程师
- **地点:** 澳大利亚墨尔本
- **邮箱:** chosen1edwin@gmail.com
- **LinkedIn:** [linkedin.com/in/jadechen](https://www.linkedin.com/in/jadechen)
- **GitHub:** [@Jadejesse](https://github.com/Jadejesse)

---

## 🙏 致谢

- 灵感来自现代网页设计趋势
- 使用原生JavaScript构建以获得最佳性能
- 使用GitHub Pages和GitHub Actions部署

---

## 📚 文档

- [技术栈详情](TECH-STACK.md) - 全面的技术文档
- [CI/CD指南](CI-CD-GUIDE.md) - 完整的CI/CD实施指南
- [增强功能说明](ENHANCED-FEATURES.md) - 所有隐藏功能和彩蛋
- [GitHub Actions工作流](.github/workflows/deploy.yml) - 流水线配置

---

## 🔗 链接

- **在线网站:** [https://jadejesse.github.io/Jade_resume/](https://jadejesse.github.io/Jade_resume/)
- **代码仓库:** [https://github.com/Jadejesse/Jade_resume](https://github.com/Jadejesse/Jade_resume)
- **问题反馈:** [https://github.com/Jadejesse/Jade_resume/issues](https://github.com/Jadejesse/Jade_resume/issues)

---

## ⭐ 支持项目

如果这个项目对你有帮助，请给个⭐️！

---

**Made with ❤️ by Jade Chen | 用❤️制作**
