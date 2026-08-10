// Main JavaScript file for homepage and interactive app features

// Toast Notification
function showToast(message, icon = 'fa-check-circle') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas ${icon} text-gold"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Load Home Products Grid
function loadHomeProducts() {
    const homeGrid = document.getElementById('homeProductsGrid');
    if (!homeGrid) return;

    if (typeof products !== 'undefined' && products.length > 0) {
        homeGrid.innerHTML = products.slice(0, 8).map(p => createProductCard(p)).join('');
    }
}

// Load Products Page Grid with Filters & Sort
function loadAllProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    let displayProducts = [...products];

    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value !== 'all') {
        displayProducts = displayProducts.filter(p => p.category.toLowerCase() === categoryFilter.value.toLowerCase());
    }

    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        displayProducts = sortProducts(displayProducts, sortFilter.value);
    }

    if (displayProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                <h3>No products found matching your criteria</h3>
                <p>Try clearing your search or filter options.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = displayProducts.map(p => createProductCard(p)).join('');
}

// Global Event Delegation for Add-To-Cart & Interactivity
document.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('.add-to-cart-btn');
    if (cartBtn) {
        e.preventDefault();
        const id = cartBtn.dataset.id;
        const name = cartBtn.dataset.name;
        const price = parseFloat(cartBtn.dataset.price);
        const img = cartBtn.dataset.img;

        if (typeof addToCart === 'function') {
            addToCart(id, name, price, img);
        } else {
            // Fallback cart storage
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(item => item.id == id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            if (typeof updateCartCount === 'function') updateCartCount();
        }

        showToast(`<strong>${name}</strong> added to your cart!`);
    }
});

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    loadHomeProducts();
    loadAllProducts();

    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Search Action
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    function performSearch() {
        if (!searchInput) return;
        const query = searchInput.value.trim();
        if (query) {
            localStorage.setItem('searchQuery', query);
            if (!window.location.pathname.includes('products.html')) {
                window.location.href = 'products.html';
            } else {
                const searchResults = searchProducts(query);
                const productsGrid = document.getElementById('productsGrid');
                if (productsGrid) {
                    productsGrid.innerHTML = searchResults.map(p => createProductCard(p)).join('');
                }
            }
        }
    }

    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Category and Sort listeners on products.html
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (categoryFilter) categoryFilter.addEventListener('change', loadAllProducts);
    if (sortFilter) sortFilter.addEventListener('change', loadAllProducts);

    // Check URL parameters for category filtering
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
        loadAllProducts();
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing! Check your email for exclusive deals.', 'fa-paper-plane');
            newsletterForm.reset();
        });
    }
});
