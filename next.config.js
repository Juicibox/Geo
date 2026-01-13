/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuración para permitir iframe embedding desde cualquier dominio
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *;"
          }
        ],
      },
    ];
  },
}

module.exports = nextConfig
