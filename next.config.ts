/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/preview/:path*',
        destination: 'http://golang.n8n-wsk.com:8080/previews/:path*',
      },
    ]
  },
}

module.exports = nextConfig
