const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/server/:path*",
        destination: "https://resell-hub-server-two.vercel.app/:path*",
      },
    ];
  },
};

export default nextConfig;