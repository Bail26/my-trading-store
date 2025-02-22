/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // ✅ Ensures Next.js serves local images correctly
  },
};

export default nextConfig;
