import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The panel and the galleries never need to tell visitors which framework runs them.
  poweredByHeader: false,
  // Links to routes that do not exist fail the type check.
  typedRoutes: true,
};

export default nextConfig;
