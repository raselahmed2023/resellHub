const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/server/:path*",
        destination: "https://resellhub-server-1.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;