/** @type {import('next').NextConfig} */
const nextConfig = {
  // O frontend chama a API do Render diretamente via NEXT_PUBLIC_API_URL.
  // Nenhum proxy local necessário — o CORS é gerenciado pelo NestJS.
};

export default nextConfig;
