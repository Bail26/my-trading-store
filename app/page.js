"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartstore";
import loadRazorpay from "@/utils/razorpay";
import VideoGallery from "@/components/VideoGallery";
import ProductList from "@/components/ProductList";
import ContactInfo from "@/components/ContactInfo";
import { useState } from "react";

export default function Home() {
  const { cart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const handlePayment = async () => {
    setLoading(true);
    try {
      await loadRazorpay(cart);
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="bg-gray-100 min-h-screen">
  {/* Sticky Wrapper for Header + Marquee */}
  <div className="sticky top-0 left-0 w-full z-50">
    {/* Sticky Header */}
    <header className="bg-gradient-to-r from-white via-gray-500 to-black text-white shadow-md py-4">
      <div className="flex items-center justify-between w-full px-6">
        {/* Logo & Store Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            width={60}
            height={60}
            alt="Logo"
            loading="lazy"
            priority={false}
            className="drop-shadow-lg brightness-110 contrast-125"
          />
          <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-black via-orange-500 to-white bg-clip-text text-transparent drop-shadow-lg">
            Trading Ocean Store
          </h1>
        </div>

        {/* Cart, Price & Buy Button */}
        <div className="flex items-center gap-6">
          {cart.length > 0 && (
            <>
              <div className="bg-black text-white px-4 py-2 rounded-lg shadow-md text-lg font-semibold">
                ₹{totalPrice}
              </div>

              <button
                onClick={handlePayment}
                className={`px-5 py-2 rounded-lg shadow-md font-semibold transition-all ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Processing..." : "Buy Now"}
              </button>
            </>
          )}

          {cart.length > 0 && (
            <div className="relative">
              <ShoppingCart size={28} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {cart.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Sticky Marquee Section */}
    <div className="marquee-container">
      <div className="marquee">
        <span className="marquee-content">⚡ Instant Download After Payment is Done ⚡</span>
        <span className="marquee-content">⚡ Life Time Free (No subscription required) ⚡</span>
        <span className="marquee-content">⚡ Instant Download After Payment is Done ⚡</span>
        <span className="marquee-content">⚡ Life Time Free (No subscription required) ⚡</span>
        <span className="marquee-content">⚡ Receive New Update Alerts in Every Excel Product ⚡</span>
      </div>
    </div>
  </div>

  {/* Product List & Video Gallery */}
  <main className="max-w-5xl mx-auto p-6">
    <ProductList />
    <VideoGallery />
  </main>

  {/* Contact & Social Media Section */}
  <ContactInfo />
</div>

  );
}
