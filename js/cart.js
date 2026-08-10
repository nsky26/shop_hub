// Cart Management Engine

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, name, price, image) {
    let cart = getCart();
    const existing = cart.find(item => item.id == productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        // Find product details if missing
        if (!name || !price || !image) {
            const product = typeof getProductById === 'function' ? getProductById(productId) : null;
            if (product) {
                name = product.name;
                price = product.price;
                image = product.image;
            }
        }
        cart.push({
            id: productId,
            name: name || 'Product',
            price: parseFloat(price) || 0,
            image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
            quantity: 1
        });
    }

    saveCart(cart);
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id != productId);
    saveCart(cart);
    loadCartDisplay();
}

function updateQuantity(productId, change) {
    let cart = getCart();
    const item = cart.find(item => item.id == productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
            loadCartDisplay();
        }
    }
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElems = document.querySelectorAll('#cartCount');
    cartCountElems.forEach(el => el.textContent = totalItems);
}

function calculateCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
    const tax = subtotal * 0.08; // 8% sales tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
}

function loadCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-state" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-shopping-bag" style="font-size: 56px; color: var(--primary); margin-bottom: 20px;"></i>
                <h2>Your Shopping Cart is Empty</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">Explore our catalog to add top-rated products to your cart.</p>
                <a href="products.html" class="btn btn-primary btn-lg"><i class="fas fa-arrow-left"></i> Browse Catalog</a>
            </div>
        `;
        updateCartSummaryDisplay();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item-card glass-panel" style="display: flex; gap: 20px; align-items: center; padding: 16px; margin-bottom: 16px; border-radius: var(--radius-md);">
            <img src="${item.image}" alt="${item.name}" style="width: 90px; height: 90px; object-fit: cover; border-radius: var(--radius-sm);">
            <div style="flex: 1;">
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">${item.name}</h4>
                <p style="color: var(--primary); font-weight: 800; font-size: 18px;">$${item.price.toFixed(2)}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="updateQuantity('${item.id}', -1)" class="btn btn-secondary" style="padding: 6px 12px; border-radius: 6px;">-</button>
                <span style="font-weight: 700; min-width: 24px; text-align: center;">${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', 1)" class="btn btn-secondary" style="padding: 6px 12px; border-radius: 6px;">+</button>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="btn btn-ghost" style="color: #ef4444; font-size: 18px; cursor: pointer;" aria-label="Remove item">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');

    updateCartSummaryDisplay();
}

function updateCartSummaryDisplay() {
    const { subtotal, shipping, tax, total } = calculateCartTotals();

    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCartDisplay();

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                if (typeof showToast === 'function') showToast('Your cart is empty!', 'fa-exclamation-circle');
                return;
            }
            alert('🎉 Order Placed Successfully!\n\nThank you for testing ShopHub. Your 5-star order has been processed!');
            localStorage.removeItem('cart');
            updateCartCount();
            window.location.href = 'index.html';
        });
    }
});
