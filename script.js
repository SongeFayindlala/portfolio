/**
 * Portfolio Website — Scripts
 * Songeziwe Fayindlala
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initStatCounter();
    initSmoothScroll();
    initFooterYear();
});

/* ===== Typing Effect ===== */
function initTypingEffect() {
    const words = [
        'translating cyber risk',
        'securing business value',
        'building security ventures'
    ];
    const dynamicText = document.getElementById('dynamicText');
    if (!dynamicText) return;

    // Respect reduced motion: show a static phrase, no animation
    if (prefersReducedMotion) {
        dynamicText.textContent = words[0];
        return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            dynamicText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            dynamicText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1000);
}

/* ===== Navbar Scroll Effect ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let ticking = false;

    function updateNav() {
        // Add background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';
        const scrollPos = window.scrollY + 120;
        const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // At the very bottom of the page, highlight the last section
        if (atBottom && sections.length) {
            current = sections[sections.length - 1].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateNav);
        }
    }, { passive: true });

    // Run once on load (covers refreshing mid-page)
    updateNav();
}

/* ===== Mobile Menu ===== */
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    function setMenu(open) {
        toggle.classList.toggle('active', open);
        navLinks.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', () => {
        setMenu(!navLinks.classList.contains('open'));
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
            setMenu(false);
        }
    });

    // Close menu with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            setMenu(false);
            toggle.focus();
        }
    });
}

/* ===== Scroll Animations (Intersection Observer) ===== */
function initScrollAnimations() {
    if (prefersReducedMotion) return;

    const elements = document.querySelectorAll(
        '.skill-card, .project-card, .blog-card, .about-text, .contact-item'
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* ===== Contact Form (opens the visitor's email app, no backend needed) ===== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const subject = form.querySelector('#subject').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        const subjectLine = subject || `Portfolio message from ${name}`;
        const body = `${message}\n\nFrom: ${name} (${email})`;
        const mailto = `mailto:songeziwe.fayindlala@gmail.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
        showToast('Opening your email app to send the message.');
        form.reset();
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = 'success') {
    // Remove existing toasts
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto remove after animation
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 4000);
}

/* ===== Stat Counter Animation ===== */
function initStatCounter() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (!statNumbers.length) return;

    // Respect reduced motion: set final values immediately
    if (prefersReducedMotion) {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            stat.textContent = target + (target > 10 ? '+' : '');
        });
        return;
    }

    let animated = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    statNumbers.forEach(stat => animateCounter(stat));
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.5 }
    );

    // Observe the stats container
    const statsContainer = document.querySelector('.about-stats');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1800;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (target - startValue) * eased);

        element.textContent = current + (target > 10 ? '+' : '');

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + (target > 10 ? '+' : '');
        }
    }

    requestAnimationFrame(update);
}

/* ===== Smooth Scroll for Internal Links ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                });
            }
        });
    });
}

/* ===== Footer Year ===== */
function initFooterYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
}
