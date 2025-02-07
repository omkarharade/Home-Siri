// Function to load the order items from localStorage and display them in card format
function loadOrders() {
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
