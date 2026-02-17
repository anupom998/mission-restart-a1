const mobileMenuBtn = document.getElementById("mobile-menu-btn");

const mobileMenu = document.getElementById("mobile-menu");

const productsContainer = document.getElementById("products-container");

mobileMenuBtn.addEventListener("click", () => {
    
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
})





async function loadProducts(){
    try{
        const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();
    
    // Get all ratings, sort descending, and find the 3rd highest
    const ratings = products.map(p => p.rating.rate).sort((a, b) => b - a);
    const thirdHighestRating = ratings[2]; // Index 2 is the 3rd highest
    
    // Filter products with rating >= the 3rd highest rating
    const top3Rated = products.filter(product => 
        product.rating.rate >= thirdHighestRating
    );
    
    // This might give more than 3 if there are ties, so applying slice if needed
    const top3Exact = top3Rated.slice(0, 3);

    productsContainer.innerHTML = top3Exact.map(product => createProductCard(product)).join('');

    //  Re-initializing icons for the newly injected cards!
        lucide.createIcons();
    
    console.log("Top 3 rated products:", top3Exact);


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

// Close Modal Logic
function closeModal() {
    productModal.classList.add('hidden');
    modalContent.innerHTML = ''; // Clear content
}




loadProducts();