/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix issue #23: hide framework info from response headers
  poweredByHeader: false,
  // Standalone output for Docker deployment
  output: 'standalone',
};

export default nextConfig;
