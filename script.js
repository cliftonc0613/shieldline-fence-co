// Shieldline Fence Co. — Scripts
(function () {
    'use strict';

    // --- Sticky Nav ---
    const nav = document.getElementById('nav');
    const onScroll = () => nav && nav.classList.toggle('scrolled', scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile Toggle ---
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', links.classList.contains('open'));
        });
        links.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => {
                toggle.classList.remove('open');
                links.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            })
        );
    }

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) {
                e.preventDefault();
                const offset = nav ? nav.offsetHeight : 0;
                window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
            }
        });
    });

    // --- Scroll Reveal ---
    const els = document.querySelectorAll('.srv-card, .rev-card, .cta-card, .about-visual, .about-text, .sec-head, .rev-fb');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = (i % 4) * 80 + 'ms';
        observer.observe(el);
    });

    // --- Floating Mobile CTA ---
    const mobCta = document.getElementById('mob-cta');
    const hero = document.querySelector('.hero');
    if (mobCta && hero) {
        const ctaObs = new IntersectionObserver(([e]) => {
            mobCta.classList.toggle('visible', !e.isIntersecting);
        }, { threshold: 0 });
        ctaObs.observe(hero);
    }

    // --- Footer Year ---
    const yr = document.getElementById('yr');
    if (yr) yr.textContent = new Date().getFullYear();

})();
