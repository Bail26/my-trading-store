"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Youtube, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cartstore";

// Sample Products
const products = [
  {
    id: 1,
    name: "Trading Ocean Open Interest Sheet",
    price: 1,
    images: ["/product1-1.jpg", "/product1-2.jpg", "/product1-3.jpg"],
    rating: 4.5,
    youtubeLink: "https://www.youtube.com/watch?v=pLPXz2lsyvY",
  },
  {
    id: 2,
    name: "Trading Journal 2.0",
    price: 1,
    images: ["/product2-1.jpg", "/product2-2.jpg", "/product2-3.jpg"],
    rating: 4.8,
    youtubeLink: "https://www.youtube.com/watch?v=aKFlAf6nHVU",
  },
];

export default function ProductList() {
  const { cart, addToCart, removeFromCart } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle Keyboard Navigation (Esc, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeZoom();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, selectedImage]);

  // Open Image Zoom
  const openImage = (product, index) => {
    setCurrentProduct(product);
    setCurrentIndex(index);
    setSelectedImage(product.images[index]);
  };

  // Next Image in Zoom
  const handleNextImage = () => {
    if (!currentProduct) return;
    const nextIndex = (currentIndex + 1) % currentProduct.images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(currentProduct.images[nextIndex]);
  };

  // Previous Image in Zoom
  const handlePrevImage = () => {
    if (!currentProduct) return;
    const prevIndex = (currentIndex - 1 + currentProduct.images.length) % currentProduct.images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(currentProduct.images[prevIndex]);
  };

  // Close Zoom
  const closeZoom = () => setSelectedImage(null);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 transition-all hover:scale-105 hover:shadow-xl"
        >
          {/* Image Carousel */}
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} loop>
            {product.images.map((img, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={img}
                  width={400}
                  height={400}
                  alt={`${product.name} image ${idx + 1}`}
                  className="rounded-lg mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
                  unoptimized
                  onClick={() => openImage(product, idx)} // Open zoom mode
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Product Info */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <p className="flex justify-center items-center text-yellow-500 mt-1">
              {Array.from({ length: 5 }).map((_, i) => {
                return product.rating >= i + 1 ? (
                  <FaStar key={i} />
                ) : product.rating > i ? (
                  <FaStarHalfAlt key={i} />
                ) : (
                  <FaRegStar key={i} />
                );
              })}
            </p>
            <p className="text-blue-700 font-bold text-xl mt-2">₹{product.price}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-3 px-2">
            <a href={product.youtubeLink} target="_blank" className="text-blue-500">
              <Youtube size={24} />
            </a>

            {cart.find((item) => item.id === product.id) ? (
              <button
                onClick={() => removeFromCart(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600 flex items-center"
              >
                <Trash2 size={18} className="mr-1" /> Remove
              </button>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Fullscreen Image Modal with Navigation */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          onClick={closeZoom} // Close when clicking outside
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-300"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selectedImage}
              width={800}
              height={800}
              alt="Full-size image"
              className="rounded-lg max-w-full max-h-screen"
              unoptimized
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-300"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
