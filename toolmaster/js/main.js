// ============================================
// ToolMaster - Main JavaScript
// ============================================

// === Preloader ===
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 500);
});

// === Header Scroll Effect ===
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// === Mobile Menu ===
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

// === Shopping Cart ===
let cart = JSON.parse(localStorage.getItem('toolmaster_cart')) || [];
const cartCount = document.getElementById('cartCount');

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 200);
    }
}

updateCartCount();

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const productId = this.dataset.id;
        const productCard = this.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title a').textContent;
        const productPrice = productCard.querySelector('.price-current').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                title: productTitle,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }
        
        localStorage.setItem('toolmaster_cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show notification
        showNotification('Товар добавлен в корзину!', 'success');
        
        // Animate button
        this.style.transform = 'scale(1.2) rotate(15deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
});

// === Notifications ===
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Styles for notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success' ? '#00b894' : '#0984e3',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to style
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// === Fade In Animation on Scroll ===
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => fadeInObserver.observe(el));

// === Product Wishlist ===
document.querySelectorAll('.product-action-btn').forEach(btn => {
    if (btn.querySelector('.fa-heart')) {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.background = '#ff6b35';
                this.style.color = 'white';
                showNotification('Добавлено в избранное!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.background = 'white';
                this.style.color = '#2d3436';
                showNotification('Удалено из избранного', 'info');
            }
        });
    }
});

// === Newsletter Form ===
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email) {
            showNotification('Спасибо за подписку! Мы будем держать вас в курсе.', 'success');
            this.querySelector('input').value = '';
        }
    });
}

// === Smooth Scroll ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === Category Cards Click ===
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.querySelector('.category-title').textContent;
        showNotification(`Переход в категорию: ${category}`, 'info');
    });
});

// === Product Card Click ===
document.querySelectorAll('.product-title a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const product = this.textContent;
        showNotification(`Открытие товара: ${product.substring(0, 30)}...`, 'info');
    });
});

// === Counter Animation ===
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const value = parseInt(stat.textContent.replace(/\D/g, ''));
                if (value) {
                    animateCounter(stat, value);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// === Search Functionality ===
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            showNotification(`Поиск: "${query}"`, 'info');
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                showNotification(`Поиск: "${query}"`, 'info');
            }
        }
    });
}

// === Cart Button Click ===
const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Корзина пуста. Добавьте товары!', 'info');
        } else {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            showNotification(`В корзине ${totalItems} товаров`, 'success');
        }
    });
}

// === Parallax Effect on Hero ===
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.hero-content');
        const heroImage = hero.querySelector('.hero-image');
        
        if (heroContent && scrolled < 800) {
            heroContent.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
        if (heroImage && scrolled < 800) {
            heroImage.style.transform = `translateY(${scrolled * 0.05}px)`;
        }
    });
}

// === Typing Effect for Hero Badge ===
const heroBadge = document.querySelector('.hero-badge span');
if (heroBadge) {
    const text = heroBadge.textContent;
    heroBadge.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            heroBadge.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// === Product Image Hover Effect ===
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.querySelector('.product-image img').style.filter = 'brightness(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.querySelector('.product-image img').style.filter = 'brightness(1)';
    });
});

// === Initialize ===
console.log('🔧 ToolMaster - Ready!');
console.log('👨‍💻 Created by: Самарканова Сезим, Мондошов Азирет, Болотбеков Алибек, Нуртилек');