// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'vtmfashion2026'
};

// Global State
let products = [];
let editingId = null;
let deletingId = null; // ID of product to delete

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initializeLoginForm();
    initializeAdminPanel();
});

// Check authentication
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('vtmfashion_admin_logged_in');
    if (isLoggedIn === 'true') {
        showAdminPanel();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminContainer').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminContainer').style.display = 'block';
    loadProducts();
    renderProductList();
    updateDashboardStats();
}

function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('vtmfashion_admin_logged_in', 'true');
            showAdminPanel();
        } else {
            loginError.textContent = 'Invalid username or password';
            loginError.classList.add('show');
            setTimeout(() => {
                loginError.classList.remove('show');
            }, 3000);
        }
    });
}

function initializeAdminPanel() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.removeItem('vtmfashion_admin_logged_in');
        showLoginScreen();
        document.getElementById('loginForm').reset();
    });

    // Toggle Views
    document.getElementById('addNewProductBtn').addEventListener('click', () => {
        showProductForm();
    });

    document.getElementById('cancelFormBtn').addEventListener('click', () => {
        hideProductForm();
    });

    // Form Handling
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', handleProductSubmit);

    // Interactive Form Elements
    document.getElementById('productSizes').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSizesFromInput();
        }
    });
    document.getElementById('productSizes').addEventListener('blur', addSizesFromInput);
    document.getElementById('addColorBtn').addEventListener('click', addColor);

    // Live Preview Listeners
    const formInputs = ['productName', 'productDescription', 'productPrice', 'productImage', 'productCategory'];
    formInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
    });

    // Delete Modal
    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteProductConfirmed);
}

// --- DATA MANAGEMENT ---

function loadProducts() {
    const saved = localStorage.getItem('vtmfashion_products');
    if (saved) {
        try {
            products = JSON.parse(saved);
        } catch (e) {
            console.error(e);
            products = [];
        }
    } else {
        // If no data, use the default sample data from script.js logic (optional, or start empty)
        // For now, let's start empty or you can copy the sample data here to initialize if empty.
        // Let's rely on what script.js might have saved, or initialize empty.
        // If we want sample data, we can detect if it's the first run.
        if (!localStorage.getItem('vtmfashion_initialized')) {
            // We can manually add the sample data here if needed, 
            // but script.js handles the front-end defaults. 
            // To make sure admin sees them, let's grab them if we can or just init empty.
            // We'll trust that script.js has run at least once or we define them here.

            // Let's define the nice sample data here to ensure admin starts populated if empty
            products = [
                {
                    id: 1,
                    name: "Premium Denim Jeans",
                    description: "Classic fit denim jeans crafted from premium quality fabric.",
                    price: 3500,
                    category: "jeans",
                    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80",
                    sizes: ["28", "30", "32", "34", "36"],
                    colors: [{ name: "Dark Blue", value: "#1e3a8a" }, { name: "Black", value: "#000000" }, { name: "Light Blue", value: "#60a5fa" }],
                    inStock: true
                },
                {
                    id: 2,
                    name: "Casual Cotton Shirt",
                    description: "Comfortable cotton shirt perfect for casual and semi-formal occasions.",
                    price: 2800,
                    category: "shirt",
                    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
                    sizes: ["S", "M", "L", "XL", "XXL"],
                    colors: [{ name: "White", value: "#FFFFFF" }, { name: "Light Blue", value: "#93c5fd" }, { name: "Pink", value: "#fda4af" }],
                    inStock: true
                },
                {
                    id: 3,
                    name: "Premium Fashion T-Shirt",
                    description: "Experience luxury and comfort with our premium fashion t-shirt.",
                    price: 2500,
                    category: "tshirt",
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
                    sizes: ["S", "M", "L", "XL", "XXL"],
                    colors: [{ name: "Black", value: "#000000" }, { name: "White", value: "#FFFFFF" }, { name: "Navy", value: "#1e3a8a" }, { name: "Gray", value: "#6b7280" }],
                    inStock: true
                },
                {
                    id: 4,
                    name: "Stylish Hoodie",
                    description: "Stay warm and stylish with our premium hoodie.",
                    price: 4200,
                    category: "hoodie",
                    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
                    sizes: ["S", "M", "L", "XL", "XXL"],
                    colors: [{ name: "Black", value: "#000000" }, { name: "Gray", value: "#6b7280" }, { name: "Navy", value: "#1e3a8a" }],
                    inStock: true
                }
            ];
            saveProducts();
            localStorage.setItem('vtmfashion_initialized', 'true');
        }
    }
}

function saveProducts() {
    localStorage.setItem('vtmfashion_products', JSON.stringify(products));
    updateDashboardStats();
}

// --- UI RENDERING ---

function updateDashboardStats() {
    document.getElementById('totalProducts').textContent = products.length;
}

function renderProductList() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        const stockClass = product.inStock ? 'status-in-stock' : 'status-out-of-stock';
        const stockText = product.inStock ? 'In Stock' : 'Out of Stock';

        tr.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" class="table-img">
            </td>
            <td>
                <div class="product-name-cell">${product.name}</div>
            </td>
             <td>
                <span class="category-badge">${product.category}</span>
            </td>
            <td>Rs. ${product.price.toLocaleString()}</td>
            <td><span class="status-badge ${stockClass}">${stockText}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-action edit-btn" onclick="editProduct(${product.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-icon-action delete-btn" onclick="confirmDeleteProduct(${product.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function showProductForm(product = null) {
    const section = document.getElementById('productFormSection');
    const listSection = document.getElementById('productListSection');
    const title = document.getElementById('formTitle');
    const form = document.getElementById('productForm');

    section.style.display = 'block';
    listSection.style.display = 'none';

    // Clear chips
    document.getElementById('sizeChips').innerHTML = '';
    document.getElementById('colorChips').innerHTML = '';

    if (product) {
        title.textContent = 'Edit Product';
        editingId = product.id;

        // Populate form
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productImage').value = product.image;

        // Stock
        const radios = document.getElementsByName('inStock');
        radios.forEach(r => r.checked = (r.value === String(product.inStock)));

        // Sizes
        currentSizes = [...(product.sizes || [])];
        renderSizeChips();

        // Colors
        currentColors = [...(product.colors || [])];
        renderColorChips();

    } else {
        title.textContent = 'Add Product';
        editingId = null;
        form.reset();
        currentSizes = [];
        currentColors = [];
        // Default color value
        document.getElementById('colorValue').value = '#000000';
    }
    updatePreview();
}

function hideProductForm() {
    document.getElementById('productFormSection').style.display = 'none';
    document.getElementById('productListSection').style.display = 'block';
    editingId = null;
}

// --- FORM HANDLING ---

let currentSizes = [];
let currentColors = [];

function addSizesFromInput() {
    const input = document.getElementById('productSizes');
    const val = input.value.trim();
    if (val) {
        // Split by comma
        const newSizes = val.split(',').map(s => s.trim().toUpperCase()).filter(s => s);
        // Add only unique
        newSizes.forEach(s => {
            if (!currentSizes.includes(s)) currentSizes.push(s);
        });
        input.value = '';
        renderSizeChips();
        updatePreview();
    }
}

function renderSizeChips() {
    const container = document.getElementById('sizeChips');
    container.innerHTML = '';
    currentSizes.forEach((size, idx) => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `<span>${size}</span><button type="button" onclick="removeSize(${idx})">×</button>`;
        container.appendChild(chip);
    });
}

window.removeSize = function (idx) {
    currentSizes.splice(idx, 1);
    renderSizeChips();
    updatePreview();
};

function addColor() {
    const nameInput = document.getElementById('colorName');
    const valInput = document.getElementById('colorValue');
    const name = nameInput.value.trim();
    const value = valInput.value;

    if (name) {
        currentColors.push({ name, value });
        nameInput.value = '';
        renderColorChips();
        updatePreview();
    }
}

function renderColorChips() {
    const container = document.getElementById('colorChips');
    container.innerHTML = '';
    currentColors.forEach((color, idx) => {
        const chip = document.createElement('div');
        chip.className = 'chip color-chip';
        chip.innerHTML = `
            <div class="color-chip-swatch" style="background-color:${color.value}"></div>
            <span>${color.name}</span>
            <button type="button" onclick="removeColor(${idx})">×</button>
        `;
        container.appendChild(chip);
    });
}

window.removeColor = function (idx) {
    currentColors.splice(idx, 1);
    renderColorChips();
    updatePreview();
};

function updatePreview() {
    const name = document.getElementById('productName').value || 'Product Name';
    const cat = document.getElementById('productCategory').value;
    const desc = document.getElementById('productDescription').value || 'Description...';
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const img = document.getElementById('productImage').value;

    document.getElementById('previewName').textContent = name;
    document.getElementById('previewDescription').textContent = desc;
    document.getElementById('previewPrice').textContent = `Rs. ${price.toLocaleString()}`;
    document.getElementById('previewCategoryBadge').textContent = cat;

    if (img) document.getElementById('previewImage').src = img;

    // Sizes
    const sContainer = document.getElementById('previewSizes');
    sContainer.innerHTML = '';
    currentSizes.forEach(s => {
        const el = document.createElement('div');
        el.className = 'preview-size';
        el.innerText = s;
        sContainer.appendChild(el);
    });

    // Colors
    const cContainer = document.getElementById('previewColors');
    cContainer.innerHTML = '';
    currentColors.forEach(c => {
        const el = document.createElement('div');
        el.className = 'preview-color';
        el.style.backgroundColor = c.value;
        cContainer.appendChild(el);
    });
}

function handleProductSubmit(e) {
    e.preventDefault();

    const newProduct = {
        id: editingId ? editingId : Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value,
        sizes: [...currentSizes],
        colors: [...currentColors],
        inStock: document.querySelector('input[name="inStock"]:checked').value === 'true'
    };

    if (editingId) {
        const idx = products.findIndex(p => p.id === editingId);
        if (idx !== -1) products[idx] = newProduct;
    } else {
        products.push(newProduct);
    }

    saveProducts();
    hideProductForm();
    renderProductList();
}

// --- DELETION ---

window.editProduct = function (id) {
    const p = products.find(prod => prod.id === id);
    if (p) showProductForm(p);
};

window.confirmDeleteProduct = function (id) {
    deletingId = id;
    document.getElementById('deleteModal').classList.add('active');
};

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
    deletingId = null;
}

function deleteProductConfirmed() {
    if (deletingId) {
        products = products.filter(p => p.id !== deletingId);
        saveProducts();
        renderProductList();
        closeDeleteModal();
    }
}
