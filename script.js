// Sample products data (will be managed via admin panel)
let productsData = [
    {
        id: 1,
        name: "Premium Denim Jeans",
        description: "Classic fit denim jeans crafted from premium quality fabric. Perfect blend of comfort and style for everyday wear.",
        price: 3500,
        category: "jeans",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
        sizes: ["28", "30", "32", "34", "36"],
        colors: [
            { name: "Dark Blue", value: "#1e3a8a" },
            { name: "Black", value: "#000000" },
            { name: "Light Blue", value: "#60a5fa" }
        ],
        inStock: true
    },
    {
        id: 2,
        name: "Casual Cotton Shirt",
        description: "Comfortable cotton shirt perfect for casual and semi-formal occasions. Breathable fabric with modern fit.",
        price: 2800,
        category: "shirt",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "White", value: "#FFFFFF" },
            { name: "Light Blue", value: "#93c5fd" },
            { name: "Pink", value: "#fda4af" }
        ],
        inStock: true
    },
    {
        id: 3,
        name: "Premium Fashion T-Shirt",
        description: "Experience luxury and comfort with our premium fashion t-shirt. Crafted from the finest materials for ultimate comfort.",
        price: 2500,
        category: "tshirt",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "White", value: "#FFFFFF" },
            { name: "Navy", value: "#1e3a8a" },
            { name: "Gray", value: "#6b7280" }
        ],
        inStock: true
    },
    {
        id: 4,
        name: "Stylish Hoodie",
        description: "Stay warm and stylish with our premium hoodie. Perfect for casual outings and cool weather.",
        price: 4200,
        category: "hoodie",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Gray", value: "#6b7280" },
            { name: "Navy", value: "#1e3a8a" }
        ],
        inStock: true
    }
];

// Current filter and modal state
let currentCategory = 'all';
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;

// WhatsApp number
const WHATSAPP_NUMBER = "94764847081";

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProductsData();
    displayProducts();
    initializeNavigation();
    initializeCategoryFilter();
    initializeModal();
    initializeScrollEffects();
});

// Load products data from localStorage or use default
function loadProductsData() {
    const savedProducts = localStorage.getItem('vtmfashion_products');
    if (savedProducts) {
        try {
            productsData = JSON.parse(savedProducts);
        } catch (e) {
            console.error('Error loading products data:', e);
        }
    }
}

// Display products based on current category
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');

    // Filter products by category
    const filteredProducts = currentCategory === 'all'
        ? productsData
        : productsData.filter(p => p.category === currentCategory);

    // Clear grid
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';

    // Create product cards
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => openProductModal(product);

    const stockBadge = product.inStock
        ? '<div class="product-card-badge">In Stock</div>'
        : '<div class="product-card-badge out-of-stock">Out of Stock</div>';

    const categoryName = getCategoryDisplayName(product.category);

    card.innerHTML = `
        <div class="product-card-image">
            <img src="${product.image}" alt="${product.name}">
            ${stockBadge}
            <div class="product-card-category">${categoryName}</div>
        </div>
        <div class="product-card-body">
            <h3 class="product-card-title">${product.name}</h3>
            <p class="product-card-description">${product.description}</p>
            <div class="product-card-footer">
                <span class="product-card-price">Rs. ${product.price.toLocaleString()}</span>
                <button class="product-card-btn" onclick="event.stopPropagation(); openProductModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">View Details</button>
            </div>
        </div>
    `;

    return card;
}

// Get category display name
function getCategoryDisplayName(category) {
    const names = {
        'jeans': 'Jeans',
        'shirt': 'Shirts',
        'tshirt': 'T-Shirts',
        'hoodie': 'Hoodies'
    };
    return names[category] || category;
}

// Initialize category filter
function initializeCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update current category and display products
            currentCategory = btn.dataset.category;
            displayProducts();
        });
    });
}

// Open product modal
function openProductModal(product) {
    currentProduct = product;
    selectedSize = null;
    selectedColor = null;

    const modal = document.getElementById('productModal');

    // Update modal content
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalCategory').textContent = getCategoryDisplayName(product.category);
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `Rs. ${product.price.toLocaleString()}`;

    // Update stock badge
    const stockBadge = document.getElementById('modalStockBadge');
    if (product.inStock) {
        stockBadge.textContent = 'In Stock';
        stockBadge.classList.remove('out-of-stock');
    } else {
        stockBadge.textContent = 'Out of Stock';
        stockBadge.classList.add('out-of-stock');
    }

    // Display sizes
    displayModalSizes(product.sizes);

    // Display colors
    displayModalColors(product.colors);

    // Update buy button
    updateModalBuyButton();

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
    selectedSize = null;
    selectedColor = null;
}

// Initialize modal
function initializeModal() {
    const modal = document.getElementById('productModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    // Close button
    modalClose.addEventListener('click', closeProductModal);

    // Click outside to close
    modalOverlay.addEventListener('click', closeProductModal);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProductModal();
        }
    });
}

// Display modal sizes
function displayModalSizes(sizes) {
    const sizeOptions = document.getElementById('modalSizeOptions');
    sizeOptions.innerHTML = '';

    sizes.forEach(size => {
        const sizeElement = document.createElement('div');
        sizeElement.className = 'size-option';
        sizeElement.textContent = size;
        sizeElement.onclick = () => selectModalSize(size);
        sizeOptions.appendChild(sizeElement);
    });
}

// Display modal colors
function displayModalColors(colors) {
    const colorOptions = document.getElementById('modalColorOptions');
    colorOptions.innerHTML = '';

    colors.forEach(color => {
        const colorElement = document.createElement('div');
        colorElement.className = 'color-option';
        colorElement.style.backgroundColor = color.value;
        colorElement.title = color.name;
        colorElement.onclick = () => selectModalColor(color);

        // Add border for white color visibility
        if (color.value.toLowerCase() === '#ffffff' || color.value.toLowerCase() === 'white') {
            colorElement.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        }

        colorOptions.appendChild(colorElement);
    });
}

// Select modal size
function selectModalSize(size) {
    selectedSize = size;

    // Update UI
    document.querySelectorAll('#modalSizeOptions .size-option').forEach(el => {
        el.classList.remove('selected');
        if (el.textContent === size) {
            el.classList.add('selected');
        }
    });

    updateModalBuyButton();
}

// Select modal color
function selectModalColor(color) {
    selectedColor = color;

    // Update UI
    document.querySelectorAll('#modalColorOptions .color-option').forEach(el => {
        el.classList.remove('selected');
        if (el.style.backgroundColor === color.value ||
            rgbToHex(el.style.backgroundColor) === color.value) {
            el.classList.add('selected');
        }
    });

    updateModalBuyButton();
}

// Convert RGB to Hex for comparison
function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;

    const values = rgb.match(/\d+/g);
    if (!values || values.length < 3) return rgb;

    const r = parseInt(values[0]);
    const g = parseInt(values[1]);
    const b = parseInt(values[2]);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Update modal buy button state
function updateModalBuyButton() {
    const buyButton = document.getElementById('modalBuyBtn');

    if (!currentProduct.inStock) {
        buyButton.disabled = true;
        buyButton.innerHTML = '<span>Out of Stock</span>';
    } else if (selectedSize && selectedColor) {
        buyButton.disabled = false;
        buyButton.innerHTML = `
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            Buy Now via WhatsApp
        `;
        buyButton.onclick = sendWhatsAppOrder;
    } else {
        buyButton.disabled = true;
        buyButton.innerHTML = '<span>Select Size & Color</span>';
    }
}

// Send order via WhatsApp
function sendWhatsAppOrder() {
    if (!currentProduct || !selectedSize || !selectedColor) {
        alert('Please select size and color');
        return;
    }

    const message = `
🛍️ *New Order from VTMFASHION*

📦 *Product:* ${currentProduct.name}
🏷️ *Category:* ${getCategoryDisplayName(currentProduct.category)}
💰 *Price:* Rs. ${currentProduct.price.toLocaleString()}
📏 *Size:* ${selectedSize}
🎨 *Color:* ${selectedColor.name}

I would like to place an order for this product. Please confirm availability and delivery details.

Thank you!
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Navigation functionality
function initializeNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinkElements = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');

            // Update active state
            navLinkElements.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinkElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Expose functions for admin panel
window.updateProductsData = function (newProducts) {
    productsData = newProducts;
    localStorage.setItem('vtmfashion_products', JSON.stringify(productsData));
    displayProducts();
};

window.getProductsData = function () {
    return [...productsData];
};

window.openProductModal = openProductModal;
