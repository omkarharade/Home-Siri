// Function to load the order items from localStorage and display them in card format


async function fetchOrders() {
	const orderContainer = document.getElementById("order-items");
	orderContainer.innerHTML = "";

	try {
		const loader = document.getElementById("loader");
		
		const progressBar = document.getElementById("progress-bar");
		const progressText = document.getElementById("progress-text");
		const statusMessage = document.getElementById("status-message");
		const cancelContainer = document.getElementById("cancel-container");
		const cancelButton = document.getElementById("cancel-button");
		loader.style.display = "block"; // Loader दिखाएँ
		const imageURL = "/images/order-complete.jpg"

		const userId = await JSON.parse(
			document.getElementById("user-id").getAttribute("data-userId")
		);

		const searchQuery = document.getElementById("search-bar").value;
		console.log("search-query = ", searchQuery);

		const params = new URLSearchParams({
			user_id: userId,
			search_query: searchQuery
		});
		const url = `http://localhost:5000/api/orders/orders?${params}`;

		console.log("url string is ", url);
	
		console.log("calling from the fetch orders function");
		console.log("userid == ", userId);
	

		const response = await fetch(url, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		const data = await response.json();
		const orders = data.orders;

		console.log("data from orders page loading == ", data);

		if (data.length === 0) {
			orderContainer.innerHTML = "<p>No orders found.</p>";
		} else {
			orders.map((order) => {
				const orderCard = document.createElement("div");
				orderCard.className = "order-card";
				orderCard.innerHTML = `
            <img src="${imageURL}" alt="${order.name}">
            <h4>Order Address: ${order.address}</h4>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Phone:</strong> ${order.phone}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Created At:</strong> ${new Date(
							order.createdAt
						).toLocaleString()}</p>
            <p><strong>Applied Coupon:</strong> ${order.coupon_applied ? "YES" : "NO"}</p>
            <button class="styled-button" onclick="viewOrderDetails(${
							order.id
						})">View Order</button>
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

	fetchOrders(); // embed orders card to frontend

	const updateProgress = () => {
		const elapsedTime = (Date.now() - startTime) / 1000;
		const progress = (elapsedTime / totalTime) * 100;

		if (elapsedTime >= totalTime) {
			progressBar.style.width = "100%";
			progressText.textContent = "Your order has been delivered";
			statusMessage.textContent = "Order Complete!";
			cancelContainer.style.display = "none"; // Hide the cancel button

			// Move order to history and clear current orders
			const orderHistory =
				JSON.parse(localStorage.getItem("orderHistory")) || [];
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
			progressText.textContent = `Order in Progress... ${Math.round(
				progress
			)}%`;
		}

		progressBar.style.width = `${progress}%`;
		localStorage.setItem("elapsedTime", elapsedTime.toString());
	};

	const searchButton = document.getElementById("search-btn");
	searchButton.addEventListener("click", fetchOrders);

	// Cancel order logic
	cancelButton.addEventListener("click", () => {
		if (confirm("Are you sure you want to cancel your order?")) {
			const canceledOrders =
				JSON.parse(localStorage.getItem("canceledOrders")) || [];
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
