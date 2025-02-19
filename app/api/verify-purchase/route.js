import { NextResponse } from "next/server";

// Mock database of user purchases (replace with real DB check)
const userPurchases = {
  "user123": ["1", "2"], // Example: This user has purchased Product 1 & 2
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // Assume user is authenticated and we get their ID
  const productIds = searchParams.get("products")?.split(",") ?? [];

  if (!userId || productIds.length === 0) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }

  // Check if user has access to the requested products
  const purchasedItems = userPurchases[userId] || [];
  const isAuthorized = productIds.every((id) => purchasedItems.includes(id));

  if (!isAuthorized) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({ success: true, message: "Purchase verified" });
}
