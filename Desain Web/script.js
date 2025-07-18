// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initHeroVideo();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
    initScrollIndicator();
    initCounterAnimation();
    initGallery();
    initSocialLinks();
    initPartnerLogos();
    initPaymentMethods();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Hero video initialization
function initHeroVideo() {
    const video = document.getElementById('heroVideo');
    const fallback = document.querySelector('.hero-video-fallback');
    
    if (video) {
        video.addEventListener('loadeddata', function() {
            video.classList.add('loaded');
            if (fallback) {
                fallback.style.opacity = '0';
            }
        });
        
        video.addEventListener('error', function() {
            console.log('Video failed to load, using fallback image');
            video.style.display = 'none';
            if (fallback) {
                fallback.style.opacity = '1';
            }
        });
        
        // Add fallback timeout
        setTimeout(() => {
            if (!video.classList.contains('loaded')) {
                video.style.display = 'none';
                if (fallback) {
                    fallback.style.opacity = '1';
                }
            }
        }, 5000);
    }
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll indicator
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            document.getElementById('services').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.service-card, .payment-item, .stat-item, .gallery-item, .testimonial-card, .partner-card');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Gallery functionality
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.gallery-content h4').textContent;
            const description = this.querySelector('.gallery-content p').textContent;
            
            // You can add modal functionality here if needed
            console.log('Gallery item clicked:', title);
        });
    });
}

// Counter animation
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation function
function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const isTime = text.includes('/');
    
    if (isTime) {
        // Handle 24/7 case
        element.textContent = '24/7';
        return;
    }
    
    const target = parseInt(text);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + (hasPlus ? '+' : '') + (text.includes('%') ? '%' : '');
    }, 16);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const phone = formData.get('phone').trim();
            const service = formData.get('service');
            const message = formData.get('message').trim();
            
            // Validate form
            if (!validateForm(name, email, phone, service, message)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Mengirim...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Create WhatsApp message
                const whatsappMessage = createWhatsAppMessage(name, email, phone, service, message);
                
                // Open WhatsApp
                window.open(`https://wa.me/6288808532748?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
                
                // Reset form
                contactForm.reset();
                
                // Show success message
                showNotification('Pesan berhasil dikirim! Anda akan diarahkan ke WhatsApp.', 'success');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Form validation
function validateForm(name, email, phone, service, message) {
    if (!name || name.length < 2) {
        showNotification('Nama harus diisi minimal 2 karakter', 'error');
        return false;
    }
    
    // Email is optional, but if provided, must be valid
    if (email && !isValidEmail(email)) {
        showNotification('Format email tidak valid', 'error');
        return false;
    }
    
    if (!phone || phone.length < 10) {
        showNotification('Nomor telepon harus diisi minimal 10 digit', 'error');
        return false;
    }
    
    if (!service) {
        showNotification('Pilih layanan yang diinginkan', 'error');
        return false;
    }
    
    if (!message || message.length < 10) {
        showNotification('Pesan harus diisi minimal 10 karakter', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Create WhatsApp message
function createWhatsAppMessage(name, email, phone, service, message) {
    const emailLine = email ? `*Email:* ${email}` : '*Email:* (tidak disertakan)';
    
    return `*Pesan dari Website PT Tunas Global Solusi*

*Nama:* ${name}
${emailLine}
*Telepon:* ${phone}
*Layanan:* ${service}

*Pesan:*
${message}

---
Dikirim melalui website PT Tunas Global Solusi`;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Social media link handlers
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Analytics tracking can be added here
            console.log('Social link clicked:', this.href);
        });
    });
}

// Partner logo hover effects
function initPartnerLogos() {
    const partnerCards = document.querySelectorAll('.partner-card');
    
    partnerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Payment method interactions
function initPaymentMethods() {
    const paymentItems = document.querySelectorAll('.payment-item');
    
    paymentItems.forEach(item => {
        item.addEventListener('click', function() {
            const paymentName = this.querySelector('.payment-name').textContent;
            showNotification(`Anda memilih metode pembayaran: ${paymentName}`, 'info');
        });
    });
}

// Utility functions
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

// Initialize scroll-based animations with debounce
const debouncedScroll = debounce(() => {
    // Add any scroll-based functionality here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Handle window resize for responsive adjustments
window.addEventListener('resize', debounce(() => {
    // Add any resize-based functionality here
}, 250));
