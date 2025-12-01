// Update Date and Time
function updateDateTime() {
    const now = new Date();
    
    // Format date: "Mon 1 Dec"
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    
    document.getElementById('date').textContent = `${dayName} ${date} ${monthName}`;
    
    // Format time: "12:15 PM"
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    document.getElementById('time').textContent = `${hours}:${minutesStr} ${ampm}`;
}

// Update every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Get Weather (using OpenWeatherMap API)
async function getWeather() {
    try {
        // Melbourne coordinates
        const lat = -37.8136;
        const lon = 144.9631;
        
        // Using a free weather API (no key required for basic info)
        // Alternative: You can use OpenWeatherMap with your own API key
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=celsius`);
        
        if (response.ok) {
            const data = await response.json();
            const temp = Math.round(data.current_weather.temperature);
            const weatherCode = data.current_weather.weathercode;
            
            // Update temperature
            document.getElementById('temp').textContent = `${temp}°C`;
            
            // Update weather icon based on weather code
            const weatherIcon = getWeatherIcon(weatherCode);
            document.querySelector('.weather-icon').textContent = weatherIcon;
        } else {
            // Fallback if API fails
            document.getElementById('temp').textContent = '22°C';
        }
    } catch (error) {
        console.log('Weather fetch error:', error);
        // Fallback values
        document.getElementById('temp').textContent = '22°C';
        document.querySelector('.weather-icon').textContent = '☀️';
    }
}

// Get weather icon based on WMO weather code
function getWeatherIcon(code) {
    const icons = {
        0: '☀️',  // Clear sky
        1: '🌤️',  // Mainly clear
        2: '⛅',  // Partly cloudy
        3: '☁️',  // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌦️', // Light drizzle
        53: '🌦️', // Moderate drizzle
        55: '🌧️', // Dense drizzle
        61: '🌧️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        71: '🌨️', // Slight snow
        73: '🌨️', // Moderate snow
        75: '🌨️', // Heavy snow
        77: '❄️',  // Snow grains
        80: '🌦️', // Slight rain showers
        81: '🌧️', // Moderate rain showers
        82: '⛈️',  // Violent rain showers
        85: '🌨️', // Slight snow showers
        86: '🌨️', // Heavy snow showers
        95: '⛈️',  // Thunderstorm
        96: '⛈️',  // Thunderstorm with slight hail
        99: '⛈️'   // Thunderstorm with heavy hail
    };
    
    return icons[code] || '☀️';
}

// Get weather on page load
getWeather();

// Update weather every 10 minutes
setInterval(getWeather, 600000);

// Add smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add hover effect sound (optional)
const icons = document.querySelectorAll('.icon-card, .dock-icon');
icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        // You can add a subtle sound effect here if desired
        icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});


// ========================================
// CITY POP MUSIC PLAYER FOR HOME PAGE
// ========================================
const cityPopPlayer = {
  audio: null,
  isPlaying: false,
  volume: 0.15,
  
  init() {
    this.audio = new Audio();
    // City Pop style music - upbeat retro style
    this.audio.src = 'https://cdn.pixabay.com/audio/2022/08/23/audio_d1718ab41f.mp3';
    this.audio.loop = true;
    this.audio.volume = this.volume;
    
    // Add error handling
    this.audio.addEventListener('error', () => {
      console.error('Failed to load music. Trying alternative...');
      // Fallback to another upbeat track
      this.audio.src = 'https://cdn.pixabay.com/audio/2022/03/23/audio_4aedb8c4d0.mp3';
      this.audio.load();
    });
    
    this.createUI();
    // Don't autoplay, let user click
    console.log('City Pop music ready. Click the button to play!');
  },
  
  createUI() {
    const musicBtn = document.createElement('div');
    musicBtn.className = 'home-music-control';
    musicBtn.innerHTML = `
      <div class="home-music-icon">🎶</div>
      <div class="home-music-text">City Pop</div>
    `;
    document.body.appendChild(musicBtn);
    
    musicBtn.addEventListener('click', () => this.toggle());
  },
  

  
  toggle() {
    if (this.isPlaying) {
      this.audio.pause();
      document.querySelector('.home-music-control').classList.remove('playing');
    } else {
      this.audio.play();
      document.querySelector('.home-music-control').classList.add('playing');
    }
    this.isPlaying = !this.isPlaying;
  }
};

// ========================================
// PARTICLE MOUSE TRAIL FOR HOME PAGE
// ========================================
const homeParticles = {
  particles: [],
  maxParticles: 50,
  
  init() {
    document.addEventListener('mousemove', (e) => this.createParticle(e));
    this.animate();
  },
  
  createParticle(e) {
    if (this.particles.length > this.maxParticles) {
      this.particles.shift();
    }
    
    const particle = document.createElement('div');
    particle.className = 'home-particle';
    particle.style.left = e.clientX + 'px';
    particle.style.top = e.clientY + 'px';
    
    // Pastel colors matching home page theme
    const colors = ['#aee9ff', '#65d6ff', '#0ea5d8', '#7dd3fc', '#ffc0cb', '#ffb6c1'];
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
// KEYBOARD CLICK SOUND FOR HOME PAGE
// ========================================
const homeClickSound = {
  init() {
    const clickables = document.querySelectorAll('a, .icon-card, .dock-icon, .nav-menu a');
    clickables.forEach(el => {
      el.addEventListener('click', () => this.playSound());
    });
  },
  
  playSound() {
    const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_4dedf2f94e.mp3');
    audio.volume = 0.15;
    audio.play().catch(() => {});
  }
};

// Initialize home page features
document.addEventListener('DOMContentLoaded', () => {
  cityPopPlayer.init();
  homeParticles.init();
  homeClickSound.init();
});
