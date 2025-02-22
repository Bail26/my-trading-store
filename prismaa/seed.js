import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Trading Ocean Open Interest Sheet",
        price: 1,
        images: JSON.stringify([
          "/products/product1-1.jpg",
          "/products/product1-2.jpg",
          "/products/product1-3.jpg",
        ]),
        rating: 0, // Initial rating is 0
        downloadCount: 0, // No downloads initially
      },
      {
        name: "Trading Journal 2.0",
        price: 1,
        images: JSON.stringify([
          "/products/product2-1.jpg",
          "/products/product2-2.jpg",
          "/products/product2-3.jpg",
        ]),
        rating: 0, // Initial rating is 0
        downloadCount: 0, // No downloads initially
      },
    ],
  });

  console.log("✅ Products added successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
