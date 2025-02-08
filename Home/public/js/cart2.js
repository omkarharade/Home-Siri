document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout");

  const token = localStorage.getItem("jwtToken"); // Ensure JWT token is stored after login

  if (!token) {
      alert("Please log in to view your cart.");
      window.location.href = "/login";
      return;
  }

  // Fetch cart items from the server
  fetch("http://localhost:5000/cart", {
      headers: {
          Authorization: `Bearer ${token}`,
      },
  })
      .then((response) => response.json())
      .then((data) => {
          if (data.error) {
              alert(data.error);
              return;
          }
          const { cartItems, total } = data;
          cartTotalElement.textContent = total.toFixed(2);
          cartItems.forEach((item) => {
              const cartItem = document.createElement("div");
              cartItem.classList.add("cart-item");
              cartItem.innerHTML = `
                  <span>${item.name}</span>
                  <span>₹${item.price} x ${item.quantity}</span>
                  <span>₹${item.total}</span>
              `;
              cartItemsContainer.appendChild(cartItem);
          });
      })
      .catch((error) => console.error("Error fetching cart data:", error));

  // Checkout button handler
  checkoutButton.addEventListener("click", () => {
      fetch("http://localhost:5000/checkout", {
          method: "POST",
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
      })
          .then((response) => response.json())
          .then((data) => {
              if (data.error) {
                  alert(data.error);
              } else {
                  alert("Checkout successful!");
                  window.location.href = "/order";
              }
          })
          .catch((error) => console.error("Error during checkout:", error));
  });
});
