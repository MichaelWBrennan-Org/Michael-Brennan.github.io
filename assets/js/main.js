/**
 * Main JavaScript file for Michael Brennan's portfolio website
 * Handles navigation, smooth scrolling, form interactions, and animations
 */

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeContactForm();
    initializeScrollSpy();
    initializeParallax();
});

/**
 * Initialize mobile navigation functionality
 */
function initializeNavigation() {
    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.querySelector('.navbar');
                const offset = navbar ? navbar.offsetHeight : 0;
                
                const targetPosition = targetElement.offsetTop - offset - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .stat-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
}

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // TODO: Implement actual form submission to backend service
        // Replace this placeholder with real form submission logic
        showFormFeedback('error', 'Form submission not yet implemented. Please contact directly via email.');
    });
}

/**
 * Validate contact form data
 */
function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters).');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address.');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters).');
    }
    
    if (errors.length > 0) {
        showFormFeedback('error', errors.join(' '));
        return false;
    }
    
    return true;
}

/**
 * Check if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form feedback message
 */
function showFormFeedback(type, message) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback--${type}`;
    feedback.innerHTML = `
        <div class="form-feedback__content">
            <svg class="form-feedback__icon" viewBox="0 0 20 20" fill="currentColor">
                ${type === 'success' 
                    ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>'
                    : '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>'
                }
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    feedback.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        ${type === 'success' 
            ? 'background: #10b981; color: white;'
            : 'background: #ef4444; color: white;'
        }
    `;
    
    feedback.querySelector('.form-feedback__content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    feedback.querySelector('.form-feedback__icon').style.cssText = `
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    `;
    
    document.body.appendChild(feedback);
    
    // Animate in
    requestAnimationFrame(() => {
        feedback.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        feedback.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 5000);
}

/**
 * Initialize scroll spy for navigation highlighting
 */
function initializeScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('nav-link--active');
                });
                
                // Add active class to current nav link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('nav-link--active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize parallax effects
 */
function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.hero-image');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    // Allow keyboard navigation for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    
    interactiveElements.forEach(element => {
        // Skip if already has tabindex
        if (element.getAttribute('tabindex')) return;
        
        // Add tabindex for proper keyboard navigation
        if (element.tagName.toLowerCase() === 'a' && element.getAttribute('href') === '#') {
            element.setAttribute('tabindex', '0');
        }
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', initializeKeyboardNavigation);

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
}, 250));

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for additional interactive states
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .animate-spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .nav-link--active {
        color: var(--primary-color) !important;
    }
    
    .nav-link--active::after {
        width: 100% !important;
    }
    
    .form-feedback {
        animation: slideInRight 0.3s ease-out;
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .loaded .hero-content,
    .loaded .hero-image {
        animation: fadeInUp 0.8s ease-out;
    }
    
    .loaded .hero-image {
        animation-delay: 0.2s;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .animate-on-scroll,
        .hero-content,
        .hero-image,
        .code-line {
            animation: none !important;
            transition: none !important;
        }
        
        html {
            scroll-behavior: auto;
        }
        
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;

document.head.appendChild(additionalStyles);