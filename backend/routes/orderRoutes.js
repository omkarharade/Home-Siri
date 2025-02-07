import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";

const router = express.Router();

// Order routes
router.post("/order", createOrder);
router.get("/orders", getOrders);



export default router;