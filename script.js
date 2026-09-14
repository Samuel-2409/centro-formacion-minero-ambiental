/**
 * Dashboard - Sistema de Gestión de Residuos
 * Centro de Formación Minero Ambiental - SENA
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // SIDEBAR TOGGLE
    // ========================================
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuBtn = document.getElementById('menuBtn');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });

    // ========================================
    // CURRENT DATE
    // ========================================
    const currentDateEl = document.getElementById('currentDate');
    if (currentDateEl) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const today = new Date();
        currentDateEl.textContent = today.toLocaleDateString('es-CO', options);
    }

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    const animateCounter = (element, target, duration = 1500) => {
        const start = 0;
        const startTime = performance.now();
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(start + (target - start) * easedProgress);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // Observe stat values
    const statValues = document.querySelectorAll('.stat-card__value[data-target]');
    let countersAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statValues.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (target) {
                        animateCounter(stat, target);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => statsObserver.observe(stat));

    // ========================================
    // SIDEBAR NAVIGATION
    // ========================================
    const sidebarLinks = document.querySelectorAll('.sidebar__link');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default for non-external links
            if (!link.href.includes('http') && !link.href.includes('target')) {
                e.preventDefault();
            }
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
        });
    });

    // ========================================
    // ACTION BUTTONS
    // ========================================
    const actionBtns = document.querySelectorAll('.action-btn');

    actionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.4);
                width: 20px;
                height: 20px;
                transform: scale(0);
                animation: ripple 0.6s linear;
            `;
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
            
            // Show notification
            showNotification('Acción ejecutada correctamente');
        });
    });

    // ========================================
    // NOTIFICATION SYSTEM
    // ========================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: ${type === 'success' ? '#16A34A' : '#DC2626'};
            color: white;
            padding: 16px 24px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
            font-size: 0.9rem;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // BAR CHART TOOLTIPS
    // ========================================
    const bars = document.querySelectorAll('.bar-chart__bar');
    
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', () => {
            bar.style.transform = 'scaleY(1.02)';
            bar.style.transformOrigin = 'bottom';
        });
        
        bar.addEventListener('mouseleave', () => {
            bar.style.transform = 'scaleY(1)';
        });
    });

    // ========================================
    // CONTAINER STATUS ANIMATION
    // ========================================
    const containerFills = document.querySelectorAll('.container-status__fill');
    
    const containerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.style.width;
                fill.style.width = '0';
                setTimeout(() => {
                    fill.style.width = width;
                }, 100);
            }
        });
    }, { threshold: 0.5 });

    containerFills.forEach(fill => containerObserver.observe(fill));

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    const searchInput = document.querySelector('.topbar__search input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    showNotification(`Buscando: "${query}"`);
                    searchInput.value = '';
                }
            }
        });
    }

    // ========================================
    // NOTIFICATION BELL
    // ========================================
    const notifBell = document.querySelector('.topbar__notifications');
    
    if (notifBell) {
        notifBell.addEventListener('click', () => {
            showNotification('Tienes 3 notificaciones pendientes');
        });
    }

    // ========================================
    // CHART FILTER
    // ========================================
    const chartFilters = document.querySelectorAll('.chart-card__filter');
    
    chartFilters.forEach(filter => {
        filter.addEventListener('change', () => {
            showNotification('Datos actualizados');
        });
    });

    // ========================================
    // ACTIVITY ITEMS CLICK
    // ========================================
    const activityItems = document.querySelectorAll('.activity-item');
    
    activityItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const title = item.querySelector('.activity-item__title').textContent;
            showNotification(`Detalle: ${title}`);
        });
        
        item.addEventListener('mouseenter', () => {
            item.style.background = '#F8FAFC';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
        });
    });

    // ========================================
    // AUTO-REFRESH SIMULATION
    // ========================================
    let lastUpdate = new Date();
    
    const updateTimestamp = () => {
        const updateEl = document.querySelector('.containers-card__update');
        if (updateEl) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            updateEl.textContent = `Última actualización: Hoy ${hours}:${minutes}`;
        }
    };

    // Update every 5 minutes (simulated)
    setInterval(updateTimestamp, 300000);

    // ========================================
    // KEYBOARD SHORTCUTS
    // ========================================
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
        
        // Escape to close sidebar on mobile
        if (e.key === 'Escape') {
            sidebar.classList.remove('mobile-open');
        }
    });

    console.log('Dashboard initialized successfully');
});
