document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--scrolled', window.scrollY > 50);
    }, { passive: true });

    // Mobile menu
    const menuBtn = document.getElementById('menuBtn');
    const mainNav = document.getElementById('mainNav');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => mainNav.classList.toggle('active'));
    }

    // Active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
                });
            }
        });
    }, { passive: true });

    // Hero particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'hero__particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 15}s`;
            p.style.animationDuration = `${10 + Math.random() * 20}s`;
            particlesContainer.appendChild(p);
        }
    }

    // Counter animation
    const animateCounter = (el, target, duration = 2000) => {
        const start = performance.now();
        const easeOutQuart = t => 1 - Math.pow(1 - t, 4);
        const update = now => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor(target * easeOutQuart(progress));
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        };
        requestAnimationFrame(update);
    };

    // Observe stat numbers
    const statNumbers = document.querySelectorAll('[data-target]');
    let animated = false;
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(el => {
                    const target = parseInt(el.getAttribute('data-target'));
                    if (target) animateCounter(el, target);
                });
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => observer.observe(el));

    // Back to top
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                if (mainNav.classList.contains('active')) mainNav.classList.remove('active');
            }
        });
    });

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado!';
                btn.style.background = '#10B981';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 2500);
            }, 1500);
        });
    }
});
