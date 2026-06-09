import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { createOrder } from "./PhonePay.js";
import router from "./routes.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/phonepay',router)

// GET ALL SUBSCRIPTIONS
app.get("/getSubscriptions", async (req, res) => {
  try {

    const subscriptions = await razorpay.subscriptions.all({
      count: 100,
    });

    return res.json({
      success: true,
      subscriptions,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});