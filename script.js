// Mouse glow effect
document.addEventListener('mousemove', (e) => {
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: fixed;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent);
        pointer-events: none;
        left: ${e.clientX - 15}px;
        top: ${e.clientY - 15}px;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        animation: fadeOut 0.8s forwards;
    `;
    document.body.appendChild(glow);
    
    if (document.querySelectorAll('[style*="position: fixed"]').length > 50) {
        document.querySelectorAll('[style*="position: fixed"]')[0].remove();
    }
});

// Add animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.5); }
    }
`;
document.head.appendChild(style);

// Smooth scrolling with enhanced effect
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            this.style.color = '#60a5fa';
            setTimeout(() => this.style.color = '', 300);
        }
    });
});

// Intersection Observer for scroll animations with stagger effect
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotateZ(0deg)';
            }, index * 80);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.member-card, .project-card, .contact-item');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px) rotateZ(2deg)';
        card.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        observer.observe(card);
    });
});

// Hover ripple effect on buttons and cards
document.querySelectorAll('.btn-primary, .btn-secondary, .member-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: radial-gradient(circle, rgba(84, 134, 241, 0.24), transparent);
            border-radius: inherit;
            pointer-events: none;
            animation: ripple-out 0.6s ease-out;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Parallax effect on hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
});

// Counter animation for stats
const animateCounters = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        if (text === '∞') return;
        
        const target = parseInt(text);
        let current = 0;
        const increment = target / 30;
        
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(interval);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 50);
    });
};

window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-stats');
    if (hero && hero.getBoundingClientRect().top < window.innerHeight) {
        if (!hero.classList.contains('animated')) {
            hero.classList.add('animated');
            animateCounters();
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        const sections = ['home', 'about', 'projects', 'contact'];
        const currentUrl = window.location.hash || '#home';
        const current = sections.indexOf(currentUrl.slice(1));
        if (current < sections.length - 1) {
            window.location.hash = sections[current + 1];
        }
    }
});