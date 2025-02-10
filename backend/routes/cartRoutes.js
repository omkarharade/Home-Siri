import express from "express";
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "../controllers/cartController.js";

const router = express.Router();

// Cart routes
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/item/:cart_item_id", removeFromCart);
router.delete("/clear/:cart_id", clearCart);

export default router;