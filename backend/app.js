import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Razorpay from "razorpay";
import authRouter from "./routes/userRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js"
import listRouter from "./routes/listRoutes.js"
import crypto from "crypto";
import cron from "node-cron";
import User from "../backend/model/user.js";
import List from "./model/list.js";
import ListItem from "./model/listItem.js";
import Order from "./model/order.js";
import { Op } from 'sequelize';
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/api/auth", authRouter);  // Auth routes (signup/login)
app.use("/api/orders", orderRouter); // Order routes (create/get)
app.use("/api/cart", cartRouter);
app.use("/api/list", listRouter);



const razorpay = new Razorpay({
  key_id: "rzp_test_ZEsh3BtedaNCaU", // Replace with your actual Razorpay key
  key_secret: "PIApMOZcNKbj8eElMilQqzxx", // Replace with your Razorpay secret
});


// Function to process scheduled lists
const processScheduledLists = async () => {
  try {
    const now = new Date();
    
    // Find lists where schedule_date and schedule_time are due
    const dueLists = await List.findAll({
      where: {
        status: "scheduled",
        schedule_date_time: { [Op.lte]: now }, // Compare date
      },
      include: [ListItem],
    });

    console.log("dueLists", dueLists)

    for (const list of dueLists) {
      if (!list.ListItems.length) continue; // Skip empty lists

      // Create an order from the list
      await Order.create({
        user_id: list.user_id,
        total: list.total,
        address: list.address, // Fetch from user profile if needed
        phone: list.phone, // Fetch from user profile
        email: list.email, // Fetch from user profile
        status: "completed",
      });

       // Delete all list items first to maintain referential integrity
       await ListItem.destroy({ where: { list_id: list.id } });

       // Delete the list after processing
       await list.destroy();
    }

    console.log(`Processed and deleted ${dueLists.length} scheduled lists.`);
  } catch (err) {
    console.error("Error processing scheduled lists:", err);
  }
};

cron.schedule('* * * * *', async () => { // Runs every minute
  const now = new Date();
  await User.update(
    { have_premium: false },
    { where: { premium_expires_at: { [Op.lt]: now } } }
  );
  console.log('Checked and downgraded expired premium users.');

  console.log("Running scheduled list processing...");
  await processScheduledLists();
});

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
