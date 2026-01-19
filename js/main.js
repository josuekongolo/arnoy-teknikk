/**
 * Arnøy Teknikk - Main JavaScript
 * Elektriker i Hafrsfjord og Stavanger
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const navOverlay = document.getElementById('nav-overlay');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navClose = document.getElementById('nav-close');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        if (!mobileToggle || !nav || !navOverlay) return;

        // Open mobile menu
        mobileToggle.addEventListener('click', function() {
            nav.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close mobile menu
        function closeNav() {
            nav.classList.remove('active');
            navOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (navClose) {
            navClose.addEventListener('click', closeNav);
        }

        navOverlay.addEventListener('click', closeNav);

        // Close on nav link click
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', closeNav);
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                closeNav();
            }
        });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow when scrolled
            if (currentScroll > 10) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Contact Form Handler
     */
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Hide any existing messages
            if (formSuccess) formSuccess.classList.remove('show');
            if (formError) formError.classList.remove('show');

            // Get form data
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                phone: contactForm.querySelector('#phone').value,
                address: contactForm.querySelector('#address').value,
                serviceType: contactForm.querySelector('#service-type').value,
                description: contactForm.querySelector('#description').value,
                siteVisit: contactForm.querySelector('#site-visit').checked
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.serviceType || !formData.description) {
                if (formError) {
                    formError.innerHTML = '<strong>Vennligst fyll ut alle obligatoriske felt.</strong>';
                    formError.classList.add('show');
                }
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                if (formError) {
                    formError.innerHTML = '<strong>Vennligst oppgi en gyldig e-postadresse.</strong>';
                    formError.classList.add('show');
                }
                return;
            }

            // Get submit button and show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> Sender...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                // In production, you would send this to your backend or email service
                await new Promise(resolve => setTimeout(resolve, 1500));

                // For demo purposes, we'll show success
                // In production, you'd check the actual response

                // Show success message
                if (formSuccess) {
                    formSuccess.classList.add('show');
                }

                // Reset form
                contactForm.reset();

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Log form data (for development)
                console.log('Form submitted:', formData);

            } catch (error) {
                console.error('Form submission error:', error);
                if (formError) {
                    formError.innerHTML = '<strong>Noe gikk galt.</strong><br>Vennligst prøv igjen eller kontakt oss direkte på telefon.';
                    formError.classList.add('show');
                }
            } finally {
                // Restore button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        // Real-time validation feedback
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                validateInput(this);
            });

            input.addEventListener('input', function() {
                // Remove error state on input
                this.style.borderColor = '';
            });
        });
    }

    /**
     * Validate individual input
     */
    function validateInput(input) {
        const value = input.value.trim();

        if (input.required && !value) {
            input.style.borderColor = 'var(--color-error)';
            return false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.style.borderColor = 'var(--color-error)';
                return false;
            }
        }

        input.style.borderColor = 'var(--color-accent)';
        return true;
    }

    /**
     * Scroll Reveal Animation
     */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        if (revealElements.length === 0) return;

        const revealOnScroll = function() {
            revealElements.forEach(function(element) {
                const windowHeight = window.innerHeight;
                const elementTop = element.getBoundingClientRect().top;
                const revealPoint = 150;

                if (elementTop < windowHeight - revealPoint) {
                    element.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll, { passive: true });
        revealOnScroll(); // Check on load
    }

    /**
     * Service Cards Animation
     */
    function initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');

        if (serviceCards.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        serviceCards.forEach(function(card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    }

    /**
     * Click to Call (Mobile)
     */
    function initClickToCall() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

        phoneLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Track phone call clicks (can be integrated with analytics)
                console.log('Phone call initiated');
            });
        });
    }

    /**
     * Lazy Load Images
     */
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Add CSS animation for spinner
     */
    function addSpinnerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .spin {
                animation: spin 1s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize all functionality
     */
    function init() {
        addSpinnerStyles();
        initMobileNav();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initScrollReveal();
        initServiceCards();
        initClickToCall();
        initLazyLoad();

        // Log initialization
        console.log('Arnøy Teknikk website initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
