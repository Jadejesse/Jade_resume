// Fancy resume interactions: scroll reveal + animate skill bars
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const bars = document.querySelectorAll('.bar');

  function inView(el){
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 80;
  }

  function reveal(){
    sections.forEach(s => { if(inView(s)) s.classList.add('in-view'); });
    // animate bars when skills section visible
    const skills = document.querySelector('#skills');
    if(skills && inView(skills)){
      bars.forEach(b => {
        const pct = b.getAttribute('data-percent') || '70';
        const fill = b.querySelector('.fill');
        if(fill && !fill.dataset.animated){
          fill.style.width = pct + '%';
          fill.dataset.animated = '1';
        }
      });
    }
  }

  // initial reveal
  reveal();
  window.addEventListener('scroll', () => reveal());

  // subtle header avatar pulse
  const avatar = document.querySelector('.avatar');
  if(avatar){avatar.addEventListener('mouseenter', ()=> avatar.style.transform='scale(1.06)');
    avatar.addEventListener('mouseleave', ()=> avatar.style.transform='scale(1)');}
});
