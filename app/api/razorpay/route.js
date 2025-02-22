import Razorpay from "razorpay";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { cart } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay API keys");
      return NextResponse.json(
        { error: "Payment service is not configured. Please try again later." },
        { status: 500 }
      );
    }

    // ✅ Calculate total amount in paise safely
    const totalAmount = cart.reduce((sum, item) => {
      const price = Number(item.price) || 0; // Ensure valid number
      return sum + price;
    }, 0) * 100;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // ✅ Auto-capture payment
    };

    try {
      const order = await razorpay.orders.create(options);

      // ✅ Save the order in the database
      const newOrder = await prisma.order.create({
        data: {
          id: order.id, // ✅ Store Razorpay Order ID
          products: {
            create: cart.map((product) => ({
              product: { connect: { id: product.id } },
            })),
          },
        },
      });

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (err) {
      console.error("Failed to create Razorpay order:", err);
      return NextResponse.json(
        { error: "Payment processing failed. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Razorpay API Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
