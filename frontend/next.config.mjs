/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite chamadas ao backend NestJS durante SSR
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
