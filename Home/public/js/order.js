// Function to load the order items from localStorage and display them in card format
async function fetchOrders() {
    try {
        const loader = document.getElementById("loader");
        const orderContainer = document.getElementById("order-items");

      loader.style.display = "block"; // Loader दिखाएँ

      const response = await fetch("http://localhost:5000/api/orders/orders", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

      const data = await response.json();
      const orders = data.orders;

      console.log("data from orders page loading == ", data);

      if (data.length === 0) {
        orderContainer.innerHTML = "<p>No orders found.</p>";
      } else {
        orders.forEach((order) => {
          const orderCard = document.createElement("div");
          orderCard.className = "order-card";
          orderCard.innerHTML = `
            <img src="${order.imageURL}" alt="${order.name}">
            <h4>Order Address: ${order.address}</h4>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Created At:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>User ID:</strong> ${order.user_id}</p>
            <button class="styled-button" onclick="viewOrderDetails(${order.id})">View Order</button>
          `;
          orderContainer.appendChild(orderCard);
        });
      }
    } catch (error) {
      orderContainer.innerHTML = "<p>Error loading orders.</p>";
    } finally {
      loader.style.display = "none"; // Loader छुपाएँ
    }
  }


function loadOrders() {

    fetchOrders();  // embed orders card to frontend
    
    const orderItems = JSON.parse(localStorage.getItem("orderItems")) || [];
    const orderItemsContainer = document.getElementById("order-items");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    const statusMessage = document.getElementById("status-message");
    const cancelContainer = document.getElementById("cancel-container");
    const cancelButton = document.getElementById("cancel-button");

    if (orderItems.length === 0) {
        orderItemsContainer.innerHTML = "<p>No orders found.</p>";
        cancelContainer.style.display = "none"; // Hide cancel button if no orders exist
        return;
    }

    // Load existing orders as cards
    orderItems.forEach(item => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");

        // Add product image
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        // Add product name, price, and quantity
        orderCard.innerHTML += `
            <h4>${item.name}</h4>
            <div class="price">Price: ₹${(item.price * item.quantity).toFixed(2)}</div>
            <div class="quantity">Quantity: ${item.quantity}</div>
        `;
        orderCard.appendChild(img);
        orderItemsContainer.appendChild(orderCard);
    });

    let startTime = parseFloat(localStorage.getItem("startTime"));
    if (!startTime) {
        startTime = Date.now();
        localStorage.setItem("startTime", startTime);
    }

    const totalTime = 3600; // 1 hour in seconds
    const interval = 1000;

    const updateProgress = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const progress = (elapsedTime / totalTime) * 100;

        if (elapsedTime >= totalTime) {
            progressBar.style.width = "100%";
            progressText.textContent = "Your order has been delivered";
            statusMessage.textContent = "Order Complete!";
            cancelContainer.style.display = "none"; // Hide the cancel button

            // Move order to history and clear current orders
            const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
            orderHistory.push(...orderItems);
            localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
            localStorage.removeItem("orderItems");
            localStorage.removeItem("startTime");
            clearInterval(progressInterval); // Stop updating progress
        } else if (elapsedTime >= 30 * 60) {
            progressText.textContent = "Your order is dispatched";
            cancelContainer.style.display = "none"; // Hide cancel button after 30 minutes
        } else if (elapsedTime >= 15 * 60) {
            progressText.textContent = "Your order is packed";
        } else {
            progressText.textContent = `Order in Progress... ${Math.round(progress)}%`;
        }

        progressBar.style.width = `${progress}%`;
        localStorage.setItem("elapsedTime", elapsedTime.toString());
    };

    // Cancel order logic
    cancelButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to cancel your order?")) {
            const canceledOrders = JSON.parse(localStorage.getItem("canceledOrders")) || [];
            canceledOrders.push(...orderItems);
            localStorage.setItem("canceledOrders", JSON.stringify(canceledOrders));
            localStorage.removeItem("orderItems");
            localStorage.removeItem("startTime");
            cancelContainer.style.display = "none"; // Hide cancel button
            progressText.textContent = "Order Cancelled";
            statusMessage.textContent = "Your order was cancelled.";
            orderItemsContainer.innerHTML = "<p>Your order has been cancelled.</p>";
        }
    });

    const progressInterval = setInterval(updateProgress, interval);
}

// Load orders when the page is ready
document.addEventListener("DOMContentLoaded", loadOrders);
