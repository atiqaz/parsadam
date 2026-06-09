import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { createOrder } from "./PhonePay.js";
import router from "./routes.js";
import pkg from "@phonepe-pg/pg-sdk-node/package.json" with { type: "json" };
import { createRequire } from "module";
const require = createRequire(import.meta.url);

dotenv.config();

const app = express();
const PORT = 5000;


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://parsadamseva.com"
  ],
  credentials: true,
}));

// app.options("*", cors());

app.use(express.json());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/debug", async (req, res) => {
  const ct = await import("class-transformer");

  res.json({
    node: process.version,
    phonepe: pkg.version,
    classTransformerKeys: Object.keys(ct),
  });
});


app.get("/debug-full", (req, res) => {
  const ct = require("class-transformer");

  res.json({
    resolved: require.resolve("class-transformer"),
    version: require("class-transformer/package.json").version,
    keys: Object.keys(ct),
    plainToClass: typeof ct.plainToClass,
  });
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