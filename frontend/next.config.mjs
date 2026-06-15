/** @type {import('next').NextConfig} */
const nextConfig = {
  // Necessário para o Dockerfile multi-stage (node server.js standalone)
  output: 'standalone',
};

export default nextConfig;
