/* Demo purposes only */
/*
$(".hover").mouseleave(
    function () {
      $(this).removeClass("hover");
    }
  );
  $(document).ready(function() {
    $('#autoWidth').lightSlider({
        autoWidth:true,
        loop:true,
        onSliderLoad: function() {
            $('#autoWidth').removeClass('cS-hidden');
        } 
    });  
  });

      $(document).ready(function () {
          // Remove lightSlider initialization since we are not using it
      });

      document.addEventListener('DOMContentLoaded', () => {
          const cart = [];

          document.querySelectorAll('.add-cart').forEach(button => {
              button.addEventListener('click', (event) => {
                  const productBox = event.target.closest('.product-box');
                  const productName = productBox.querySelector('.p-name').textContent;
                  const productPrice = productBox.querySelector('.p-price').textContent;
                  const quantity = productBox.querySelector('.quantity').value;

                  const product = {
                      name: productName,
                      price: productPrice,
                      quantity: parseInt(quantity)
                  };

                  addToCart(product);
              });
          });

          function addToCart(product) {
              const existingProduct = cart.find(item => item.name === product.name);
              if (existingProduct) {
                  existingProduct.quantity += product.quantity;
              } else {
                  cart.push(product);
              }
              updateCartUI();
          }

          function updateCartUI() {
              const cartItemsContainer = document.getElementById('cart-items');
              cartItemsContainer.innerHTML = ''; // Clear the container
              cart.forEach(product => {
                  const productDiv = document.createElement('div');
                  productDiv.textContent = `${product.name} - ${product.price} x ${product.quantity}`;
                  cartItemsContainer.appendChild(productDiv);
              });
          }

          const cartLink = document.getElementById('cart-link');
          const modal = document.getElementById('cartModal');
          const span = document.getElementsByClassName('close')[0];

          cartLink.onclick = function () {
              modal.style.display = 'block';
          };

          span.onclick = function () {
              modal.style.display = 'none';
          };

          window.onclick = function (event) {
              if (event.target == modal) {
                  modal.style.display = 'none';
              }
          };
      });

      $(".hover").mouseleave(
          function () {
              $(this).removeClass("hover");
          }
      );
*/