"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { notFound } from "next/navigation"; // ✅ Prevents pre-render errors

const productDownloads = {
  "1": { name: "Product 1", file: "/downloads/product1.zip", size: "2MB" },
  "2": { name: "Product 2", file: "/downloads/product2.zip", size: "5MB" },
};

function DownloadContent() {
  const searchParams = useSearchParams();
  const [downloads, setDownloads] = useState(null);
  const [isVerified, setIsVerified] = useState(null); // ✅ Use `null` for initial loading state
  const userId = "user123"; // 🔒 Replace with real authenticated user ID from session/auth

  useEffect(() => {
    async function verifyPurchase() {
      const productIds = searchParams.get("products")?.split(",") ?? [];
    
      if (!userId || productIds.length === 0) {
        setIsVerified(false);
        return;
      }
    
      try {
        // ✅ Fetch from the App Router API route
        const res = await fetch(`/api/verify-purchase?userId=${userId}&products=${productIds.join(",")}`);
        const data = await res.json();
    
        if (!data.success) {
          setIsVerified(false);
        } else {
          const downloadLinks = productIds
            .map((id) => productDownloads[id])
            .filter(Boolean);
          setDownloads(downloadLinks);
          setIsVerified(true);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setIsVerified(false);
      }
    }

    verifyPurchase();
  }, [searchParams]);

  // ✅ Redirect to 404 only after verification is complete
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

      {downloads?.length > 0 ? (
        <div className="mt-4 space-y-4">
          {downloads.map((file, index) => (
            <a
              key={index}
              href={file.file}
              download
              rel="noopener noreferrer"
              className="block bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
              aria-label={`Download ${file.name} (${file.size || "unknown size"})`}
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
