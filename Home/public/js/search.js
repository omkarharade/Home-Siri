document.addEventListener("DOMContentLoaded", () => {
    const searchBar = document.querySelector(".search-container input");
    const productContainer = document.querySelector(".product-container");

    const renderProducts = (filteredProducts) => {
        productContainer.innerHTML = "";
        if (filteredProducts.length === 0) {
            productContainer.innerHTML = "<p>No products found.</p>";
            return;
        }
        filteredProducts.forEach(product => {
            productContainer.innerHTML += `
                <div class="product-box" data-id="${product.id}">
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}">
                        <button class="add-cart">+</button>
                    </div>
                    <div class="product-details">
                        <h3 class="p-name">${product.name}</h3>
                        <p class="p-price">${product.price}</p>
                        <p class="p-weight">${product.weight}</p>
                    </div>
                </div>
            `;
        });
    };

    searchBar.addEventListener("input", () => {
        const searchText = searchBar.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchText)
        );
        renderProducts(filteredProducts);
    });

    // Render all products initially
    renderProducts(products);
});
