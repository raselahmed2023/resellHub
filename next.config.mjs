const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/server/:path*",
        destination: "https://resellhub-server-1.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;