// Auth & Cart Engine with Order Form Validation

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
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
}

function loadCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="glass-panel" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-shopping-bag" style="font-size: 56px; color: var(--primary); margin-bottom: 20px;"></i>
                <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Your Shopping Cart is Empty</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">Explore our catalog to add top-rated products to your cart.</p>
                <a href="products.html" class="btn btn-primary btn-lg"><i class="fas fa-arrow-left"></i> Browse Catalog</a>
            </div>
        `;
        updateCartSummaryDisplay();
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="glass-panel" style="display: flex; gap: 20px; align-items: center; padding: 18px; margin-bottom: 16px; border-radius: var(--radius-md);">
            <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);">
            <div style="flex: 1;">
                <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 6px;">${item.name}</h4>
                <p style="color: var(--primary); font-weight: 900; font-size: 18px;">$${item.price.toFixed(2)}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="updateQuantity('${item.id}', -1)" class="btn btn-secondary" style="padding: 6px 12px; border-radius: 6px;">-</button>
                <span style="font-weight: 800; min-width: 24px; text-align: center;">${item.quantity}</span>
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

// User Authentication State Management
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
}

function updateAuthUI() {
    const user = getCurrentUser();
    const authNavGroup = document.getElementById('authNavGroup');

    if (authNavGroup) {
        if (user) {
            authNavGroup.innerHTML = `
                <div class="user-profile-badge" id="userProfileBtn" title="Click to logout">
                    <i class="fas fa-user-circle text-gradient"></i>
                    <span>${user.name.split(' ')[0]}</span>
                    <i class="fas fa-sign-out-alt" style="font-size: 12px; margin-left: 4px; opacity: 0.6;"></i>
                </div>
            `;
            const profileBtn = document.getElementById('userProfileBtn');
            if (profileBtn) {
                profileBtn.addEventListener('click', () => {
                    if (confirm(`Logged in as ${user.name} (${user.email}). Log out?`)) {
                        localStorage.removeItem('currentUser');
                        updateAuthUI();
                        if (typeof showToast === 'function') showToast('Logged out successfully');
                    }
                });
            }
        } else {
            authNavGroup.innerHTML = `
                <button id="loginNavBtn" class="btn btn-outline-nav"><i class="fas fa-sign-in-alt"></i> Login</button>
                <button id="signupNavBtn" class="btn btn-primary-nav"><i class="fas fa-user-plus"></i> Sign Up</button>
            `;
            bindAuthModalEvents();
        }
    }
}

function bindAuthModalEvents() {
    const loginModal = document.getElementById('loginModal');
    const loginNavBtn = document.getElementById('loginNavBtn');
    const signupNavBtn = document.getElementById('signupNavBtn');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileSignupBtn = document.getElementById('mobileSignupBtn');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabSignupBtn = document.getElementById('tabSignupBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    function openModal(mode = 'login') {
        if (!loginModal) return;
        loginModal.classList.add('active');
        if (mode === 'login') {
            switchTab('login');
        } else {
            switchTab('signup');
        }
    }

    function switchTab(mode) {
        if (mode === 'login') {
            if (tabLoginBtn) tabLoginBtn.classList.add('active');
            if (tabSignupBtn) tabSignupBtn.classList.remove('active');
            if (loginForm) loginForm.style.display = 'block';
            if (signupForm) signupForm.style.display = 'none';
        } else {
            if (tabSignupBtn) tabSignupBtn.classList.add('active');
            if (tabLoginBtn) tabLoginBtn.classList.remove('active');
            if (signupForm) signupForm.style.display = 'block';
            if (loginForm) loginForm.style.display = 'none';
        }
    }

    if (loginNavBtn) loginNavBtn.addEventListener('click', () => openModal('login'));
    if (signupNavBtn) signupNavBtn.addEventListener('click', () => openModal('signup'));
    if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => openModal('login'));
    if (mobileSignupBtn) mobileSignupBtn.addEventListener('click', () => openModal('signup'));
    if (tabLoginBtn) tabLoginBtn.addEventListener('click', () => switchTab('login'));
    if (tabSignupBtn) tabSignupBtn.addEventListener('click', () => switchTab('signup'));
    if (closeLoginModal && loginModal) {
        closeLoginModal.addEventListener('click', () => loginModal.classList.remove('active'));
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const userObj = { name: name, email: email };
            localStorage.setItem('currentUser', JSON.stringify(userObj));
            updateAuthUI();
            if (loginModal) loginModal.classList.remove('active');
            if (typeof showToast === 'function') showToast(`Account created! Welcome, ${userObj.name}!`, 'fa-user-check');
            
            const emailAddr = document.getElementById('emailAddr');
            if (emailAddr) emailAddr.value = email;
            const fullName = document.getElementById('fullName');
            if (fullName) fullName.value = name;
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('userEmail').value;
            const userObj = { name: email.split('@')[0], email: email };
            localStorage.setItem('currentUser', JSON.stringify(userObj));
            updateAuthUI();
            if (loginModal) loginModal.classList.remove('active');
            if (typeof showToast === 'function') showToast(`Welcome back, ${userObj.name}!`, 'fa-user-check');
            
            const emailAddr = document.getElementById('emailAddr');
            if (emailAddr) emailAddr.value = email;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCartDisplay();
    updateAuthUI();

    // Checkout Order Button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cart = getCart();
            if (cart.length === 0) {
                if (typeof showToast === 'function') showToast('Your shopping cart is empty!', 'fa-exclamation-circle');
                return;
            }

            // Check Login
            const user = getCurrentUser();
            if (!user) {
                if (typeof showToast === 'function') showToast('Please Login or Sign Up first to place your order!', 'fa-user-lock');
                const loginModal = document.getElementById('loginModal');
                if (loginModal) loginModal.classList.add('active');
                return;
            }

            // Check Address Form Fields
            const fullName = document.getElementById('fullName')?.value.trim();
            const emailAddr = document.getElementById('emailAddr')?.value.trim();
            const phoneNum = document.getElementById('phoneNum')?.value.trim();
            const streetAddr = document.getElementById('streetAddr')?.value.trim();
            const deliveryCity = document.getElementById('deliveryCity')?.value.trim();
            const zipCode = document.getElementById('zipCode')?.value.trim();

            if (!fullName || !emailAddr || !phoneNum || !streetAddr || !deliveryCity || !zipCode) {
                if (typeof showToast === 'function') showToast('Please complete all shipping address fields!', 'fa-exclamation-circle');
                document.getElementById('checkoutForm')?.reportValidity();
                return;
            }

            const { total } = calculateCartTotals();

            alert(`🎉 Order Confirmed!\n\nThank you, ${fullName}!\nYour order of $${total.toFixed(2)} will be shipped to:\n${streetAddr}, ${deliveryCity} (${zipCode})\n\nConfirmation sent to: ${emailAddr}`);

            localStorage.removeItem('cart');
            updateCartCount();
            window.location.href = 'index.html';
        });
    }
});
