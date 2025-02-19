"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartstore";
import loadRazorpay from "@/utils/razorpay";
import { useState } from "react";

const VideoGallery = dynamic(() => import("@/components/VideoGallery"), { ssr: false });
const ProductList = dynamic(() => import("@/components/ProductList"), { ssr: false });

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
    <div className="p-6 max-w-5xl mx-auto bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-r from-white via-gray-500 to-black text-white px-6 py-4 rounded-lg shadow-md w-full">
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

        <div className="flex items-center gap-6">
          {cart.length > 0 && (
            <>
              <div className="bg-black text-white px-4 py-2 rounded-lg shadow-md text-lg font-semibold">
                ₹{totalPrice}
              </div>

              <button
                onClick={handlePayment}
                className={`px-5 py-2 rounded-lg shadow-md font-semibold transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
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
      </header>

      {/* Marquee */}
      <div className="marquee-container mt-4">
        <div className="marquee">
          <span className="marquee-content">⚡ Instant Download After Payment is Done ⚡</span>
          <span className="marquee-content">⚡ Instant Download After Payment is Done ⚡</span>
        </div>
      </div>

      <ProductList />
      <VideoGallery />
    </div>
  );
}
