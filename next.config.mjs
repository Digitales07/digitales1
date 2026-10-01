/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async redirects() {
    return [
      // Old WordPress URLs: send them straight to the closest live page.
      // Destinations are absolute so old non-www URLs do not create a redirect chain.
      { source: "/about-us", destination: "https://www.digitales.pk/about", permanent: true },
      { source: "/about-us/", destination: "https://www.digitales.pk/about", permanent: true },
      { source: "/portfolio-sample", destination: "https://www.digitales.pk/portfolio", permanent: true },
      { source: "/portfolio-sample/", destination: "https://www.digitales.pk/portfolio", permanent: true },
      { source: "/team-category/:slug*", destination: "https://www.digitales.pk/about", permanent: true },
      {
        source: "/service/digital-pr-influencer-marketing",
        destination: "https://www.digitales.pk/services/digital-pr-influencer",
        permanent: true,
      },
      {
        source: "/service/digital-pr-influencer-marketing/",
        destination: "https://www.digitales.pk/services/digital-pr-influencer",
        permanent: true,
      },
      {
        source: "/service/social-media-marketing",
        destination: "https://www.digitales.pk/services/social-media-marketing",
        permanent: true,
      },
      {
        source: "/service/social-media-marketing/",
        destination: "https://www.digitales.pk/services/social-media-marketing",
        permanent: true,
      },
      {
        source: "/service/digital-media-buying",
        destination: "https://www.digitales.pk/services/digital-media-buying",
        permanent: true,
      },
      {
        source: "/service/digital-media-buying/",
        destination: "https://www.digitales.pk/services/digital-media-buying",
        permanent: true,
      },
      { source: "/service/seo", destination: "https://www.digitales.pk/services/seo", permanent: true },
      { source: "/service/seo/", destination: "https://www.digitales.pk/services/seo", permanent: true },
      {
        source: "/service/web-app-development",
        destination: "https://www.digitales.pk/services/web-app-development",
        permanent: true,
      },
      {
        source: "/service/web-app-development/",
        destination: "https://www.digitales.pk/services/web-app-development",
        permanent: true,
      },
      {
        source: "/service/enterprise-software",
        destination: "https://www.digitales.pk/services/enterprise-software",
        permanent: true,
      },
      {
        source: "/service/enterprise-software/",
        destination: "https://www.digitales.pk/services/enterprise-software",
        permanent: true,
      },

      // Canonical host: all remaining non-www URLs go to the www HTTPS version.
      {
        source: "/:path*",
        has: [{ type: "host", value: "digitales.pk" }],
        destination: "https://www.digitales.pk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
