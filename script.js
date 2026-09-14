/**
 * SENA Green System - Ultra Dashboard
 * Advanced Interactive Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLoader();
    initParticleCanvas();
    initSidebar();
    initTopbar();
    initCounters();
    initProgressBars();
    initChartBars();
    initGreeting();
    initInteractivity();
    initScrollAnimations();
    initToast();
});

/* ========================================
   LOADER
   ======================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.opacity = '1';
    }, 1800);
}

/* ========================================
   PARTICLE CANVAS
   ======================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = ['#10B981', '#3B82F6', '#A855F7'][Math.floor(Math.random() * 3)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function init() {
        resize();
        particles = [];
        const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#10B981';
                    ctx.globalAlpha = 0.05 * (1 - dist / 150);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        init();
        animate();
    });
    
    init();
    animate();
}

/* ========================================
   SIDEBAR
   ======================================== */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuBtn = document.getElementById('menuBtn');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
    }
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
    
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        sidebar.classList.add('collapsed');
    }
    
    document.querySelectorAll('.sidebar__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            createRipple(e, link);
        });
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuBtn?.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });
}

/* ========================================
   TOPBAR
   ======================================== */
function initTopbar() {
    const searchInput = document.querySelector('.topbar__search input');
    
    if (searchInput) {
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }
    
    document.querySelectorAll('.topbar__action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('Notifications', 'You have 5 new notifications');
        });
    });
}

/* ========================================
   COUNTERS
   ======================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-card__value[data-target]');
    
    const animateCounter = (el, target, duration = 2000) => {
        const start = performance.now();
        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
        
        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(target * easeOutQuart(progress));
            el.textContent = value.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(update);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                if (target) animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

/* ========================================
   PROGRESS BARS
   ======================================== */
function initProgressBars() {
    const bars = document.querySelectorAll('[data-width]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.dataset.width;
                setTimeout(() => {
                    entry.target.style.width = `${width}%`;
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    bars.forEach(bar => observer.observe(bar));
}

/* ========================================
   CHART BARS
   ======================================== */
function initChartBars() {
    const bars = document.querySelectorAll('.analytics-chart__bar');
    const values = Array.from(bars).map(bar => parseInt(bar.dataset.value));
    const maxValue = Math.max(...values);
    
    bars.forEach(bar => {
        const value = bar.dataset.value;
        const color = bar.dataset.color;
        bar.style.height = `${(value / maxValue) * 100}%`;
        bar.style.background = `linear-gradient(180deg, ${color}, ${color}88)`;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const height = bar.style.height;
                bar.style.height = '0';
                setTimeout(() => {
                    bar.style.height = height;
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    
    bars.forEach(bar => observer.observe(bar));
}

/* ========================================
   GREETING
   ======================================== */
function initGreeting() {
    // Already handled in HTML
}

/* ========================================
   INTERACTIVITY
   ======================================== */
function initInteractivity() {
    // Chart filter
    document.querySelectorAll('.card__action').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.card__actions').querySelectorAll('.card__action').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showToast('Updated', 'Chart data refreshed');
        });
    });
    
    // Action tiles
    document.querySelectorAll('.action-tile').forEach(tile => {
        tile.addEventListener('click', (e) => {
            createRipple(e, tile);
            const title = tile.querySelector('.action-tile__title').textContent;
            showToast('Action', `${title} - Coming soon`);
        });
    });
    
    // Container buttons
    document.querySelectorAll('.container-tile__btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = btn.closest('.container-tile').querySelector('h4').textContent;
            showToast('Scheduled', `${title} collection scheduled`);
        });
    });
    
    // Facility cards
    document.querySelectorAll('.facility-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h4').textContent;
            showToast('Facility', `Viewing ${title}`);
        });
    });
    
    // Activity items
    document.querySelectorAll('.activity-feed__item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('.activity-feed__title').textContent;
            showToast('Activity', title);
        });
    });
    
    // Stat card tilt effect
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/* ========================================
   TOAST
   ======================================== */
function initToast() {
    const toast = document.getElementById('toast');
    const closeBtn = toast?.querySelector('.toast__close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => toast.classList.remove('show'));
    }
}

function showToast(title, message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.querySelector('.toast__title').textContent = title;
    toast.querySelector('.toast__message').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ========================================
   RIPPLE EFFECT
   ======================================== */
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to { transform: scale(4); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* ========================================
   KEYBOARD SHORTCUTS
   ======================================== */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('sidebar')?.classList.remove('mobile-open');
    }
});

/* ========================================
   CONSOLE BRANDING
   ======================================== */
console.log(
    '%c🌿 SENA Green System %c Ultra Dashboard v3.0',
    'background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 12px 16px; border-radius: 8px 0 0 8px; font-weight: bold; font-size: 14px;',
    'background: #1F2937; color: #10B981; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 14px;'
);
