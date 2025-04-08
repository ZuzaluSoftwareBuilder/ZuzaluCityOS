import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PUBLIC_CERAMIC_API_ENDPOINT: process.env.PUBLIC_CERAMIC_API_ENDPOINT,
    PUBLIC_GRAPHQL_URI: process.env.PUBLIC_GRAPHQL_URI,
    PUBLIC_INDEXING_DID: process.env.PUBLIC_INDEXING_DID,
    PUBLIC_W3_STORAGE_DELEGATE_BASE_URL:
      process.env.PUBLIC_W3_STORAGE_DELEGATE_BASE_URL,
    PUBLIC_WALLET_CONNECT_PROJECT_ID:
      process.env.PUBLIC_WALLET_CONNECT_PROJECT_ID,
    PUBLIC_LOG_LEVEL: process.env.PUBLIC_LOG_LEVEL,
    PUBLIC_API_STATUS_PATH: process.env.PUBLIC_API_STATUS_PATH,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'framerusercontent.com',
        pathname: '/images/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'nftstorage.link',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'scarlet-binding-hummingbird-437.mypinata.cloud',
        pathname: '/ipfs/**',
        port: '',
      },
      // https://gateway.lighthouse.storage
      {
        protocol: 'https',
        hostname: 'gateway.lighthouse.storage',
        pathname: '/ipfs/**',
        port: '',
      },
      {
        protocol: 'https',
        hostname:
          'bafkreifje7spdjm5tqts5ybraurrqp4u6ztabbpefp4kepyzcy5sk2uel4.ipfs.nftstorage.link',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'pub-d00cee3ff1154a18bdf38c29db9a51c5.r2.dev',
        pathname: '**',
        port: '',
      },
    ],
  },
  experimental: {
    turbo: {},
    webpackMemoryOptimizations: true,
  },
};

export default withBundleAnalyzer(nextConfig);
