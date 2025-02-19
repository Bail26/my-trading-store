"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartstore";
import loadRazorpay from "@/utils/razorpay";
import VideoGallery from "@/components/VideoGallery";
import ProductList from "@/components/ProductList";
import { useMemo, useState } from "react";

export default function Home() {
  const { cart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const totalPrice = useMemo(
    () => cart.reduce((acc, item) => acc + item.price, 0),
    [cart]
  );

  const handlePayment = async () => {
    setLoading(true);
    await loadRazorpay(cart);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-100 min-h-screen">
      <header className="flex items-center justify-between bg-gradient-to-r from-white via-gray-500 to-black text-white px-6 py-4 rounded-lg shadow-md w-full">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            width={60}
            height={60}
            alt="Logo"
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
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md font-semibold transition-all"
                disabled={loading}
              >
                {loading ? "Processing..." : "Buy Now"}
              </button>
            </>
          )}

          <div className="relative">
            <ShoppingCart size={28} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="relative w-full overflow-hidden py-2 mt-4 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 shadow-md rounded-md">
        <div className="marquee flex whitespace-nowrap text-white text-sm font-bold tracking-wide uppercase">
          <span className="marquee-text">⚡ Instant Download After Payment is Done ⚡</span>
          <span className="marquee-text">⚡ Instant Download After Payment is Done ⚡</span>
        </div>
      </div>

      <ProductList />
      <VideoGallery />
    </div>
  );
}
