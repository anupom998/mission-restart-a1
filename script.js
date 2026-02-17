const mobileMenuBtn = document.getElementById("mobile-menu-btn");

const mobileMenu = document.getElementById("mobile-menu");

mobileMenuBtn.addEventListener("click", () => {
    
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
})





async function loadProducts(){
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
    
    console.log("Top 3 rated products:", top3Exact);
}

loadProducts();