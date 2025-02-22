import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Extract the product ID from the request URL
    const urlParts = req.nextUrl.pathname.split("/");
    const id = urlParts[urlParts.length - 1]; // Get the last part of the URL

    if (!id || isNaN(id)) {
      return Response.json({ error: "Invalid Product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { downloadCount: { increment: 1 } }, // ✅ Increments the count
    });

    return Response.json({ success: true, newDownloadCount: product.downloadCount + 1 });
  } catch (error) {
    console.error("Error in download API:", error);
    return Response.json({ error: "Failed to update download count" }, { status: 500 });
  }
}
