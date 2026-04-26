const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;