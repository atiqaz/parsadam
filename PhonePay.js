import {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest
} from "@phonepe-pg/pg-sdk-node";

import { randomUUID } from "crypto";

const clientId = process.env.PHONEPAY_CLIENTID;
const clientSecret = process.env.PHONEPAY_SECRETID;
const clientVersion = 1;
const env = Env.SANDBOX;

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

export async function createOrder(req, res) {
  try {
    const merchantOrderId = randomUUID();
    const amount = req.body.amount || 1000;
    const redirectUrl = "http://localhost:5173";

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .build();

    const response = await client.pay(request);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Order created successfully",
      data: { merchantOrderId, redirectUrl: response.redirectUrl },
    });
  } catch (error) {
    console.error("Order Creation Failed:", error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: error.message || "Order creation failed",
      data: null,
    });
  }
}



