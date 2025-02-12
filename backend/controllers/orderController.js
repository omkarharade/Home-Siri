import Order from "../model/order.js";
import { Op } from "sequelize";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: "rzp_test_ZEsh3BtedaNCaU", // Replace with your actual Razorpay key
  key_secret: "PIApMOZcNKbj8eElMilQqzxx", // Replace with your Razorpay secret
});

// Create a new order (Generate payment order)
export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required." });
    }

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating payment order", error: err });
    console.error(err);
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment data." });
    }

    const generatedSignature = crypto
      .createHmac("sha256", "PIApMOZcNKbj8eElMilQqzxx")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error verifying payment", error: err });
    console.error(err);
  }
};

// Create a new order in DB after payment success
export const createOrder = async (req, res) => {
  try {

    const { user_id, total, address, phone, email, coupon_applied } = req.body;

    console.log("value of coupon_applied inside backend == ", coupon_applied);
    console.log("value of coupon_applied || false inside backend == ", coupon_applied || false);
    if (!user_id || !total || !address || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields." });
    }


    const newOrder = await Order.create({
      user_id,
      total,
      address,
      phone,
      email,
      status: "completed",
      coupon_applied: coupon_applied || false

    });

    res.status(201).json({ message: "Order created successfully", newOrder });
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err });
    console.error(err);
  }
};

// Get all orders (for a specific user or all)
export const getOrders = async (req, res) => {
  try {
    const { user_id } = req.query;

    let orders;
    if (user_id) {
      orders = await Order.findAll({ where: { user_id } });
    } else {
      orders = await Order.findAll();
    }

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
    console.error(err);
  }
};
