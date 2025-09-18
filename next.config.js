/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",        // kalau akses root
        destination: "/dasboard", // diarahkan ke /dasboard
        permanent: false,   // false karena masih dev
      },
    ]
  },
}

module.exports = nextConfig
