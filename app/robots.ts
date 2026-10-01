import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.digitales.pk/sitemap.xml",
    host: "https://www.digitales.pk",
  };
}
