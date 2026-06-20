/** @type {import('next').NextConfig} */

function getImageHostname() {
  const imgUrl = process.env.NEXT_PUBLIC_IMG_URL || '';
  try {
    return new URL(imgUrl).hostname;
  } catch {
    return '';
  }
}

const imageHostname = getImageHostname();

const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 300,
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      ...(imageHostname
        ? [{ protocol: 'https', hostname: imageHostname }]
        : []),
      {
        protocol: 'https',
        hostname: 'skybuybd.com',
      },
      {
        protocol: 'https',
        hostname: 'skybuy.sgp1.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: 'global-img-cdn.1688.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'yousuf.mamatazshop.com',
      },
      {
        protocol: 'https',
        hostname: 'next.mamatazshop.com',
      },
      {
        protocol: 'https',
        hostname: 'next.babuei.com',
      },
      {
        protocol: 'https',
        hostname: 'panel.getgoods.com.bd',
      },
    ],
  },
};

module.exports = nextConfig;
