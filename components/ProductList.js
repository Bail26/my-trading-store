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

export default function ProductList() {
  const { cart, addToCart, removeFromCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [userRatings, setUserRatings] = useState({}); // Store user ratings locally
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(null);

  // Fetch products and user ratings from local storage
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        // Load user ratings from local storage
        const storedRatings = JSON.parse(localStorage.getItem("userRatings")) || {};
        setUserRatings(storedRatings);
      });
  }, []);

  // Submit user rating
  const submitRating = async (productId, value) => {
    setUserRatings((prev) => ({ ...prev, [productId]: value })); // Update UI instantly
    setRatingSubmitting(productId);

    const res = await fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, value, userId: "guest" }), // Replace "guest" with actual user ID if available
    });

    const data = await res.json();

    if (data.success) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, rating: data.newRating } : product
        )
      );

      // Save user rating in local storage
      const newRatings = { ...userRatings, [productId]: value };
      localStorage.setItem("userRatings", JSON.stringify(newRatings));
    }

    setRatingSubmitting(null);
  };

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
    setSelectedImage(JSON.parse(product.images)[index]);
  };

  // Next Image in Zoom
  const handleNextImage = () => {
    if (!currentProduct) return;
    const images = JSON.parse(currentProduct.images);
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  // Previous Image in Zoom
  const handlePrevImage = () => {
    if (!currentProduct) return;
    const images = JSON.parse(currentProduct.images);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  // Close Zoom
  const closeZoom = () => setSelectedImage(null);

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white border border-gray-200 shadow-lg rounded-lg p-4">
          {/* Image Carousel */}
          <Swiper modules={[Pagination]} pagination={{ clickable: true }} loop>
            {JSON.parse(product.images)?.map((img, idx) => (
              <SwiperSlide key={idx}>
                <Image
                  src={img}
                  width={400}
                  height={400}
                  alt={`${product.name} image ${idx + 1}`}
                  className="rounded-lg mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
                  unoptimized
                  onClick={() => openImage(product, idx)} // ✅ Add this to enable zooming
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Product Info */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold">{product.name}</h2>

            {/* Interactive Rating System */}
            <div className="flex justify-center items-center text-yellow-500 mt-1 space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  disabled={ratingSubmitting === product.id}
                  onClick={() => submitRating(product.id, i + 1)}
                  className="focus:outline-none"
                >
                  {/* Show user's selected rating if they have rated, otherwise show average */}
                  {userRatings[product.id] >= i + 1 ? (
                    <FaStar />
                  ) : product.rating >= i + 1 ? (
                    <FaStar />
                  ) : product.rating > i ? (
                    <FaStarHalfAlt />
                  ) : (
                    <FaRegStar />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500">Click a star to rate</p>

            <p className="text-blue-700 font-bold text-xl mt-2">₹{product.price}</p>
            <p className="text-gray-600 mt-1">Downloads: {product.downloadCount}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-3 px-2">
            {product.youtubeLink && (
              <a href={product.youtubeLink} target="_blank" className="text-blue-500">
                <Youtube size={24} />
              </a>
            )}

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
