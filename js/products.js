// Product Data - Sample products for the e-commerce store
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        category: "electronics",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Highly rated by TL & Tech reviewers."
    },
    {
        id: 2,
        name: "Smart Watch Series 5",
        price: 299.99,
        category: "electronics",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        description: "Advanced smartwatch with health tracking, GPS, water resistance, and seamless smartphone integration. Stay connected and healthy."
    },
    {
        id: 3,
        name: "Laptop Backpack",
        price: 49.99,
        category: "fashion",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        description: "Durable and stylish laptop backpack with multiple compartments, USB charging port, and water-resistant material. Perfect for work and travel."
    },
    {
        id: 4,
        name: "4K Ultra HD Smart TV 55\"",
        price: 599.99,
        category: "electronics",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
        description: "Stunning 4K resolution with HDR support, smart features, and built-in streaming apps. Transform your living room entertainment."
    },
    {
        id: 5,
        name: "Men's Casual Sneakers",
        price: 89.99,
        category: "fashion",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        description: "Comfortable and trendy sneakers with breathable material and cushioned sole. Perfect for everyday wear and light activities."
    },
    {
        id: 6,
        name: "Coffee Maker Machine",
        price: 129.99,
        category: "home",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
        description: "Programmable coffee maker with thermal carafe, brew strength control, and auto shut-off. Start your mornings right."
    },
    {
        id: 7,
        name: "Wireless Gaming Mouse",
        price: 59.99,
        category: "electronics",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
        description: "High-precision gaming mouse with customizable RGB lighting, programmable buttons, and ergonomic design for extended gaming sessions."
    },
    {
        id: 8,
        name: "The Psychology of Money",
        price: 24.99,
        category: "books",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop",
        description: "Bestselling book about the psychology of money and wealth. Learn timeless lessons on wealth, greed, and happiness."
    },
    {
        id: 9,
        name: "Yoga Mat Premium",
        price: 39.99,
        category: "home",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
        description: "Extra thick yoga mat with non-slip surface and carrying strap. Perfect for yoga, pilates, and home workouts."
    },
    {
        id: 10,
        name: "Stainless Steel Water Bottle",
        price: 29.99,
        category: "home",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        description: "Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. Eco-friendly and durable."
    },
    {
        id: 11,
        name: "Women's Leather Handbag",
        price: 149.99,
        category: "fashion",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop",
        description: "Elegant genuine leather handbag with multiple compartments and adjustable strap. Perfect for work and special occasions."
    },
    {
        id: 12,
        name: "Atomic Habits Book",
        price: 19.99,
        category: "books",
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&h=500&fit=crop",
        description: "Transform your life with tiny changes that deliver remarkable results. A practical guide to building good habits and breaking bad ones."
    }
];

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Create product card HTML (Updated for high design aesthetics)
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            ${product.rating >= 4.9 ? '<span class="badge badge-accent product-badge"><i class="fas fa-crown"></i> Top Rated</span>' : ''}
            <div class="product-img-holder">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.rating.toFixed(1)})</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm add-to-cart-btn" 
                        data-id="${product.id}" 
                        data-name="${product.name.replace(/"/g, '&quot;')}" 
                        data-price="${product.price}" 
                        data-img="${product.image}">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Get products by category
function getProductsByCategory(category) {
    if (!category || category === 'all') return products;
    return products.filter(product => product.category === category.toLowerCase());
}

// Sort products
function sortProducts(productsArray, sortType) {
    const sorted = [...productsArray];
    
    switch(sortType) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted;
    }
}

// Search products
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
}
