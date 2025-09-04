const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 1199,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        category: "smartphones",
        description: "Latest iPhone with A17 Pro chip and titanium design",
        rating: 4.8,
        reviews: 324
    },
    {
        id: 2,
        name: "MacBook Pro 16\"",
        price: 2499,
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
        category: "laptops",
        description: "Powerful laptop with M3 Max chip for professionals",
        rating: 4.9,
        reviews: 189
    },
    {
        id: 3,
        name: "AirPods Pro 2",
        price: 249,
        image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400",
        category: "headphones",
        description: "Premium wireless earbuds with active noise cancellation",
        rating: 4.7,
        reviews: 567
    },
    {
        id: 4,
        name: "Samsung Galaxy S24 Ultra",
        price: 1299,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        category: "smartphones",
        description: "Advanced Android phone with S Pen and AI features",
        rating: 4.6,
        reviews: 423
    },
    {
        id: 5,
        name: "Dell XPS 13",
        price: 1399,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        category: "laptops",
        description: "Ultra-portable laptop with InfinityEdge display",
        rating: 4.5,
        reviews: 298
    },
    {
        id: 6,
        name: "Magic Mouse 3",
        price: 129,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
        category: "accessories",
        description: "Wireless mouse with Multi-Touch surface",
        rating: 4.3,
        reviews: 156
    },
    {
        id: 7,
        name: "Sony WH-1000XM5",
        price: 399,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        category: "headphones",
        description: "Industry-leading noise canceling headphones",
        rating: 4.8,
        reviews: 678
    },
    {
        id: 8,
        name: "iPad Pro 12.9\"",
        price: 1099,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        category: "accessories",
        description: "Professional tablet with M2 chip and Liquid Retina display",
        rating: 4.7,
        reviews: 234
    }
];

let cart = [];
let wishlist = [];
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products);
    updateCartCount();
    initializeEventListeners();
    initializeAnimations();
});
function initializeEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    document.addEventListener('click', function(event) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartIcon = document.querySelector('.cart-icon');
        
        if (!cartSidebar.contains(event.target) && !cartIcon.contains(event.target) && cartSidebar.classList.contains('open')) {
            toggleCart();
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar.classList.contains('open')) {
                toggleCart();
            }
        }
    });
}
function initializeAnimations() {
    handleScrollAnimations();
    setTimeout(lazyLoadImages, 1000);
    addNavigationEffects();
    addFloatingAnimation();
    addPulseEffect();
}
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}
function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('slide-up');
        });
    }, 100);
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <button class="wishlist-btn" onclick="toggleWishlist(${product.id}, event)">
            <i class="fas fa-heart"></i>
        </button>
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                <span class="stars">${generateStars(product.rating)}</span>
                <span>(${product.reviews} reviews)</span>
            </div>
            <div class="product-price">$${product.price.toLocaleString()}</div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    return card;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}


function filterProducts(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    displayProducts(filteredProducts);
}
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`, 'success');
    animateAddToCart(productId);
}
function animateAddToCart(productId) {
    const button = event.target;
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = '#2ed573';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 1500);
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
    showNotification('Item removed from cart', 'info');
}
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            updateCartDisplay();
        }
    }
}
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    cartCountElement.textContent = totalItems;
    cartCountElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
        cartCountElement.style.transform = 'scale(1)';
    }, 200);
}
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        totalPrice.textContent = 'Total: $0.00';
        return;
    }
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span style="padding: 0 0.5rem; font-weight: bold;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="qty-btn" onclick="removeFromCart(${item.id})" style="margin-left: 1rem; color: #ff4757; border-color: #ff4757;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    totalPrice.textContent = `Total: $${total.toLocaleString()}`;
}
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
    updateCartDisplay();
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}
function toggleWishlist(productId, event) {
    event.stopPropagation();
    const product = products.find(p => p.id === productId);
    const index = wishlist.findIndex(item => item.id === productId);
    const wishlistBtn = event.target.closest('.wishlist-btn');
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`${product.name} removed from wishlist`, 'info');
        wishlistBtn.style.background = 'white';
        wishlistBtn.style.color = '#666';
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist!`, 'success');
        wishlistBtn.style.background = '#ff6b6b';
        wishlistBtn.style.color = 'white';
    }
}
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const checkoutBtn = event.target;
    const originalText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = '<div class="loading"></div> Processing...';
    checkoutBtn.disabled = true;
    setTimeout(() => {
        showNotification(`Order placed successfully! Total: $${total.toLocaleString()}`, 'success');
        cart = [];
        updateCartCount();
        updateCartDisplay();
        toggleCart();
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
        setTimeout(() => {
            showNotification('Order confirmation sent to your email!', 'info');
        }, 2000);
    }, 2000);
}
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    const colorMap = {
        success: '#2ed573',
        error: '#ff4757',
        info: '#3742fa'
    };
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colorMap[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${iconMap[type]}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.product-card, .section-title');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}
function lazyLoadImages() {
    const images = document.querySelectorAll('.product-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                const newImg = new Image();
                newImg.onload = function() {
                    img.src = this.src;
                    img.style.opacity = '1';
                };
                newImg.src = img.src;
                
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}
function addNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
}
function addFloatingAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        setInterval(() => {
            cartIcon.style.animation = 'float 2s ease-in-out infinite';
        }, 5000);
    }
}
function addPulseEffect() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        setInterval(() => {
            ctaButton.style.transform = 'scale(1.05)';
            setTimeout(() => {
                ctaButton.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
}
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
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}
function hideLoading(element, content) {
    element.innerHTML = content;
}
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.transform = `scaleX(${scrolled / 100})`;
    });
}
setTimeout(initScrollProgress, 1000);
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    showNotification(`Quick view for ${product.name} - Feature coming soon!`, 'info');
}
function addToCompare(productId) {
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} added to comparison - Feature coming soon!`, 'info');
}

function logPerformance() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
}
window.addEventListener('load', logPerformance);