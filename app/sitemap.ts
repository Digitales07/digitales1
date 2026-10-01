import type { MetadataRoute } from "next";
import { CASE_STUDIES, SERVICES } from "@/lib/site";

const BASE_URL = "https://www.digitales.pk";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/contact",
    "/free-audit",
    "/relief-os",
    "/dartx",
    "/privacy-policy",
    "/terms-of-service",
  ];

  const serviceRoutes = SERVICES.map((service) => `/services/${service.slug}`);
  const portfolioRoutes = CASE_STUDIES.map((study) => `/portfolio/${study.slug}`);

  return [...staticRoutes, ...serviceRoutes, ...portfolioRoutes].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/services/") ? 0.8 : 0.7,
  }));
}
