/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "https://resell-hub-server-two.vercel.app/api/auth/:path*",
      },
      {
        source: "/server/:path*",
        destination: "https://resell-hub-server-two.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;