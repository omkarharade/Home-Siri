import express from "express";
import { signup, login } from "../controllers/userController.js";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "../controllers/cartController.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// Order routes
router.post("/order", createOrder);
router.get("/orders", getOrders);

// Cart routes
router.get("/cart", getCart);
router.post("/cart/add", addToCart);
router.put("/cart/update", updateCartItem);
router.delete("/cart/item/:cart_item_id", removeFromCart);
router.delete("/cart/:cart_id/clear", clearCart);

export default router;