import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return Response.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        products: {
          include: {
            product: true, // ✅ This ensures the product details (name, file) are included
          },
        },
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    const products = order.products.map((op) => ({
      id: op.product.id, // ✅ Correctly reference the product
      name: op.product.name,
      file: `/downloads/product${op.product.id}.zip`,
    }));

    return Response.json({ products });
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
