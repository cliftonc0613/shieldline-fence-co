/**
 * Shieldline Fence Co. - Interactive Scripts
 * Handles navigation, scrolling, animations, and form interactions
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
        
        // Setup event listeners
        setupNavbar();
        setupMobileMenu();
        setupSmoothScrolling();
        setupFormHandler();
        setupScrollAnimations();
        
        // Run initial check
        handleNavbarScroll();
        
        console.log('Shieldline Fence Co. site initialized');
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
                        
                        // Update active link
                        updateActiveLink(href);
                    }
                }
            });
        });
    }
    
    function updateActiveLink(href) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === href) {
                link.classList.add('active');
            }
        });
    }
    
    // === SCROLL ANIMATIONS ===
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
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
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Add animation class styles
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
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
            
            // Validate phone format
            const phoneRegex = /^[\d\s\-\(\)]+$/;
            if (!phoneRegex.test(data.phone)) {
                showFormMessage('Please enter a valid phone number.', 'error');
                return;
            }
            
            // Show success message
            showFormMessage('Thank you! We\'ll contact you within 24 hours.', 'success');
            contactForm.reset();
            
            // In production, you would send this to your backend or email service
            // Example: sendToServer(data);
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
        messageEl.style.cssText = `
            padding: 14px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
            text-align: center;
            ${type === 'success' 
                ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' 
                : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        
        contactForm.insertBefore(messageEl, contactForm.firstChild);
        
        // Auto-remove success messages
        if (type === 'success') {
            setTimeout(() => {
                messageEl.style.opacity = '0';
                messageEl.style.transition = 'opacity 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            }, 5000);
        }
    }
    
    // === ACTIVE SECTION HIGHLIGHTING ===
    function setupActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = '#' + section.getAttribute('id');
                }
            });
            
            if (current) {
                updateActiveLink(current);
            }
        }, { passive: true });
    }
    
    // === LAZY LOADING ENHANCEMENT ===
    function setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
            });
        }
    }
    
    // === HERO PARALLAX EFFECT (subtle) ===
    function setupParallax() {
        const heroBg = document.querySelector('.hero-bg');
        if (!heroBg) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.4;
            
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, { passive: true });
    }
    
    // === INIT ADDITIONAL FEATURES ===
    setupActiveSection();
    setupLazyLoading();
    setupParallax();
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
