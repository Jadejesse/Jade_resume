// ========================================
// ADVANCED EFFECTS - 高级特效控制
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================
  // 1. LOADING SCREEN - 加载动画
  // ========================================
  const loadingScreen = {
    init() {
      // Create loading screen
      const loader = document.createElement('div');
      loader.className = 'loading-screen';
      loader.innerHTML = `
        <div class="loading-logo">JADE</div>
        <div class="loading-bar-container">
          <div class="loading-bar"></div>
        </div>
        <div class="loading-text">Loading Amazing Experience...</div>
      `;
      document.body.prepend(loader);
      
      // Hide after 2 seconds
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
      }, 2000);
    }
  };
  
  // ========================================
  // 2. CUSTOM CURSOR - 已移除
  // ========================================
  
  // ========================================
  // 3. SKILL PROGRESS ANIMATION - 技能进度条动画
  // ========================================
  const skillAnimation = {
    init() {
      const skills = document.querySelectorAll('.skill');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
              const fill = entry.target.querySelector('.fill');
              const percent = fill.parentElement.dataset.percent;
              
              // Animate progress bar
              setTimeout(() => {
                fill.style.width = percent + '%';
                fill.classList.add('animating');
              }, 100);
              
              // Animate number count
              this.animateNumber(entry.target.querySelector('.percent'), percent);
            }, index * 100);
          }
        });
      }, { threshold: 0.5 });
      
      skills.forEach(skill => observer.observe(skill));
    },
    
    animateNumber(element, target) {
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.round(current) + '%';
      }, 20);
    }
  };
  
  // ========================================
  // 4. PARALLAX SCROLL - 视差滚动
  // ========================================
  const parallaxScroll = {
    init() {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for background
        const bgAnim = document.querySelector('.bg-anim');
        if (bgAnim) {
          bgAnim.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Parallax for cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
          const speed = 0.1 + (index * 0.02);
          const yPos = -(scrolled * speed);
          card.style.transform = `translateY(${yPos}px)`;
        });
      });
    }
  };
  
  // ========================================
  // 5. TIMELINE ANIMATION - 时间线动画
  // ========================================
  const timelineAnimation = {
    init() {
      const jobs = document.querySelectorAll('.job');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, index * 200);
          }
        });
      }, { threshold: 0.3 });
      
      jobs.forEach(job => observer.observe(job));
    }
  };
  
  // ========================================
  // 6. FLOATING PARTICLES - 漂浮粒子
  // ========================================
  const floatingParticles = {
    init() {
      const particleCount = 20;
      
      for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
          this.createParticle();
        }, i * 500);
      }
      
      // Create new particle every 3 seconds
      setInterval(() => this.createParticle(), 3000);
    },
    
    createParticle() {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (10 + Math.random() * 10) + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      
      document.body.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => particle.remove(), 20000);
    }
  };
  
  // ========================================
  // 7. SMOOTH SCROLL TO SECTION - 平滑滚动
  // ========================================
  const smoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };
  
  // ========================================
  // 8. CARD HOVER SOUND - 卡片悬停音效
  // ========================================
  const hoverSound = {
    init() {
      const cards = document.querySelectorAll('.card-cute, .card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          // Subtle hover sound
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
          audio.volume = 0.1;
          audio.play().catch(() => {});
        });
      });
    }
  };
  
  // ========================================
  // 9. SCROLL PROGRESS INDICATOR - 滚动进度指示器
  // ========================================
  const scrollProgress = {
    init() {
      const progressBar = document.createElement('div');
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #aee9ff, #65d6ff, #0ea5d8);
        z-index: 999999;
        transition: width 0.1s ease;
        box-shadow: 0 0 10px rgba(174, 233, 255, 0.8);
      `;
      document.body.appendChild(progressBar);
      
      window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
      });
    }
  };
  
  // ========================================
  // 10. TYPING EFFECT FOR TITLE - 标题打字效果
  // ========================================
  const typingEffect = {
    init() {
      const title = document.querySelector('.main-title');
      if (!title || title.dataset.typed) return;
      
      title.dataset.typed = 'true';
      const text = title.textContent;
      title.textContent = '';
      title.style.opacity = '1';
      
      let index = 0;
      const speed = 100;
      
      function type() {
        if (index < text.length) {
          title.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        }
      }
      
      setTimeout(type, 500);
    }
  };
  
  // ========================================
  // INITIALIZE ALL EFFECTS
  // ========================================
  loadingScreen.init();
  skillAnimation.init();
  typingEffect.init();
  
  console.log('🎨 Advanced effects loaded!');
});
