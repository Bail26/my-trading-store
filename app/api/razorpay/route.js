import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { cart } = await req.json();

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Calculate total amount in paise
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0) * 100;

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

    const order = await razorpay.orders.create(options);

    // ✅ Return order details properly
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
