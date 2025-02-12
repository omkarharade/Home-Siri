import Cart from "../model/cart.js";
import CartItem from "../model/cartItem.js";
import { Op } from "sequelize";

// Get or create cart for user
export const getCart = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let [cart] = await Cart.findOrCreate({
      where: { 
        user_id,
        status: 'active'
      },
      include: [CartItem]
    });

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err });
    console.error(err);
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity, price, weight, image } = req.body;

    if (!user_id || !product_id || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get or create active cart for user
    let [cart] = await Cart.findOrCreate({
      where: { 
        user_id,
        status: 'active'
      }
    });

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id
      }
    });

    if (cartItem) {
      // Update quantity if item exists
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity: quantity || 1,
        price,
        weight: weight,
        image: image
      });
    }

    // Update cart total
    cart.total = await CartItem.sum('price', {
      where: { cart_id: cart.id }
    });
    await cart.save();

    res.status(200).json({ 
      message: "Item added to cart successfully",
      cart,
      cartItem
    });
  } catch (err) {
    res.status(500).json({ message: "Error adding item to cart", error: err });
    console.error(err);
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { cart_item_id, quantity } = req.body;

    if (!cart_item_id || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cartItem = await CartItem.findByPk(cart_item_id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Update cart total
    const cart = await Cart.findByPk(cartItem.cart_id);
    cart.total = await CartItem.sum('price', {
      where: { cart_id: cart.id }
    });
    await cart.save();

    res.status(200).json({ 
      message: "Cart item updated successfully",
      cartItem,
      cart
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart item", error: err });
    console.error(err);
  }
};

// add coupon to cart

// export const addCouponToCart = async (req, res) => {
//   try {
//     const { user_id, coupon_name, coupon_discount } = req.body;

//     if (!user_id || !coupon_name || !coupon_discount) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Update cart total
//     const cart = await Cart.findOne({
//       where: {
//         user_id: user_id
//       }
//     });

//     const cartTotal = cart.total = await CartItem.sum('price', {
//       where: { cart_id: cart.id }
//     });

//     cart.applied_coupon_name = coupon_name;
//     cart.coupon_discount = coupon_discount;
//     cart.total = cartTotal;

//     await cart.save();

//     res.status(200).json({ 
//       message: "Cart total updated successfully",
//       cart
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating cart item", error: err });
//     console.error(err);
//   }
// };



// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { cart_item_id } = req.params;

    const cartItem = await CartItem.findByPk(cart_item_id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const cart_id = cartItem.cart_id;
    await cartItem.destroy();

    // Update cart total
    const cart = await Cart.findByPk(cart_id);
    cart.total = await CartItem.sum('price', {
      where: { cart_id }
    });
    await cart.save();

    res.status(200).json({ 
      message: "Item removed from cart successfully",
      cart
    });
  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart", error: err });
    console.error(err);
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const { cart_id } = req.params;

    await CartItem.destroy({
      where: { cart_id }
    });

    const cart = await Cart.findByPk(cart_id);
    cart.total = 0;
    await cart.save();

    res.status(200).json({ 
      message: "Cart cleared successfully",
      cart
    });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart", error: err });
    console.error(err);
  }
};

