// ========================================
// SKILLS RADAR CHART
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  
  // Create radar chart container
  function createRadarChart() {
    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;
    
    // Add canvas after skills grid
    const radarContainer = document.createElement('div');
    radarContainer.className = 'radar-container';
    radarContainer.innerHTML = `
      <h3 style="text-align: center; margin: 30px 0 20px; color: var(--text-dark);">Skills Radar Chart</h3>
      <canvas id="skillsRadar" width="400" height="400"></canvas>
    `;
    
    skillsSection.appendChild(radarContainer);
    
    // Initialize Chart.js
    initChart();
  }
  
  function initChart() {
    const ctx = document.getElementById('skillsRadar');
    if (!ctx) return;
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not loaded. Loading from CDN...');
      loadChartJS(() => drawChart(ctx));
    } else {
      drawChart(ctx);
    }
  }
  
  function loadChartJS(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = callback;
    document.head.appendChild(script);
  }
  
  function drawChart(ctx) {
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Azure Security',
          'Microsoft 365',
          'KQL / Telemetry',
          'Python / API',
          'AWS Cloud',
          'Incident Response',
          'Networking',
          'SQL & Data'
        ],
        datasets: [{
          label: 'Technical Skills',
          data: [90, 88, 86, 86, 86, 88, 80, 84],
          fill: true,
          backgroundColor: 'rgba(101, 214, 255, 0.2)',
          borderColor: 'rgb(14, 165, 216)',
          pointBackgroundColor: 'rgb(14, 165, 216)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(14, 165, 216)',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            angleLines: {
              color: 'rgba(14, 165, 216, 0.2)'
            },
            grid: {
              color: 'rgba(14, 165, 216, 0.2)'
            },
            pointLabels: {
              color: 'var(--text-dark)',
              font: {
                size: 12,
                weight: '600'
              }
            },
            ticks: {
              backdropColor: 'transparent',
              color: 'var(--muted)'
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  // Initialize
  createRadarChart();
});
