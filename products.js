// --- NAVBAR MOBILE MENU LOGIC ---
const mobileMenuBtnB = document.getElementById("mobile-menu-btn-b");
const mobileMenuBtnX = document.getElementById("mobile-menu-btn-x");
const mobileMenu = document.getElementById("mobile-menu");



function toggleMobileMenu() {
    // Toggle menu visibility
    mobileMenu.classList.toggle("hidden");
    
    // Toggle the Menu and X icons
    mobileMenuBtnB.classList.toggle("hidden");
    mobileMenuBtnB.classList.toggle("flex");
    
    mobileMenuBtnX.classList.toggle("hidden");
    mobileMenuBtnX.classList.toggle("flex");
}

// Attach click events to BOTH buttons
mobileMenuBtnB.addEventListener("click", toggleMobileMenu);
mobileMenuBtnX.addEventListener("click", toggleMobileMenu);


// --- NAVBAR ACTIVE STATE LOGIC ---
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('#navbar a');

navLinks.forEach(link => {
    // Clean up the href to match the path (removes './')
    const linkPath = link.getAttribute('href').replace('./', '');
    
    // If the link matches the current page, make it primary colored
    if (linkPath === currentPath) {
        link.classList.remove('text-secondary');
        link.classList.add('text-primary', 'font-bold');
    }
});




// Base API URL
const API_URL = 'https://fakestoreapi.com/products';

// DOM Elements
const categoryContainer = document.getElementById('category-container');
const productsContainer = document.getElementById('products-container');
const productModal = document.getElementById('product-modal');
const modalContent = document.getElementById('modal-content');

// Initialize the page
async function initProductsPage() {
    productsContainer.innerHTML = `<p class="text-xl text-center col-span-full">Loading All Products...</p>`;
    await fetchCategories();
    await loadProducts('All'); // Load all by default
}



// 2. Render Category Buttons with Active State
function renderCategoryButtons() {
    categoryContainer.innerHTML = allCategoriesList.map(cat => {
        // Check if this button is the currently active one
        const isActive = cat === currentCategory;
        
        // Define active vs inactive Tailwind classes
        const activeStyles = "bg-primary text-white shadow-md";
        const inactiveStyles = "bg-transparent text-primary hover:bg-primary hover:text-white";
        
        return `
            <button onclick="handleCategoryClick('${cat}')" 
                class="px-6 py-2 rounded-full border border-primary font-semibold transition-all duration-300 capitalize ${isActive ? activeStyles : inactiveStyles}">
                ${cat}
            </button>
        `;
    }).join('');
}

// 3. Handle Click Event
async function handleCategoryClick(category) {
    currentCategory = category; // Update the active tracker
    renderCategoryButtons();    // Re-render buttons to update colors
    await loadProducts(category); // Load the actual products
}




// 1. Fetch and Render Categories
async function fetchCategories() {
    try {
        const res = await fetch(`${API_URL}/categories`);
        const categories = await res.json();
        
        // Add 'All' to the beginning of the list
        const allCategories = ['All', ...categories];

        categoryContainer.innerHTML = allCategories.map(cat => `
            <button onclick="loadProducts('${cat}')" 
                class="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-colors duration-300 capitalize cursor-pointer">
                ${cat}
            </button>
        `).join('');
    } catch (error) {
        console.error("Error loading categories", error);
    }
}

// 2. Fetch and Render Products (By Category or All)
async function loadProducts(category) {
    productsContainer.innerHTML = `<p class="text-xl text-center col-span-full">Loading ${category}...</p>`;
    
    try {
        let url = category === 'All' ? API_URL : `${API_URL}/category/${category}`;
        const res = await fetch(url);
        const products = await res.json();

        productsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
        
        //  Re-initializing icons for the newly injected cards!
        lucide.createIcons();
    } catch (error) {
        productsContainer.innerHTML = `<p class="text-red-500 text-center col-span-full">Failed to load products.</p>`;
    }
}

// 3. Generating HTML for a Single Card
function createProductCard(product) {
    // Truncate title if too long
    const shortTitle = product.title.length > 25 ? product.title.substring(0, 25) + '...' : product.title;

    return `
    <div class="group bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 w-full max-w-sm flex flex-col gap-4">
        <div class="bg-gray-200 p-4 h-56 overflow-hidden flex justify-center items-center">
            <img src="${product.image}" alt="${product.title}"
                class="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div class="flex justify-between items-center px-4">
            <div class="bg-blue-100 text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10 capitalize truncate max-w-[120px]">
                ${product.category}
            </div>
            <div class="flex items-center gap-1 mb-3">
                <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-yellow-400"></i>
                <span class="text-xs text-slate-500 font-medium ml-1">${product.rating.rate} (${product.rating.count})</span>
            </div>
        </div>

        <div class="px-4 grow">
            <h3 class="font-semibold text-lg text-black" title="${product.title}">${shortTitle}</h3>
            <div class="mt-2">
                <span class="text-xl font-bold text-slate-800">$${product.price}</span>
            </div>
        </div>

        <div class="flex justify-between items-center gap-2 p-4 mt-auto">
            <button onclick="openDetails(${product.id})"
                class="w-full backdrop-blur-md font-semibold py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 border border-gray-300 cursor-pointer hover:bg-gray-50 hover:text-primary transition-all duration-300">
                <i data-lucide="eye" class="w-5 h-5"></i> Details
            </button>
            <button
                class="w-full bg-indigo-600 text-white cursor-pointer backdrop-blur-md font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all duration-300">
                <i data-lucide="shopping-cart" class="w-5 h-5"></i> Add
            </button>
        </div>
    </div>
    `;
}

// 4. Modal Logic: Open Details
async function openDetails(productId) {
    productModal.classList.remove('hidden');
    modalContent.innerHTML = `<p class="text-center w-full py-10">Loading details...</p>`;

    try {
        const res = await fetch(`${API_URL}/${productId}`);
        const product = await res.json();

        modalContent.innerHTML = `
            <div class="w-full md:w-1/2 flex justify-center items-center bg-gray-50 rounded-xl p-4">
                <img src="${product.image}" alt="${product.title}" class="max-h-72 object-contain" />
            </div>
            <div class="w-full md:w-1/2 flex flex-col gap-4">
                <div class="capitalize text-sm font-bold text-primary bg-blue-100 w-max px-3 py-1 rounded-full">${product.category}</div>
                <h2 class="text-2xl font-bold text-slate-800">${product.title}</h2>
                <div class="flex items-center gap-2">
                    <i data-lucide="star" class="w-5 h-5 text-yellow-400 fill-yellow-400"></i>
                    <span class="font-medium text-slate-600">${product.rating.rate} Rating (${product.rating.count} Reviews)</span>
                </div>
                <p class="text-slate-600 text-sm leading-relaxed">${product.description}</p>
                <div class="text-3xl font-bold text-slate-900 mt-auto">$${product.price}</div>
                
                <button class="w-full bg-primary text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-purple-800 transition-all duration-300 mt-4 cursor-pointer">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i> Buy Now
                </button>
            </div>
        `;
        lucide.createIcons(); // Re-initialize icons inside modal
    } catch (error) {
        modalContent.innerHTML = `<p class="text-red-500">Error loading product details.</p>`;
    }
}

// Close Modal 
function closeModal() {
    productModal.classList.add('hidden');
    modalContent.innerHTML = ''; // Clear content
}


initProductsPage();