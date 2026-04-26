const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(stl)$/,
      use: [
        {
          loader: 'raw-loader',
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;