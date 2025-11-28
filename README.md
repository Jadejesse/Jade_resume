# 🌐 Jade Chen - Online Resume

[![CI/CD](https://github.com/Jadejesse/Jade_resume/actions/workflows/deploy.yml/badge.svg)](https://github.com/Jadejesse/Jade_resume/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success)](https://jadejesse.github.io/Jade_resume/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, interactive online resume built with pure HTML, CSS, and JavaScript

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
