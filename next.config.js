require('dotenv').config({ path: `${process.env.ENVIRONMENT}` });

const semi = require('@douyinfe/semi-next').default({
  /* the extension options */
});
// const SemiWebpackPlugin = require('@douyinfe/semi-webpack-plugin').default;

module.exports = semi({
  reactStrictMode: false,
  swcMinify: true,
  transpilePackages: ['@douyinfe/semi-ui', '@douyinfe/semi-icons'],
  webpack: (config, { webpack }) => {
    // Semi UI's CJS index.js has `require('./_base/base.css')`, which Node can't parse during SSR.
    // The base CSS is already loaded globally via styles/globals.scss
    // (`@import '~@douyinfe/semi-ui/dist/css/semi.min.css'`), so we ignore inline CSS requires
    // emitted from inside Semi packages.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.css$/,
        contextRegExp: /[\\/]node_modules[\\/]@douyinfe[\\/]semi-(ui|icons|foundation)[\\/]/,
      })
    );
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beam-common.s3.ap-southeast-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    const baseHeaders = [
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-XSS-Protection', value: '0' },
    ];
    const prodOnlyHeaders = [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Content-Security-Policy', value: 'upgrade-insecure-requests' },
    ];
    return [
      {
        source: '/:path*',
        headers: isProd ? [...baseHeaders, ...prodOnlyHeaders] : baseHeaders,
      },
    ];
  },
  // webpack(config, options) {
  //   config.plugins.push(
  //     new SemiWebpackPlugin({
  //       theme: '@semi-bot/semi-theme-beam',
  //       include: '~@semi-bot/semi-theme-beam/scss/local.scss',
  //     })
  //   );

  //   return config;
  // },
});
