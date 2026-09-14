/**
 * Dashboard - Enhanced Version
 * Sistema de Gestión de Residuos - SENA
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // INITIALIZATION
    // ========================================
    initParticles();
    initSidebar();
    initTopbar();
    initCounters();
    initGreeting();
    initAnimations();
    initInteractivity();
    initToast();

    // ========================================
    // BACKGROUND PARTICLES
    // ========================================
    function initParticles() {
        const container = document.getElementById('bgParticles');
        if (!container) return;

        const particleCount = 40;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'bg-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${15 + Math.random() * 25}s`;
            particle.style.width = `${2 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            particle.style.opacity = `${0.2 + Math.random() * 0.4}`;
            container.appendChild(particle);
        }
    }

    // ========================================
    // SIDEBAR
    // ========================================
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

        // Restore state
        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            sidebar.classList.add('collapsed');
        }

        // Nav links
        const navLinks = document.querySelectorAll('.sidebar__link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#') {
                    e.preventDefault();
                }
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Add ripple effect
                createRipple(e, link);
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuBtn?.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        });
    }

    // ========================================
    // TOPBAR
    // ========================================
    function initTopbar() {
        const searchInput = document.querySelector('.topbar__search input');
        
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });

            // Keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }

        // Action buttons
        const actionBtns = document.querySelectorAll('.topbar__action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                showToast('Notifications', 'You have new notifications');
            });
        });
    }

    // ========================================
    // COUNTER ANIMATION
    // ========================================
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
                    if (target) {
                        animateCounter(entry.target, target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));

        // Animate bars
        const bars = document.querySelectorAll('.stat-card__bar-fill, .container-card__bar-fill');
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 200);
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        bars.forEach(bar => barObserver.observe(bar));
    }

    // ========================================
    // GREETING
    // ========================================
    function initGreeting() {
        const greetingEl = document.getElementById('greeting');
        if (!greetingEl) return;

        const hour = new Date().getHours();
        let greeting = 'Good Morning';
        
        if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon';
        } else if (hour >= 17) {
            greeting = 'Good Evening';
        }
        
        greetingEl.textContent = greeting;
    }

    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ========================================
    // INTERACTIVITY
    // ========================================
    function initInteractivity() {
        // Chart filter buttons
        const chartActions = document.querySelectorAll('.chart-card__action');
        chartActions.forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.closest('.chart-card__actions');
                parent.querySelectorAll('.chart-card__action').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                showToast('Chart Updated', 'Data has been refreshed');
            });
        });

        // Action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('.action-card__title').textContent;
                createRipple(event, card);
                showToast('Action', `${title} - Coming soon`);
            });
        });

        // Container buttons
        const containerBtns = document.querySelectorAll('.container-card__btn');
        containerBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.container-card');
                const title = card.querySelector('h4').textContent;
                showToast('Scheduled', `${title} collection scheduled`);
            });
        });

        // Gallery items
        const galleryItems = document.querySelectorAll('.gallery-card__item');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('.gallery-card__title').textContent;
                showToast('Facility', `Viewing ${title}`);
            });
        });

        // Activity items
        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('.activity-item__title').textContent;
                showToast('Activity', title);
            });
        });

        // Tilt effect on stat cards
        const statCards = document.querySelectorAll('.stat-card[data-tilt]');
        statCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    // ========================================
    // TOAST NOTIFICATIONS
    // ========================================
    function initToast() {
        const toast = document.getElementById('toast');
        const toastClose = document.getElementById('toastClose');

        if (toastClose) {
            toastClose.addEventListener('click', () => {
                toast.classList.remove('show');
            });
        }
    }

    function showToast(title, message) {
        const toast = document.getElementById('toast');
        const toastTitle = toast.querySelector('.toast__title');
        const toastMessage = toast.querySelector('.toast__message');

        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ========================================
    // RIPPLE EFFECT
    // ========================================
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
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // KEYBOARD SHORTCUTS
    // ========================================
    document.addEventListener('keydown', (e) => {
        // Escape to close sidebar on mobile
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.remove('mobile-open');
        }
    });

    // ========================================
    // CONSOLE BRANDING
    // ========================================
    console.log(
        '%c🌱 SENA Green System %c Dashboard v2.0',
        'background: #10B981; color: white; padding: 8px 12px; border-radius: 4px 0 0 4px; font-weight: bold;',
        'background: #1F2937; color: #10B981; padding: 8px 12px; border-radius: 0 4px 4px 0;'
    );
});
