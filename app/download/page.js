"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { notFound } from "next/navigation"; // ✅ Prevents pre-render errors

const productDownloads = {
  "1": { name: "Product 1", file: "/downloads/product1.zip" },
  "2": { name: "Product 2", file: "/downloads/product2.zip" },
};

function DownloadContent() {
  const searchParams = useSearchParams();
  const [downloads, setDownloads] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const paymentSuccess = localStorage.getItem("paymentSuccess");

      if (!paymentSuccess) {
        notFound(); // 🚀 Redirect to 404 if no payment
        return;
      }

      const productIds = searchParams.get("products")?.split(",") || [];
      const downloadLinks = productIds
        .map((id) => productDownloads[id])
        .filter(Boolean);

      setDownloads(downloadLinks);
      setIsVerified(true);
    }
  }, [searchParams]);

  if (!isVerified) return <p className="text-center mt-6">Verifying purchase...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold">Download Your Purchased Files</h1>
      <p className="text-gray-600 mt-2">Click below to download your files.</p>

      {downloads?.length > 0 ? (
        <div className="mt-4 space-y-4">
          {downloads.map((file, index) => (
            <a
              key={index}
              href={file.file}
              download
              className="block bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
            >
              Download {file.name}
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
