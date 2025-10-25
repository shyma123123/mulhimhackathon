// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate counters when statistics section is visible
            if (entry.target.classList.contains('statistics')) {
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    if (counter.textContent === '0') {
                        animateCounter(counter, target, 2000);
                    }
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements
    const animatedElements = [
        '.hero-content',
        '.hero-visual',
        '.feature-card',
        '.stat-card',
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
            observer.observe(element);
        });
    });

    // Observe sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            const requiredFields = contactForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '#e5e7eb';
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.background = '#10b981';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        contactForm.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (hero && heroVisual) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Typing Animation for Hero Title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 500);
    }
});

// Chart Animation
function animateChart() {
    const chartBars = document.querySelectorAll('.chart-bar');
    
    chartBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = `growUp 2s ease-out`;
        }, index * 200);
    });
}

// Trigger chart animation when dashboard preview is visible
const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateChart();
            dashboardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const dashboardPreview = document.querySelector('.dashboard-preview');
    if (dashboardPreview) {
        dashboardObserver.observe(dashboardPreview);
    }
});

// Loading Screen (Optional)
window.addEventListener('load', function() {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Feature Cards Hover Effect
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Pricing Card Selection
document.addEventListener('DOMContentLoaded', function() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            pricingCards.forEach(c => c.classList.remove('selected'));
            
            // Add active class to clicked card
            this.classList.add('selected');
        });
    });
});

// Add CSS for selected pricing card
const style = document.createElement('style');
style.textContent = `
    .pricing-card.selected {
        border-color: #2563eb;
        transform: scale(1.05);
        box-shadow: 0 20px 40px rgba(37, 99, 235, 0.2);
    }
    
    .pricing-card.selected .btn {
        background: #2563eb;
        color: #fff;
    }
`;
document.head.appendChild(style);

// Statistics Counter with Formatting
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Enhanced counter animation with formatting
function animateCounterWithFormat(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = formatNumber(Math.floor(start));
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = formatNumber(target);
        }
    }
    
    updateCounter();
}

// Update counter animation to use formatting
document.addEventListener('DOMContentLoaded', function() {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('statistics')) {
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    if (counter.textContent === '0') {
                        animateCounterWithFormat(counter, target, 2000);
                    }
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statisticsSection = document.querySelector('.statistics');
    if (statisticsSection) {
        statObserver.observe(statisticsSection);
    }
});

// Console Easter Egg
console.log(`
🛡️ SmartShield - AI-Powered Phishing Detection
===============================================

Welcome to the SmartShield console! 

This website showcases our advanced phishing detection system powered by:
- Google Gemini AI
- OpenAI GPT models
- Real-time browser protection
- Enterprise-grade security

Built with modern web technologies and security best practices.

For more information, visit: https://smartshield.ai
`);

// Performance Optimization
// Lazy load images when they come into view
document.addEventListener('DOMContentLoaded', function() {
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
});
