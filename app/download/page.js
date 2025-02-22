"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { notFound } from "next/navigation";

const productDownloads = {
  "1": { name: "Trading Ocean Open Interest Sheet", file: "/downloads/product1.zip", size: "2MB" },
  "2": { name: "Trading Journal 2.0", file: "/downloads/product2.zip", size: "5MB" },
};

function DownloadContent() {
  const searchParams = useSearchParams();
  const [downloads, setDownloads] = useState([]);
  const [isVerified, setIsVerified] = useState(null);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setIsVerified(false);
      return;
    }

    async function fetchPurchasedProducts() {
      try {
        const res = await fetch(`/api/orders?orderId=${orderId}`);
        if (!res.ok) throw new Error("Invalid order ID");

        const { products } = await res.json();
        const downloadLinks = products.map((product) => ({
          ...productDownloads[product.id.toString()],
          id: product.id,
        })).filter(Boolean);

        setDownloads(downloadLinks);
        setIsVerified(true);
      } catch (error) {
        console.error("Order verification failed:", error);
        setIsVerified(false);
      }
    }

    fetchPurchasedProducts();
  }, [orderId]);

  const handleDownload = async (productId) => {
    try {
      await fetch(`/api/download/${productId}`, { method: "POST" });
    } catch (error) {
      console.error("Failed to update download count:", error);
    }
  };

  if (isVerified === false) {
    notFound();
    return null;
  }

  if (isVerified === null) {
    return <p className="text-center mt-6">Verifying purchase...</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold">Download Your Purchased Files</h1>
      <p className="text-gray-600 mt-2">Click below to download your files.</p>

      {downloads.length > 0 ? (
        <div className="mt-4 space-y-4">
          {downloads.map((file) => (
            <a
              key={file.id}
              href={file.file}
              download
              rel="noopener noreferrer"
              className="block bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
              onClick={() => handleDownload(file.id)}
            >
              Download {file.name} {file.size ? `(${file.size})` : ""}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-red-500 mt-4">No downloads found!</p>
      )}
    </div>
  );
}

export default function DownloadPage() {
  return (
    <Suspense fallback={<p className="text-center mt-6">Loading...</p>}>
      <DownloadContent />
    </Suspense>
  );
}
