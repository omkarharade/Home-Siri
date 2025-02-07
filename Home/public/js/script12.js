let cart = []
let products = []

// Fetch products from the backend
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5000/products")
    products = await response.json()
    displayProducts()
  } catch (error) {
    console.error("Error fetching products:", error)
  }
}

// Display products on the page
function displayProducts() {
  const container = document.getElementById("product-container")
  container.innerHTML = ""

  products.forEach((product) => {
    const productBox = document.createElement("div")
    productBox.className = "product-box"
    productBox.dataset.id = product.id

    productBox.innerHTML = `
      <div class="product-img">
        <div class="discount-label">10% OFF</div>
        <img src="${product.image_url || "/placeholder.svg?height=200&width=200"}" alt="${product.name}">
        <button class="add-cart">+</button>
      </div>
      <div class="product-details">
        <h3 class="p-name">${product.name}</h3>
        <p class="p-price">₹${product.price}</p>
        <p class="p-weight">${product.weight || "1 kg"}</p>
      </div>
    `

    container.appendChild(productBox)
  })

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-cart").forEach((button) => {
    button.addEventListener("click", addToCart)
  })
}

// Add item to cart
function addToCart(event) {
  const productBox = event.target.closest(".product-box")
  const productId = productBox.dataset.id
  const product = products.find((p) => p.id === Number.parseInt(productId))

  const existingItem = cart.find((item) => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  updateCartCount()
}

// Update cart count in the header
function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
}

// Display cart items in the modal
function displayCart() {
  const cartItems = document.getElementById("cart-items")
  const cartTotal = document.getElementById("cart-total")
  cartItems.innerHTML = ""

  let total = 0

  cart.forEach((item) => {
    const itemElement = document.createElement("div")
    itemElement.innerHTML = `
      <div class="cart-item">
        <img src="${item.image_url || "/placeholder.svg?height=50&width=50"}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <p>${item.name} - ₹${item.price} x ${item.quantity}</p>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `
    cartItems.appendChild(itemElement)

    total += item.price * item.quantity
  })

  cartTotal.textContent = `Total: ₹${total.toFixed(2)}`

  // Add event listeners to "Remove" buttons
  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", removeFromCart)
  })
}

// Remove item from cart
function removeFromCart(event) {
  const productId = Number.parseInt(event.target.dataset.id)
  cart = cart.filter((item) => item.id !== productId)
  updateCartCount()
  displayCart()
}

// Show cart modal
document.getElementById("cart-icon").addEventListener("click", () => {
  displayCart()
  document.getElementById("cart-modal").style.display = "block"
})

// Close cart modal
document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart-modal").style.display = "none"
})

// Checkout
document.getElementById("checkout-btn").addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: 1, // Replace with actual user ID
        total_amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: cart.map((item) => ({
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    })

    if (response.ok) {
      alert("Order placed successfully!")
      cart = []
      updateCartCount()
      displayCart()
      document.getElementById("cart-modal").style.display = "none"
    } else {
      throw new Error("Failed to place order")
    }
  } catch (error) {
    console.error("Error during checkout:", error)
    alert("Failed to place order. Please try again.")
  }
})

// Initialize the page
fetchProducts()

