// HAMBURGER TOGGLE
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.querySelector('.nav-links');

hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// ====== MENU DATA ======
const menuItems = [
    { id: 1, name: 'Jollof Rice & Chicken', price: 2500, category: 'rice', icon: '🍚', description: 'Smoky party-style jollof rice served with perfectly seasoned fried chicken' },
    { id: 2, name: 'Fried Rice & Turkey', price: 3000, category: 'rice', icon: '🍚', description: 'Nigerian-style fried rice loaded with vegetables, served with succulent turkey' },
    { id: 3, name: 'Pounded Yam & Egusi', price: 2800, category: 'swallow', icon: '🥣', description: 'Smooth pounded yam with rich egusi soup, assorted meat and stockfish' },
    { id: 4, name: 'Amala & Ewedu', price: 2200, category: 'swallow', icon: '🥣', description: 'Soft amala served with ewedu, gbegiri and stew with assorted meat' },
    { id: 5, name: 'Pepper Soup', price: 2000, category: 'soups', icon: '🍲', description: 'Spicy catfish or goat meat pepper soup, perfect for cold evenings' },
    { id: 6, name: 'Suya', price: 1500, category: 'grills', icon: '🍢', description: 'Smoky grilled beef skewers coated in spicy yaji, served with onions and tomatoes' },
    { id: 7, name: 'Moi Moi', price: 500, category: 'sides', icon: '🫘', description: 'Steamed bean pudding with eggs and fish, wrapped in banana leaves' },
    { id: 8, name: 'Puff Puff', price: 300, category: 'sides', icon: '🍩', description: 'Sweet golden fried dough balls, perfect as a snack or dessert' },
    { id: 9, name: 'Chapman', price: 800, category: 'drinks', icon: '🍹', description: 'Refreshing Nigerian cocktail with Fanta, Sprite, grenadine and fruit slices' },
    { id: 10, name: 'Zobo Drink', price: 500, category: 'drinks', icon: '🥤', description: 'Chilled hibiscus drink infused with ginger, pineapple and natural spices' },
    { id: 11, name: 'Asun', price: 2500, category: 'grills', icon: '🍖', description: 'Spicy smoked goat meat garnished with peppers and onions' },
    { id: 12, name: 'Semo & Ogbono', price: 2500, category: 'swallow', icon: '🥣', description: 'Smooth semolina served with draw ogbono soup and assorted meat' }
];

// ====== SHOPPING CART ======
let cart = [];

// Load cart from memory on page load
function loadCart() {
    const savedCart = JSON.parse(sessionStorage.getItem('zicoCart') || '[]');
    cart = savedCart;
    updateCartUI();
}

// Save cart to memory
function saveCart() {
    sessionStorage.setItem('zicoCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    const existingItem = cart.find(c => c.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${item.name} added to cart successfully`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty, please add to cart</div>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.icon} ${item.name}</div>
                <div class="cart-item-price">₦${item.price.toLocaleString()} each</div>
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
}

// Toggle cart modal
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderDetails = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    
    // Save order to memory
    const orders = JSON.parse(sessionStorage.getItem('zicoOrders') || '[]');
    const newOrder = {
        id: Date.now(),
        items: [...cart],
        total: total,
        date: new Date().toLocaleString(),
        status: 'Pending'
    };
    orders.push(newOrder);
    sessionStorage.setItem('zicoOrders', JSON.stringify(orders));
    
    alert(`Your order has been placed successfully!\n\nOrder Details:\n${orderDetails}\n\nTotal: ₦${total.toLocaleString()}\n\nOrder ID: ${newOrder.id}\n\nWe'll prepare your order right away!`);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// ====== MENU FILTERING ======
function filterMenu(category) {
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    loadMenu(category);
}

// Load menu items
function loadMenu(category = 'all') {
    const menuGrid = document.getElementById('menu-grid');
    const filtered = category === 'all' ? menuItems : menuItems.filter(item => item.category === category);
    
    menuGrid.innerHTML = filtered.map(item => `
        <div class="menu-item">
            <div class="menu-item-image">${item.icon}</div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="menu-item-desc">${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">₦${item.price.toLocaleString()}</span>
                    <button class="order-btn" onclick="addToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ====== CONTACT FORM ======
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        date: new Date().toLocaleString()
    };
    
    // Save to memory
    const messages = JSON.parse(sessionStorage.getItem('zicoMessages') || '[]');
    messages.push(data);
    sessionStorage.setItem('zicoMessages', JSON.stringify(messages));
    
    // Show success message
    const status = document.getElementById('form-status');
    status.className = 'success';
    status.textContent = 'Bambam Foodz received your message successfully! We\'ll get back to you soon.';
    
    // Reset form
    e.target.reset();
    
    // Clear status after 5 seconds
    setTimeout(() => {
        status.textContent = '';
        status.className = '';
    }, 5000);
}

// ====== NEWSLETTER ======
function handleNewsletter(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    
    // Save to memory
    const subscribers = JSON.parse(sessionStorage.getItem('zicoSubscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        sessionStorage.setItem('zicoSubscribers', JSON.stringify(subscribers));
        alert('Thank you for subscribing! You\'ll receive Bambams latest offers and updates.');
    } else {
        alert('You\'re already subscribed!');
    }
    
    e.target.reset();
}

// ====== NOTIFICATION ======
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ====== SMOOTH SCROLLING ======
document.addEventListener('DOMContentLoaded', () => {
    // Load initial data
    loadCart();
    loadMenu();
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 100) {
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
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('cart-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);