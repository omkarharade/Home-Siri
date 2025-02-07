import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Razorpay from "razorpay";
import authRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import router from "./routes/userRoutes.js"

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/api/auth", authRouter);  // Auth routes (signup/login)
app.use("/api/orders", router); // Order routes (create/get)
app.use("/api/cart", cartRouter);


// Payment Order Creation
app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise (1 INR = 100 paise)
      currency: currency || "INR",
      receipt: `receipt_${crypto.randomBytes(8).toString("hex")}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err.message);
    res.status(500).json({ error: "Failed to create order." });
  }
});

// Payment Verification
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", "PIApMOZcNKbj8eElMilQqzxx")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    res.json({ message: "Payment verified successfully." });
  } else {
    res.status(400).json({ error: "Payment verification failed." });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
