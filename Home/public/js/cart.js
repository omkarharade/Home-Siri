// Get the cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem("cartItems")) || [];
}

async function getCartItemsAPI() {
    const userId = await JSON.parse(document.getElementById('user-id').getAttribute('data-userId'));
    const params  = new URLSearchParams({
        user_id: userId
    });
    const url = `http://localhost:5000/api/cart?${params}`


    console.log("calling from the getElement by id function")
    console.log("userid == ", userId);

    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    


    console.log("response of getChartItems from API = ", response)
    console.log("response.json() of getChartItems from API = ",data)
    console.log("chart items", data.cart.CartItems);

    return data.cart.CartItems;
}
  
  // Save the cart items to localStorage
  function saveCartItems(cartItems) {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }


//   -------------------------------------------------------------------------------------------

    // Add item to cart
    function addToCart(product) {
        const cartItems = getCartItems();
        const existingItem = cartItems.find(item => item.id === product.id);
    
        if (existingItem) {
            existingItem.quantity += 1; // Update quantity
        } else {
            product.price = parseFloat(product.price); // Ensure price is a number
            product.quantity = 1; // Default quantity to 1
            cartItems.push(product); // Add new item
        }


        saveCartItems(cartItems); // Save updated cart to localStorage
        console.log("Cart updated:", cartItems); // Debugging
        alert("Item added to cart!");
    }


  // Add event listeners to all Add to Cart buttons
  document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        const productBox = button.closest(".product-box");
        const product = {
            id: productBox.dataset.id,
            name: productBox.querySelector(".p-name").innerText,
            price: parseFloat(productBox.querySelector(".p-price").innerText.replace("₹", "")),
            weight: productBox.querySelector(".p-weight").innerText, // Get the weight
            image: productBox.querySelector("img").src
        };
  
        console.log("Adding product:", product); // Debugging
        addToCart(product);
        addToCartAPI(product);
    });
  });

  // add to cart API invoking function
  async function addToCartAPI(product){

   try {
    const userId = JSON.parse(document.getElementById('user-id').getAttribute('data-userId'))
    console.log("userId from addtocartAPI function = ", userId)
    console.log("product data  = ", product)

    // we have to call the API to add product to cart or update quantity 

    // required in body of api  =  const { user_id, product_id, quantity, price } = req.body;

    const response = await fetch("http://localhost:5000/api/cart/add", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				user_id: userId,
				product_id: product.id,
				quantity: product.quantity,
				price: product.price,
                weight: product.weight,
                image: product.image
			}),
		});

    if(response.status === 200 || response.status === 201){
        const data = await response.json();
        console.log(data.message);
        console.log("response from the api  = ", data)
    }
    else{
        console.log("some error occured");
        console.log(data.message);
    }
   } catch (error) {
        console.log(error);
   }
    
  }

//   -----------------------------------------------------------------------------------------------
  
  // Redirect to cart page when cart button is clicked
  document.getElementById("cart-link").addEventListener("click", () => {
    window.location.href = "/cart";
  });


  async function loadCartAPI() {

    const cartItems = await getCartItemsAPI();

    console.log("inside loadCartAPI , ", cartItems )

    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartTotalOriginal = document.getElementById("cart-total-original");
    const cartTotalDiscounted = document.getElementById("cart-total-discounted");
  
    cartItemsContainer.innerHTML = "";
    let total = 0;
  
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<font size=15><p>Your Cart Is Empty!</p></font>";
        return;
    }
    

    cartItems.forEach((item, index) => {
        item.price = parseFloat(item.price); // Ensure price is a number
  
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.product_id}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.product_id}</div>
                <div>Price: ₹${item.price.toFixed(2)}</div>
                <div>Quantity: ${item.weight}</div> <!-- Add weight here -->
                <div class="cart-item-quantity">
                    <button class="minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="plus" data-index="${index}">+</button>
                    <button class="add-to-mylist" data-index="${index}">Add To MyList</button>
                </div>
            </div>
            <div class="cart-item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
            <div class="confirm-remove" id="confirm-remove-${index}">
                <p>Are you sure you want to remove this item?</p>
                <button class="yes" data-index="${index}">Yes</button>
                <button class="no">No</button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.innerText = `Total: ₹${total.toFixed(2)}`;
    cartTotalOriginal.style.display = 'none';
    cartTotalDiscounted.style.display = 'none';


    document.getElementById("apply-coupon").addEventListener("click", () => {
        if (total >=250 ) {
            const couponCode = document.getElementById("coupon-code").value;
            if (couponCode === "FRESH50") {
                alert("Coupon applied successfully! 50% off your total.");
                const discountedTotal = total * 0.5;
  
                cartTotalOriginal.innerText = `Original Total: ₹${total.toFixed(2)}`;
                cartTotalDiscounted.innerText = `Discounted Total: ₹${discountedTotal.toFixed(2)}`;
  
                cartTotalOriginal.style.display = 'block';
                cartTotalDiscounted.style.display = 'block';
                cartTotal.style.display = 'none';
            } else {
                alert("Invalid coupon code.");
            }
        } else {
            alert("Total must be above ₹250 to apply the coupon.");
        }
    });
  
    document.querySelectorAll(".plus").forEach(btn => btn.addEventListener("click", increaseQuantity));
    document.querySelectorAll(".minus").forEach(btn => btn.addEventListener("click", decreaseQuantity));
    document.querySelectorAll(".yes").forEach(btn => btn.addEventListener("click", confirmRemove));
    document.querySelectorAll(".no").forEach(btn => btn.addEventListener("click", cancelRemove));
    document.querySelectorAll(".add-to-mylist").forEach(btn => btn.addEventListener("click", addToMyList));

  }
  
  // Load and display cart items
  function loadCart() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const cartTotalOriginal = document.getElementById("cart-total-original");
    const cartTotalDiscounted = document.getElementById("cart-total-discounted");
  
    cartItemsContainer.innerHTML = "";
    let total = 0;
  
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<font size=15><p>Your Cart Is Empty!</p></font>";
        return;
    }
  
    cartItems.forEach((item, index) => {
        item.price = parseFloat(item.price); // Ensure price is a number
  
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div>Price: ₹${item.price.toFixed(2)}</div>
                <div>Quantity: ${item.weight}</div> <!-- Add weight here -->
                <div class="cart-item-quantity">
                    <button class="minus" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="plus" data-index="${index}">+</button>
                    <button class="add-to-mylist" data-index="${index}">Add To MyList</button>
                </div>
            </div>
            <div class="cart-item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
            <div class="confirm-remove" id="confirm-remove-${index}">
                <p>Are you sure you want to remove this item?</p>
                <button class="yes" data-index="${index}">Yes</button>
                <button class="no">No</button>
            </div>
        `;
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItem);
    });
  
    cartTotal.innerText = `Total: ₹${total.toFixed(2)}`;
    cartTotalOriginal.style.display = 'none';
    cartTotalDiscounted.style.display = 'none';
  
    document.getElementById("apply-coupon").addEventListener("click", () => {
        if (total >=250 ) {
            const couponCode = document.getElementById("coupon-code").value;
            if (couponCode === "FRESH50") {
                alert("Coupon applied successfully! 50% off your total.");
                const discountedTotal = total * 0.5;
  
                cartTotalOriginal.innerText = `Original Total: ₹${total.toFixed(2)}`;
                cartTotalDiscounted.innerText = `Discounted Total: ₹${discountedTotal.toFixed(2)}`;
  
                cartTotalOriginal.style.display = 'block';
                cartTotalDiscounted.style.display = 'block';
                cartTotal.style.display = 'none';
            } else {
                alert("Invalid coupon code.");
            }
        } else {
            alert("Total must be above ₹250 to apply the coupon.");
        }
    });
  
    document.querySelectorAll(".plus").forEach(btn => btn.addEventListener("click", increaseQuantity));
    document.querySelectorAll(".minus").forEach(btn => btn.addEventListener("click", decreaseQuantity));
    document.querySelectorAll(".yes").forEach(btn => btn.addEventListener("click", confirmRemove));
    document.querySelectorAll(".no").forEach(btn => btn.addEventListener("click", cancelRemove));
    document.querySelectorAll(".add-to-mylist").forEach(btn => btn.addEventListener("click", addToMyList));
  }
  
  // Add item to MyList
  function addToMyList(event) {
    const index = event.target.dataset.index;
    const cartItems = getCartItems();
    const myListItems = JSON.parse(localStorage.getItem("myListItems")) || [];
  
    const itemToAdd = cartItems[index];
    if (!myListItems.find(item => item.id === itemToAdd.id)) {
        myListItems.push(itemToAdd);
        localStorage.setItem("myListItems", JSON.stringify(myListItems));
        alert(`${itemToAdd.name} has been added to My List!`);
    } else {
        alert(`${itemToAdd.name} is already in My List.`);
    }
  }

  async function updateCartItem(cartItemId, quantity){

    console.log("cartItemId", cartItemId);
    console.log("quantity", quantity);

    const response = await fetch("http://localhost:5000/api/cart/update", {
        method:"PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cart_item_id: cartItemId,
            quantity: quantity
        }),
    });

    console.log("response from update api == ", response);
    const data = await response.json();
    console.log("response.data from update api == ", data);

  }
  
  // Increase quantity
  async function increaseQuantity(event) {
    const index = event.target.dataset.index;
    const cartItems = await getCartItemsAPI();
    cartItems[index].quantity += 1;
    saveCartItems(cartItems);
    await updateCartItem(cartItems[index].id, cartItems[index].quantity);
    await loadCartAPI();
  }
  
  // Decrease quantity
  async function decreaseQuantity(event) {
    const index = event.target.dataset.index;
    
    const cartItems = await getCartItemsAPI();

    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity -= 1;
        saveCartItems(cartItems);
        await updateCartItem(cartItems[index].id, cartItems[index].quantity);
        await loadCartAPI();

    } else {
        document.getElementById(`confirm-remove-${index}`).style.display = "block";
    }
  }
  
  // Confirm removal
  function confirmRemove(event) {
    const index = event.target.dataset.index;
    const cartItems = getCartItems();
    cartItems.splice(index, 1);
    saveCartItems(cartItems);
    // loadCart();
    loadCartAPI();
  }
  
  // Cancel removal
  function cancelRemove(event) {
    event.target.parentElement.style.display = "none";
  }
  
  // Clear the cart
  document.getElementById("clear-cart").addEventListener("click", () => {
    localStorage.removeItem("cartItems");
    load
    // loadCart();
    loadCartAPI();
    alert("Cart cleared!");
  });
  
 
  function validateCheckoutDetails() {
      const address = document.getElementById("address").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const phoneRegex = /^[0-9]{10}$/; // Validates 10-digit phone numbers
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validates email format
  
      if (!address) {
          alert("Please enter your address.");
          return false;
      }
      if (!phoneRegex.test(phone)) {
          alert("Please enter a valid 10-digit phone number.");
          return false;
      }
      if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return false;
      }
      return true;
  }
  
  // Proceed to Checkout
  document.getElementById("checkout").addEventListener("click", async () => {
      const cartItems = getCartItems();
      if (cartItems.length === 0) {
          alert("Your cart is empty!");
          return;
      }
  
      // Validate address and contact details
      if (!validateCheckoutDetails()) {
          return;
      }
  
      const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
      try {
          const response = await fetch("http://localhost:5000/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  amount: totalAmount,
                  receipt: `receipt_${new Date().getTime()}`,
              }),
          });
  
          const order = await response.json();
  
          const options = {
              key: "rzp_test_ZEsh3BtedaNCaU", // Replace with your Razorpay key ID
              amount: order.amount,
              currency: order.currency,
              name: "FreshCart",
              description: "Test Transaction",
              order_id: order.id,
              prefill: {
                  name: document.getElementById("address").value,
                  email: document.getElementById("email").value,
                  contact: document.getElementById("phone").value,
              },
              handler: async function (response) {
                  try {
                      const verifyResponse = await fetch("http://localhost:5000/verify-Payment", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(response),
                      });
  
                      const verifyResult = await verifyResponse.json();
                      if (verifyResult.error) {
                          alert("Payment verification failed!");
                      } else {
                          alert("Your payment is completed!");
                          moveToOrders(cartItems); // Move items to order.html
                      }
                  } catch (err) {
                      console.error("Payment verification error:", err);
                      alert("Payment verification failed!");
                  }
              },
          };
  
          const rzp = new Razorpay(options);
          rzp.open();
      } catch (err) {
          console.error("Error during checkout:", err);
          alert("Failed to proceed with checkout.");
      }
  });
  
  // Move cart items to order.html
  function moveToOrders(cartItems) {
      localStorage.setItem("orderItems", JSON.stringify(cartItems)); // Save order items to localStorage
      localStorage.removeItem("cartItems"); // Clear the cart
      window.location.href = "order.html"; // Redirect to order page
  }
  
  // Load cart on page load
//   loadCart();
  loadCartAPI();