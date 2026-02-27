/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**'
      }
    ]
  },
  env: {
    NEXT_APP_VERSION: 'v3.0.0',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000/',
    NEXT_APP_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_APP_API_URL: process.env.NEXT_APP_API_URL || 'https://mock-data-api-nextjs.vercel.app',
    NEXT_APP_JWT_SECRET: process.env.NEXT_APP_JWT_SECRET || 'ikRgjkhi15HJiU78-OLKfjngiu',
    NEXT_APP_JWT_TIMEOUT: process.env.NEXT_APP_JWT_TIMEOUT,
    NEXTAUTH_SECRET_KEY: process.env.NEXTAUTH_SECRET_KEY
  }
};

export default nextConfig;
