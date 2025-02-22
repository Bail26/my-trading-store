import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { productId, value, userId } = await req.json();

    if (!productId || !value || value < 1 || value > 5) {
      return Response.json({ error: "Invalid rating value" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user has already rated this product
    const existingRating = await prisma.rating.findFirst({
      where: { productId: parseInt(productId), userId },
    });

    if (existingRating) {
      // Update existing rating
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { value: parseFloat(value) },
      });
    } else {
      // Create new rating
      await prisma.rating.create({
        data: {
          productId: parseInt(productId),
          userId,
          value: parseFloat(value),
        },
      });
    }

    // Recalculate the average rating
    const ratings = await prisma.rating.findMany({
      where: { productId: parseInt(productId) },
      select: { value: true },
    });

    const averageRating =
      ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

    // Update the product's average rating
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { rating: averageRating },
    });

    return Response.json({ success: true, newRating: averageRating, userRating: value });
  } catch (error) {
    return Response.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
