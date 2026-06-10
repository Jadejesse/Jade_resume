import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../../data/profile.js';
import { skills } from '../../data/skills.js';
import { experience } from '../../data/experience.js';
import { usePageStyles } from '../../hooks/usePageStyles.js';
import { useScrollReveal } from '../../hooks/useScrollReveal.js';
import { useTypewriter } from '../../hooks/useTypewriter.js';
import { useAvatarEasterEgg } from '../../hooks/useAvatarEasterEgg.js';
import ThreeBackground from '../../components/effects/ThreeBackground.jsx';
import CyberpunkFx from '../../components/effects/CyberpunkFx.jsx';
import ResumeParticles from '../../components/effects/ResumeParticles.jsx';
import ResumeMusic from '../../components/effects/ResumeMusic.jsx';
import DarkModeToggle from '../../components/effects/DarkModeToggle.jsx';
import KonamiEasterEgg from '../../components/effects/KonamiEasterEgg.jsx';
import ClickSound from '../../components/effects/ClickSound.jsx';
import LoadingScreen from '../../components/effects/LoadingScreen.jsx';
import SkillsRadar from '../../components/resume/SkillsRadar.jsx';

const base = import.meta.env.BASE_URL;

// Original Resume stylesheets, loaded only while this page is mounted.
const RESUME_STYLES = [
  'legacy/style.css',
  'legacy/enhanced-features.css',
  'legacy/advanced-effects.css',
  'legacy/cyberpunk.css',
];

const navCards = [
  { href: '#about', icon: '👩‍💻', title: 'About Me', desc: 'Quick intro and profile' },
  { href: '#skills', icon: '🛠️', title: 'Skills', desc: 'Tech stack & strengths' },
  { href: '#experience', icon: '💼', title: 'Experience', desc: 'Work & projects' },
  { href: '#contact', icon: '📬', title: 'Contact', desc: 'Get in touch' },
];

export default function Resume() {
  usePageStyles(RESUME_STYLES);
  useScrollReveal();
  useTypewriter('.main-title', profile.role);
  useAvatarEasterEgg();

  useEffect(() => {
    document.title = 'Jade Chen - Online Resume';
    document.body.classList.add('resume-page');
    // Legacy style.css pins html+body to height:100%, which lets body's overflow
    // propagate to the viewport and traps the page so anchor scrolling /
    // scrollIntoView can't move it. Setting html overflow:hidden makes <body>
    // itself the scroll container (it already has height:100vh + overflow-y:auto),
    // which unlocks scrolling. Fixed backgrounds stay put (body has no filter).
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.classList.remove('resume-page');
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return (
    <>
      <LoadingScreen />
      <div className="bg-anim" />
      <div className="ambient-depth" aria-hidden="true" />
      <div className="ambient-dust" aria-hidden="true" />
      <div className="konami-fx" aria-hidden="true" />
      <ThreeBackground />
      <CyberpunkFx />
      <ResumeParticles />

      <header className="hero">
        <div className="hero-inner">
          <div className="avatar">
            <img src={`${base}${profile.avatar}`} alt={profile.name} className="avatar-img" />
          </div>
          <div className="hero-text">
            <h1>{profile.name}</h1>
            <p className="role main-title">{profile.role}</p>
          </div>
        </div>
        <section className="card-grid">
          {navCards.map((card) => (
            <a className="card-cute" href={card.href} key={card.href}>
              <div className="card-cute-icon">{card.icon}</div>
              <div className="card-cute-title">{card.title}</div>
              <div className="card-cute-desc">{card.desc}</div>
            </a>
          ))}
        </section>
      </header>

      <div className="easter-egg-hints">
        <div className="hint-title">✨ Hidden Features ✨</div>
        <div className="hint-items">
          <Link to="/" className="hint-item hint-home-btn">
            <span className="hint-icon">🏠</span>
            <span className="hint-text">Back to Home Page</span>
          </Link>
          <div className="hint-item">
            <span className="hint-icon">🎮</span>
            <span className="hint-text">Try Konami Code: ↑↑↓↓←→←→BA</span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">🎉</span>
            <span className="hint-text">Click avatar 10 times for surprise!</span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">🌙</span>
            <span className="hint-text">Toggle dark mode (top right)</span>
          </div>
          <div className="hint-item">
            <span className="hint-icon">💬</span>
            <span className="hint-text">Check the console (F12)</span>
          </div>
        </div>
      </div>

      <section id="about" className="card">
        <h2>About Me</h2>
        {profile.summary.map((paragraph) => (
          <p className="about-text" key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </section>

      <section id="contact" className="card">
        <h2>Contact</h2>
        <ul className="contact-list">
          <li><strong>Email:</strong> <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a></li>
          <li><strong>Phone:</strong> {profile.contact.phone}</li>
          <li><strong>LinkedIn:</strong> <a href={profile.contact.linkedin}>{profile.contact.linkedin.replace('https://www.', '')}</a></li>
          <li><strong>GitHub:</strong> <a href={profile.contact.github}>{profile.contact.github.replace('https://', '')}</a></li>
        </ul>
      </section>

      <section id="skills" className="card">
        <h2>Skills</h2>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill" key={skill.label}>
              <div className="skill-head"><span>{skill.label}</span><span className="percent">0%</span></div>
              <div className="bar" data-percent={skill.value}><div className="fill" /></div>
            </div>
          ))}
        </div>
        <SkillsRadar />
      </section>

      <section id="experience" className="card">
        <h2>Experience</h2>
        {experience.map((job) => (
          <div className="job card-light" key={`${job.company}-${job.period}`}>
            <h3>{job.role} - {job.company}</h3>
            <p className="muted">{job.period} | {job.location}</p>
            <ul>
              {job.highlights.map((item) => (
                <li key={item.slice(0, 24)}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="education" className="card">
        <h2>Education</h2>
        {profile.education.map((item) => (
          <p className="edu-detail" key={item.school}>
            {item.degree}, {item.school}, {item.location}, {item.year}
          </p>
        ))}
      </section>

      <footer>
        <p>© 2025 {profile.name}</p>
      </footer>

      <ResumeMusic />
      <DarkModeToggle />
      <KonamiEasterEgg />
      <ClickSound />
    </>
  );
}
