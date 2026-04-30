/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skybuybd.com",
      },
      {
        protocol: "https",
        hostname: "skybuy.sgp1.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "global-img-cdn.1688.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "yousuf.mamatazshop.com",
      },
      {
        protocol: "https",
        hostname: "next.mamatazshop.com",
      },
      {
        protocol: "https",
        hostname: "next.babuei.com",
      },
    ],
  },
};

module.exports = nextConfig;
