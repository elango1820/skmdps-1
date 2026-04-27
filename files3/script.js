/* =============================================
   VALLALAR COMMUNITY — script.js
   ============================================= */

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ── Mobile menu toggle ──
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '1';
    });
  });
});

// ── Smooth scroll offset for fixed navbar ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 76;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Scroll fade-in observer ──
const fadeEls = document.querySelectorAll(
  '.card, .gallery-item, .history-image-wrap, .history-text, .contact-info, .contact-form-wrap, .section-title'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Stagger delays for grid items
document.querySelectorAll('.card').forEach((el, i) => el.dataset.delay = i * 80);
document.querySelectorAll('.gallery-item').forEach((el, i) => el.dataset.delay = i * 60);

fadeEls.forEach(el => observer.observe(el));

// ── Flame particles in Hero ──
function createFlameParticles() {
  const container = document.getElementById('flameParticles');
  if (!container) return;
  const emojis = ['🔥', '✨', '🕯️', '⭐'];
  const count = window.innerWidth < 600 ? 8 : 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'flame-particle';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left     = `${Math.random() * 100}%`;
    el.style.bottom   = `${Math.random() * 10}%`;
    el.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    el.style.animationDuration  = `${6 + Math.random() * 8}s`;
    el.style.animationDelay     = `${Math.random() * 8}s`;
    container.appendChild(el);
  }
}

createFlameParticles();

// ── Contact form ──
function submitForm() {
  const name  = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const msg   = document.getElementById('msgInput').value.trim();

  if (!name || !email || !msg) {
    // Simple shake animation on empty fields
    [nameInput, emailInput, msgInput].forEach(id => {
      const el = document.getElementById(id) || document.getElementById(id + 'Input') || document.querySelector('#' + id);
    });

    const inputs = ['nameInput','emailInput','msgInput'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        el.style.borderColor = '#c0392b';
        el.style.animation = 'shake 0.4s ease';
        el.addEventListener('animationend', () => el.style.animation = '', { once: true });
        setTimeout(() => el.style.borderColor = '', 2000);
      }
    });
    return;
  }

  const formWrap = document.getElementById('contactFormWrap');
  const success  = document.getElementById('formSuccess');

  formWrap.style.opacity = '0';
  formWrap.style.pointerEvents = 'none';

  setTimeout(() => {
    formWrap.style.display = 'none';
    success.classList.add('visible');
  }, 400);
}

// Shake keyframe via JS
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25%      { transform: translateX(-8px); }
    75%      { transform: translateX(8px); }
  }
`;
document.head.appendChild(style);

// ── Active nav highlight on scroll ──
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--gold)';
      } else {
        link.style.color = '';
      }
    }
  });
}, { passive: true });
