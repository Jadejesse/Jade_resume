// ========================================
// ENHANCED RESUME FEATURES
// ========================================

// Console Easter Egg
console.log('%c🎮 Hey there, curious developer! 👋', 'color: #0ea5d8; font-size: 20px; font-weight: bold;');
console.log('%c💡 Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #65d6ff; font-size: 14px;');
console.log('%cOr click my avatar 10 times for a surprise! 🎉', 'color: #aee9ff; font-size: 12px;');

document.addEventListener('DOMContentLoaded', () => {
  
  // ========================================
  // 1. MUSIC PLAYER SYSTEM
  // ========================================
  const musicPlayer = {
    audio: null,
    isPlaying: false,
    volume: 0.15, // Low volume for chill lo-fi
    
    init() {
      // Create audio element
      this.audio = new Audio();
      // Using free lo-fi music from Pixabay
      this.audio.src = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3';
      this.audio.loop = true;
      this.audio.volume = this.volume;
      
      // Create music control UI
      this.createUI();
      this.tryAutoPlay();
    },
    
    tryAutoPlay() {
      // Try autoplay after user interaction
      const startMusic = () => {
        this.audio.play().then(() => {
          this.isPlaying = true;
          document.querySelector('.music-control').classList.add('playing');
          console.log('Lo-fi music playing!');
        }).catch(() => {
          console.log('Autoplay blocked. Click the button to play.');
        });
        document.removeEventListener('click', startMusic);
        document.removeEventListener('keydown', startMusic);
      };
      
      // Try immediate autoplay
      this.audio.play().then(() => {
        this.isPlaying = true;
        document.querySelector('.music-control').classList.add('playing');
      }).catch(() => {
        // If blocked, wait for user interaction
        document.addEventListener('click', startMusic, { once: true });
        document.addEventListener('keydown', startMusic, { once: true });
      });
    },
    
    createUI() {
      const musicBtn = document.createElement('div');
      musicBtn.className = 'music-control';
      musicBtn.innerHTML = `
        <div class="music-icon">🎵</div>
        <div class="music-text">Lo-fi Music</div>
      `;
      document.body.appendChild(musicBtn);
      
      musicBtn.addEventListener('click', () => this.toggle());
    },
    

    
    toggle() {
      if (this.isPlaying) {
        this.audio.pause();
        document.querySelector('.music-control').classList.remove('playing');
      } else {
        this.audio.play();
        document.querySelector('.music-control').classList.add('playing');
      }
      this.isPlaying = !this.isPlaying;
    }
  };
  
  // ========================================
  // 2. PARTICLE MOUSE TRAIL (FULL PAGE)
  // ========================================
  const particleSystem = {
    particles: [],
    maxParticles: 60,
    
    init() {
      // Listen on document for full page coverage
      document.addEventListener('mousemove', (e) => this.createParticle(e), { passive: true });
      this.animate();
    },
    
    createParticle(e) {
      if (this.particles.length > this.maxParticles) {
        this.particles.shift();
      }
      
      const particle = document.createElement('div');
      particle.className = 'particle';
      // Use pageX/pageY for full page coverage including scrolled areas
      particle.style.left = e.pageX + 'px';
      particle.style.top = e.pageY + 'px';
      
      // Random colors from theme
      const colors = ['#aee9ff', '#65d6ff', '#0ea5d8', '#7dd3fc'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(particle);
      this.particles.push(particle);
      
      setTimeout(() => {
        particle.remove();
        this.particles = this.particles.filter(p => p !== particle);
      }, 1000);
    },
    
    animate() {
      requestAnimationFrame(() => this.animate());
    }
  };
  
  // ========================================
  // 3. KONAMI CODE EASTER EGG
  // ========================================
  const konamiCode = {
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    current: 0,
    progressIndicator: null,
    
    init() {
      document.addEventListener('keydown', (e) => this.checkKey(e));
      this.createProgressIndicator();
    },
    
    createProgressIndicator() {
      this.progressIndicator = document.createElement('div');
      this.progressIndicator.className = 'konami-progress';
      this.progressIndicator.style.display = 'none';
      document.body.appendChild(this.progressIndicator);
    },
    
    checkKey(e) {
      if (e.key.toLowerCase() === this.sequence[this.current].toLowerCase()) {
        this.current++;
        this.showProgress();
        
        if (this.current === this.sequence.length) {
          this.activate();
          this.current = 0;
          this.hideProgress();
        }
      } else {
        if (this.current > 0) {
          console.log('❌ Konami Code reset! Try again from the start.');
        }
        this.current = 0;
        this.hideProgress();
      }
    },
    
    showProgress() {
      const symbols = ['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'];
      this.progressIndicator.textContent = `🎮 ${this.current}/${this.sequence.length} - ${symbols.slice(0, this.current).join(' ')}`;
      this.progressIndicator.style.display = 'block';
      
      console.log(`✅ Konami Code Progress: ${this.current}/${this.sequence.length}`);
    },
    
    hideProgress() {
      setTimeout(() => {
        this.progressIndicator.style.display = 'none';
      }, 2000);
    },
    
    activate() {
      document.body.classList.add('konami-mode');
      alert('🎮 KONAMI CODE ACTIVATED! 🎉\n\nYou found the secret! Enjoy the rainbow mode! 🌈');
      console.log('🌈 RAINBOW MODE ACTIVATED!');
      
      // Play sound effect
      const audio = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };
  
  // ========================================
  // 4. TYPEWRITER EFFECT
  // ========================================
  const typewriter = {
    init() {
      const title = document.querySelector('.main-title');
      if (!title) return;
      
      const text = title.textContent;
      title.textContent = '';
      title.style.opacity = '1';
      
      let i = 0;
      const speed = 100;
      
      function type() {
        if (i < text.length) {
          title.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      
      setTimeout(type, 500);
    }
  };
  
  // ========================================
  // 5. DARK MODE TOGGLE
  // ========================================
  const darkMode = {
    init() {
      const toggle = document.createElement('div');
      toggle.className = 'dark-mode-toggle';
      toggle.innerHTML = '🌙';
      document.body.appendChild(toggle);
      
      // Check saved preference
      if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '☀️';
      }
      
      toggle.addEventListener('click', () => this.toggle(toggle));
    },
    
    toggle(btn) {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      btn.innerHTML = isDark ? '☀️' : '🌙';
      localStorage.setItem('darkMode', isDark);
    }
  };
  
  // ========================================
  // 6. AVATAR CLICK COUNTER EASTER EGG
  // ========================================
  const avatarEasterEgg = {
    clicks: 0,
    evaAudio: null,
    
    init() {
      const avatar = document.querySelector('.avatar');
      if (!avatar) return;
      
      avatar.addEventListener('click', () => this.handleClick());
      
      // Add visual hint
      avatar.style.cursor = 'pointer';
      avatar.title = 'Click 10 times for surprise!';
    },
    
    handleClick() {
      this.clicks++;
      
      if (this.clicks === 10) {
        this.activate();
        this.clicks = 0;
      }
    },
    
    activate() {
      alert('🎉 You found the secret! 🎊\n\nYou clicked 10 times! Here\'s a special surprise!');
      document.body.classList.add('party-mode');
      
      // Create image overlay with fade-in effect
      const overlay = document.createElement('div');
      overlay.className = 'party-image-overlay';
      overlay.innerHTML = '<img src="1310224.jpeg" alt="Special" class="party-image">';
      document.body.appendChild(overlay);
      
      // Play EVA theme song - "A Cruel Angel's Thesis"
      this.evaAudio = new Audio('https://cdn.pixabay.com/audio/2022/11/22/audio_3d52a1d6cc.mp3');
      this.evaAudio.volume = 0.4;
      this.evaAudio.play().then(() => {
        console.log('EVA theme playing!');
      }).catch((error) => {
        console.error('Failed to play EVA theme:', error);
        // Try alternative
        this.evaAudio.src = 'https://cdn.pixabay.com/audio/2023/02/28/audio_4a5e8a4e5e.mp3';
        this.evaAudio.play().catch(() => console.log('Alternative also failed'));
      });
      
      setTimeout(() => {
        document.body.classList.remove('party-mode');
        overlay.remove();
        if (this.evaAudio) {
          this.evaAudio.pause();
          this.evaAudio = null;
        }
      }, 5000);
    }
  };
  
  // ========================================
  // 7. CLICK SOUND EFFECTS (Keyboard Typing Sound)
  // ========================================
  const soundEffects = {
    init() {
      // Use event delegation for all clicks on document
      document.addEventListener('click', (e) => {
        this.playClick();
      }, true); // Use capture phase to catch all clicks
    },
    
    playClick() {
      // Keyboard typing sound effect - using a working URL
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.3;
      audio.play().catch((err) => {
        console.log('Sound play failed:', err);
      });
    }
  };
  
  // ========================================
  // 8. FORCE FIXED POSITIONING
  // ========================================
  const forceFixedPositioning = {
    init() {
      // Wait for elements to be created
      setTimeout(() => {
        const musicControl = document.querySelector('.music-control');
        const hintsBox = document.querySelector('.easter-egg-hints');
        const darkToggle = document.querySelector('.dark-mode-toggle');
        
        console.log('🔧 Forcing fixed positioning...');
        
        if (musicControl) {
          musicControl.style.setProperty('position', 'fixed', 'important');
          musicControl.style.setProperty('bottom', '30px', 'important');
          musicControl.style.setProperty('left', '30px', 'important');
          musicControl.style.setProperty('z-index', '999999', 'important');
          console.log('✅ Music control fixed:', window.getComputedStyle(musicControl).position);
        }
        
        if (hintsBox) {
          hintsBox.style.setProperty('position', 'fixed', 'important');
          hintsBox.style.setProperty('bottom', '120px', 'important');
          hintsBox.style.setProperty('left', '30px', 'important');
          hintsBox.style.setProperty('z-index', '999999', 'important');
          console.log('✅ Hints box fixed:', window.getComputedStyle(hintsBox).position);
        }
        
        if (darkToggle) {
          darkToggle.style.setProperty('position', 'fixed', 'important');
          darkToggle.style.setProperty('top', '30px', 'important');
          darkToggle.style.setProperty('right', '30px', 'important');
          darkToggle.style.setProperty('z-index', '999999', 'important');
          console.log('✅ Dark toggle fixed:', window.getComputedStyle(darkToggle).position);
        }
        
        // Force reflow
        document.body.offsetHeight;
      }, 100);
    }
  };
  
  // ========================================
  // INITIALIZE ALL FEATURES
  // ========================================
  musicPlayer.init();
  particleSystem.init();
  konamiCode.init();
  typewriter.init();
  darkMode.init();
  avatarEasterEgg.init();
  soundEffects.init();
  forceFixedPositioning.init();
  
});
