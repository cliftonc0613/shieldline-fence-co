/**
 * Shieldline Fence Co. - Interactive Scripts
 * Vanilla JavaScript for navigation, animations, and forms
 */

(function() {
    'use strict';
    
    // === DOM ELEMENTS ===
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');
    const currentYearSpan = document.getElementById('currentYear');
    
    // === INITIALIZATION ===
    function init() {
        // Set current year in footer
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
        
        // Setup event listeners and features
        setupNavbar();
        setupMobileMenu();
        setupSmoothScrolling();
        setupFormHandler();
        setupScrollAnimations();
        
        // Run initial check
        handleNavbarScroll();
        
        console.log('Shieldline Fence Co. site initialized successfully');
    }
    
    // === NAVBAR SCROLL EFFECT ===
    function setupNavbar() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            handleNavbarScroll();
            
            // Hide/show navbar on scroll direction
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }
    
    function handleNavbarScroll() {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // === MOBILE MENU ===
    function setupMobileMenu() {
        if (!mobileToggle) return;
        
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    function closeMobileMenu() {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // === SMOOTH SCROLLING ===
    function setupSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const navbarHeight = navbar.offsetHeight;
                        const targetPosition = targetSection.offsetTop - navbarHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        closeMobileMenu();
                    }
                }
            });
        });
    }
    
    // === SCROLL ANIMATIONS (Intersection Observer) ===
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for grid items
                    const delay = entry.target.classList.contains('service-card') ||
                                  entry.target.classList.contains('testimonial-card')
                        ? Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100
                        : 0;
                    
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, delay);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.service-card, .about-image, .about-content, .process-step, .testimonial-card, .contact-info, .contact-form-wrapper'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }
    
    // === CONTACT FORM HANDLER ===
    function setupFormHandler() {
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            if (!data.name || !data.phone || !data.service) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate phone format (basic check for digits)
            const phoneClean = data.phone.replace(/\D/g, '');
            if (phoneClean.length < 10) {
                showFormMessage('Please enter a valid phone number.', 'error');
                return;
            }
            
            // Show success message
            showFormMessage('Thank you! We\'ll contact you within 24 hours.', 'success');
            contactForm.reset();
            
            // In production, send to backend/email service
            console.log('Form submitted:', data);
        });
    }
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = 'form-message';
        messageEl.textContent = message;
        
        const successStyles = `
            background: linear-gradient(135deg, #D4A056 0%, #E8C482 100%);
            color: #3D3228;
            border: none;
        `;
        
        const errorStyles = `
            background: #FEE;
            color: #C33;
            border: 1px solid #FCC;
        `;
        
        messageEl.style.cssText = `
            padding: 16px 24px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
            text-align: center;
            ${type === 'success' ? successStyles : errorStyles}
        `;
        
        contactForm.insertBefore(messageEl, contactForm.firstChild);
        
        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageEl.style.opacity = '0';
                messageEl.style.transform = 'translateY(-10px)';
                messageEl.style.transition = 'all 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            }, 5000);
        }
    }
    
    // === ACTIVE SECTION HIGHLIGHTING ===
    function setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.pageYOffset + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = '#' + section.getAttribute('id');
                }
            });
            
            // Update active link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === current) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }
    
    // === HERO PARALLAX EFFECT ===
    function setupParallax() {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxSpeed = 0.3;
                    
                    if (scrolled < window.innerHeight) {
                        heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }
    
    // === LAZY LOADING ENHANCEMENT ===
    function setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '0';
                        entry.target.style.transition = 'opacity 0.5s ease';
                        
                        entry.target.addEventListener('load', () => {
                            entry.target.style.opacity = '1';
                        });
                        
                        imageObserver.unobserve(entry.target);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // === INIT ADDITIONAL FEATURES ===
    setupActiveSection();
    setupLazyLoading();
    setupParallax();
    
    // === RUN ON PAGE LOAD ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
