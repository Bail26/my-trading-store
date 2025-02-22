"use client";

import { FaInstagram, FaYoutube } from "react-icons/fa";

export default function ContactInfo() {
  return (
    <div className="p-6 bg-gray-200 text-center mt-12 border-t border-gray-300">
      <h2 className="text-xl font-semibold">Get in Touch</h2>
      <p className="mt-2">
        Support Email:{" "}
        <a href="mailto:tradingocean.query@gmail.com" className="text-blue-600 hover:underline">
        tradingocean.query@gmail.com
        </a>
      </p>
      <p>
        Contact:{" "}
        <a href="tel:+918266009412" className="text-blue-600 hover:underline">
        +918266009412
        </a>
      </p>

      <div className="flex justify-center mt-4 space-x-6">
        <a href="https://instagram.com/tradingocean" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-600 text-3xl hover:text-pink-700" />
        </a>
        <a href="https://www.youtube.com/@TradingOcean" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="text-red-600 text-3xl hover:text-red-700" />
        </a>
      </div>

      <p className="mt-4 text-sm text-gray-600">No refund policy applies.</p>
    </div>
  );
}
