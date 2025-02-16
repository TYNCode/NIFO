const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", 
});

module.exports = withPWA({
  env: {
    PUBLIC_BASE_URL_LOCAL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "media.licdn.com",
      "encrypted-tbn0.gstatic.com",
      "www.wofsummit.com",
      "lh3.googleusercontent.com",
    ],
  },
});
