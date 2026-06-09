import {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
  MetaInfo
} from "@phonepe-pg/pg-sdk-node";

import { randomUUID } from "crypto";

const clientId = process.env.PHONEPAY_CLIENTID;
const clientSecret = process.env.PHONEPAY_SECRETID;
const clientVersion = 1;
const env = Env.PRODUCTION;

const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

export async function createOrder(req, res) {
  try {
    const merchantOrderId = randomUUID();
    const { amount = 1000, name: userNaam, mobile: userMobile, notes: userNotes } = req.body;
    const baseUrl = "https://parsadamseva.com";
    const redirectUrl = `${baseUrl}?name=${encodeURIComponent(userNaam || "")}&mobile=${encodeURIComponent(userMobile || "")}&notes=${encodeURIComponent(userNotes || "")}&orderId=${merchantOrderId}`;

    const metaInfo = MetaInfo.builder()
      .udf1(userNaam || "")
      .udf2(userMobile || "")
      .udf3(userNotes || "")
      .build();

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount)
      .redirectUrl(redirectUrl)
      .metaInfo(metaInfo)
      .build();

    const response = await client.pay(request);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Order created successfully",
      data: { merchantOrderId, redirectUrl: response.redirectUrl, userNaam, userMobile, userNotes },
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



