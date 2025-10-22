// ============================================
// SmartShield IDE-like JavaScript
// Theme Toggle, Animations, and Interactions
// ============================================

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = document.getElementById('themeIcon');
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    this.bindEvents();
  }

  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    if (this.themeIcon) {
      this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }
}

// Terminal-like Typing Animation
class TypeWriter {
  constructor(element, text, speed = 100) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.currentIndex = 0;
    this.isTyping = false;
  }

  start() {
    if (this.isTyping) return;
    this.isTyping = true;
    this.element.innerHTML = '';
    this.currentIndex = 0;
    this.type();
  }

  type() {
    if (this.currentIndex < this.text.length) {
      this.element.innerHTML += this.text.charAt(this.currentIndex);
      this.currentIndex++;
      setTimeout(() => this.type(), this.speed);
    } else {
      this.isTyping = false;
    }
  }
}

// Matrix Rain Effect
class MatrixRain {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.characters = '01';
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0.1';
    
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    this.start();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.drops = new Array(this.columns).fill(1);
  }

  start() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#00d4aa';
    this.ctx.font = `${this.fontSize}px JetBrains Mono`;
    
    for (let i = 0; i < this.drops.length; i++) {
      const text = this.characters[Math.floor(Math.random() * this.characters.length)];
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
      
      if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
    
    requestAnimationFrame(() => this.start());
  }
}

// Glitch Effect
class GlitchEffect {
  constructor(element) {
    this.element = element;
    this.originalText = element.textContent;
    this.glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    this.isGlitching = false;
  }

  start() {
    if (this.isGlitching) return;
    this.isGlitching = true;
    this.glitch();
  }

  glitch() {
    if (!this.isGlitching) return;
    
    const glitchText = this.originalText
      .split('')
      .map(char => Math.random() < 0.1 ? this.glitchChars[Math.floor(Math.random() * this.glitchChars.length)] : char)
      .join('');
    
    this.element.textContent = glitchText;
    
    setTimeout(() => {
      this.element.textContent = this.originalText;
      setTimeout(() => this.glitch(), Math.random() * 2000 + 1000);
    }, 100);
  }

  stop() {
    this.isGlitching = false;
    this.element.textContent = this.originalText;
  }
}

// Particle System
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0.6';
    
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }

  createParticles() {
    const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 10000);
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(0, 212, 170, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Mobile Navigation Toggle
class MobileNavigation {
  constructor() {
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.init();
  }

  init() {
    if (this.navToggle && this.navMenu) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.navToggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!this.navToggle.contains(event.target) && !this.navMenu.contains(event.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
  }

  closeMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
  }
}

// Smooth Scrolling
class SmoothScrolling {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
}

// Intersection Observer for Animations
class AnimationObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), this.observerOptions);
    this.init();
  }

  init() {
    this.observeElements();
  }

  observeElements() {
    const animatedElements = [
      '.hero-content',
      '.hero-visual',
      '.feature-card',
      '.game-card',
      '.step',
      '.tech-item',
      '.pricing-card',
      '.contact-content'
    ];

    animatedElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.transitionDelay = `${index * 0.1}s`;
        this.observer.observe(element);
      });
    });

    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }
}

// Form Handling
class FormHandler {
  constructor() {
    this.contactForm = document.querySelector('.contact-form form');
    this.init();
  }

  init() {
    if (this.contactForm) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.contactForm);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    const requiredFields = this.contactForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.style.borderColor = '#ff6b6b';
      } else {
        field.style.borderColor = '';
      }
    });
    
    if (isValid) {
      this.simulateSubmission();
    }
  }

  simulateSubmission() {
    const submitBtn = this.contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = '#00d4aa';
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        this.contactForm.reset();
      }, 2000);
    }, 1500);
  }
}

// Parallax Effect
class ParallaxEffect {
  constructor() {
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
      const rate = scrolled * -0.5;
      heroVisual.style.transform = `translateY(${rate}px)`;
    }
  }
}

// Navbar Background on Scroll
class NavbarScrollEffect {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.terminalHeader = document.querySelector('.terminal-header');
    this.backToTop = document.getElementById('backToTop');
    this.lastScrollY = 0;
    this.scrollThreshold = 100;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const currentScrollY = window.pageYOffset;
    
    // Hide/show navbar and terminal header based on scroll direction
    if (currentScrollY > this.scrollThreshold) {
      if (currentScrollY > this.lastScrollY) {
        // Scrolling down - hide navbar and terminal header
        this.navbar.classList.add('hidden');
        if (this.terminalHeader) {
          this.terminalHeader.classList.add('hidden');
        }
      } else {
        // Scrolling up - show navbar and terminal header
        this.navbar.classList.remove('hidden');
        if (this.terminalHeader) {
          this.terminalHeader.classList.remove('hidden');
        }
      }
    } else {
      // Near top - always show navbar and terminal header
      this.navbar.classList.remove('hidden');
      if (this.terminalHeader) {
        this.terminalHeader.classList.remove('hidden');
      }
    }
    
    // Show/hide back to top button
    if (currentScrollY > 300) {
      this.backToTop.classList.add('visible');
    } else {
      this.backToTop.classList.remove('visible');
    }
    
    // Update navbar background
    if (currentScrollY > 100) {
      this.navbar.style.background = 'rgba(22, 27, 34, 0.98)';
      this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
      this.navbar.style.background = '';
      this.navbar.style.boxShadow = 'none';
    }
    
    this.lastScrollY = currentScrollY;
  }
}

// Back to Top Functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Feature Cards Hover Effect
class FeatureCardEffects {
  constructor() {
    this.featureCards = document.querySelectorAll('.feature-card');
    this.gameCards = document.querySelectorAll('.game-card');
    this.init();
  }

  init() {
    this.bindFeatureCardEvents();
    this.bindGameCardEvents();
  }

  bindFeatureCardEvents() {
    this.featureCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  bindGameCardEvents() {
    this.gameCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }
}

// Pricing Card Selection
class PricingCardSelection {
  constructor() {
    this.pricingCards = document.querySelectorAll('.pricing-card');
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.pricingCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all cards
        this.pricingCards.forEach(c => c.classList.remove('selected'));
        
        // Add active class to clicked card
        card.classList.add('selected');
      });
    });
  }
}

// Console Easter Egg
class ConsoleEasterEgg {
  constructor() {
    this.init();
  }

  init() {
    this.displayConsoleMessage();
    this.bindKeyboardEvents();
  }

  displayConsoleMessage() {
    console.log(`
🛡️ SmartShield - AI-Powered Phishing Detection
===============================================

Welcome to the SmartShield console! 

This website showcases our advanced phishing detection system featuring:
- AI-powered threat detection
- Interactive training games
- Real-time browser protection
- Educational content for Omani organizations

Built with modern web technologies and security best practices.

Training Games Available:
- Phish or Safe? (Email classification)
- Spot the Red Flag (Hotspot detection)
- Phishroom Escape (Narrative puzzle)

Theme: ${document.documentElement.getAttribute('data-theme')}
Version: 2.0.1

For more information, visit: https://smartshield.ai
    `);
  }

  bindKeyboardEvents() {
    let konamiCode = [];
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];

    document.addEventListener('keydown', (e) => {
      konamiCode.push(e.code);
      if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
      }

      if (konamiCode.join(',') === konamiSequence.join(',')) {
        this.activateEasterEgg();
        konamiCode = [];
      }
    });
  }

  activateEasterEgg() {
    console.log('🎮 Konami Code activated! Matrix mode enabled!');
    
    // Add matrix rain effect to hero section
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      new MatrixRain(heroBackground);
    }
  }
}

// Performance Optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
    this.optimizeAnimations();
  }

  lazyLoadImages() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.body.classList.add('reduced-motion');
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  new ThemeManager();
  new MobileNavigation();
  new SmoothScrolling();
  new AnimationObserver();
  new FormHandler();
  new ParallaxEffect();
  new NavbarScrollEffect();
  new FeatureCardEffects();
  new PricingCardSelection();
  new ConsoleEasterEgg();
  new PerformanceOptimizer();

  // Initialize typing animation for hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      new TypeWriter(heroTitle, originalText, 50).start();
    }, 500);
  }

  // Initialize glitch effect for logo
  const logoText = document.querySelector('.logo-text');
  if (logoText) {
    const glitchEffect = new GlitchEffect(logoText);
    setInterval(() => {
      if (Math.random() < 0.1) {
        glitchEffect.start();
      }
    }, 5000);
  }

  // Add particle system to hero section
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground) {
    new ParticleSystem(heroBackground);
  }
});

// Add CSS for selected pricing card
const style = document.createElement('style');
style.textContent = `
  .pricing-card.selected {
    border-color: var(--border-accent);
    transform: scale(1.05);
    box-shadow: var(--glow-accent);
  }
  
  .pricing-card.selected .btn {
    background: var(--text-accent);
    color: white;
  }

  .reduced-motion * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
`;
document.head.appendChild(style);