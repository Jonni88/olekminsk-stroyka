// Main JavaScript for "Prochny Dom" Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
                navLinks.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    top: 80px;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 24px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    z-index: 999;
                `;
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
                navLinks.style.display = 'none';
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navLinks.style.display = 'none';
                    menuToggle.querySelector('i').classList.remove('ph-x');
                    menuToggle.querySelector('i').classList.add('ph-list');
                }
            }
        });
    });
    
    // Services Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active to current
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Phone input mask
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '7' || value[0] === '8') {
                    value = value.substring(1);
                }
                
                let formattedValue = '+7';
                
                if (value.length > 0) {
                    formattedValue += ' (' + value.substring(0, 3);
                }
                if (value.length >= 3) {
                    formattedValue += ') ' + value.substring(3, 6);
                }
                if (value.length >= 6) {
                    formattedValue += '-' + value.substring(6, 8);
                }
                if (value.length >= 8) {
                    formattedValue += '-' + value.substring(8, 10);
                }
                
                e.target.value = formattedValue;
            }
        });
    });
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validation
            if (!data.name || !data.phone || !data['service-type']) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Simulate submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="ph-fill ph-spinner animate-spin"></i> Отправка...';
            
            setTimeout(() => {
                const serviceTypes = {
                    'repair': 'Ремонт квартиры/дома',
                    'house': 'Строительство дома',
                    'banya': 'Строительство бани',
                    'venets': 'Замена венцов',
                    'other': 'Другое'
                };
                
                const message = `📋 Новая заявка с сайта «Прочный дом»%0A%0A` +
                    `👤 Имя: ${data.name}%0A` +
                    `📞 Телефон: ${data.phone}%0A` +
                    `🔨 Услуга: ${serviceTypes[data['service-type']] || data['service-type']}%0A` +
                    (data.message ? `📝 Сообщение: ${data.message}%0A` : '') +
                    `%0AПерезвоните клиенту!`;
                
                const whatsappUrl = `https://wa.me/79148224452?text=${encodeURIComponent(message)}`;
                
                showNotification('Заявка отправлена! Перенаправляем в WhatsApp...', 'success');
                
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }, 1500);
            }, 1000);
        });
    }
    
    // Callback Form
    const callbackForm = document.getElementById('callbackForm');
    
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(callbackForm);
            const name = formData.get('callback-name');
            const phone = formData.get('callback-phone');
            
            if (!name || !phone) {
                showNotification('Заполните имя и телефон', 'error');
                return;
            }
            
            const message = `📞 Заказ обратного звонка%0A%0A` +
                `👤 Имя: ${name}%0A` +
                `📞 Телефон: ${phone}%0A` +
                `%0AПерезвоните!`;
            
            window.open(`https://wa.me/79148224452?text=${encodeURIComponent(message)}`, '_blank');
            
            hideCallbackModal();
            callbackForm.reset();
            showNotification('Заявка на звонок отправлена!', 'success');
        });
    }
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .benefit-card, .portfolio-item, .workflow-step').forEach(el => {
        el.classList.add('animate-fade-in');
        observer.observe(el);
    });
});

// Modal functions
function showCallbackModal() {
    const modal = document.getElementById('callbackModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCallbackModal() {
    const modal = document.getElementById('callbackModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideCallbackModal();
    }
});

// Notification function
function showNotification(text, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="ph-fill ${type === 'success' ? 'ph-check-circle' : 'ph-warning-circle'}"></i>
        <span>${text}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#5D8C3A' : '#C75B39'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideDown 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes fadeOutUp {
            from { opacity: 1; transform: translateX(-50%) translateY(0); }
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOutUp 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
