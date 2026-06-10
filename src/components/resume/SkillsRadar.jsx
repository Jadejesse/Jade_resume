import { useEffect, useRef } from 'react';
import { Chart, Filler, Legend, LineElement, PointElement, RadialLinearScale, RadarController, Tooltip } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Labels + data ported 1:1 from the original skills-radar.js.
const LABELS = [
  'Azure Security',
  'Microsoft 365',
  'KQL / Telemetry',
  'Python / API',
  'AWS Cloud',
  'Incident Response',
  'Networking',
  'SQL & Data',
];
const DATA = [90, 88, 86, 86, 86, 88, 80, 84];

const chartFrameStyle = {
  width: 'min(500px, 100%)',
  aspectRatio: '1 / 1',
};

const getCssColor = (name, fallback) => {
  const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

export default function SkillsRadar() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;

    const cyan = getCssColor('--cp-cyan', '#00e5ff');
    const text = getCssColor('--cp-text', '#b2ebf2');
    const muted = getCssColor('--cp-muted', 'rgba(178, 235, 242, 0.58)');
    const border = getCssColor('--cp-border', 'rgba(0, 229, 255, 0.28)');

    const chart = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels: LABELS,
        datasets: [
          {
            label: 'Technical Skills',
            data: DATA,
            fill: true,
            backgroundColor: 'rgba(101, 214, 255, 0.2)',
            borderColor: '#2fc9f4',
            borderWidth: 3,
            pointBackgroundColor: '#2fc9f4',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#2fc9f4',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: border },
            grid: { color: border },
            pointLabels: {
              color: cyan,
              font: { family: "'Rajdhani', 'Segoe UI', sans-serif", size: 13, weight: '700' },
            },
            ticks: { display: false, backdropColor: 'transparent', color: muted, font: { size: 11 } },
            suggestedMin: 0,
            suggestedMax: 100,
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            titleColor: text,
            bodyColor: text,
            borderColor: cyan,
            borderWidth: 1,
            backgroundColor: 'rgba(2, 10, 28, 0.92)',
          },
        },
      },
    });

    return () => chart.destroy();
  }, []);

  return (
    <div className="radar-container">
      <h3 style={{ textAlign: 'center', margin: '30px 0 20px', color: '#04293a' }}>Skills Radar Chart</h3>
      <div style={chartFrameStyle}>
        <canvas id="skillsRadar" ref={canvasRef} width="400" height="400" />
      </div>
    </div>
  );
}
